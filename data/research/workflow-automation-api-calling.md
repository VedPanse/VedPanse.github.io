---
label: Research Notes,Web Spiders,Siri++
date: February 20, 2026
title: API service learning for efficient tool calling
excerpt: Multi-modal virtual assistants need to maintain and learn the structure of the internet for tool calling. However, APIs are limited.
---

![](assets/banners/tools.png)

For a virtual assistant to be truly smart, it needs to call multiple online tools and services. We cannot rely on browser automation all the time, since it will massively slow down the process. Our virtual assistants must have the capability to make direct API calls.

We cannot simply give them a giant blob of all API features and entire catalogs. As discussed in the earlier blog, this is only going to create more noise and reduce decision quality.

### Tool registry + capability-retrieval layer

In simple terms, we maintain a cloud-hosted database containing a normalized description for each tool:

1. what it does (intent)
2. what inputs it needs (schema)
3. what it returns (schema)
4. constraints (authentication requirements, rate limits, cost, safety rules)
5. examples (1–2 minimal examples)

When the agent needs to look up a particular service, it can perform a semantic search over this registry to retrieve only the relevant tool capabilities, instead of loading entire API specifications.

### Tool router

In the previous blog, I discussed building tools for smarter and faster browser automation. To make our AI agent fast, efficient, and capable, we need to develop a tool router that assigns a job either to an API service or to our smart browser automation tool.

> A “job” here refers to a single task. There may be a cluster of jobs that require both APIs and browser automation, but we can treat them as a chain of smaller jobs executed sequentially.

### Registering API service communications

Some API services will be globally available to all users. We can store these in the cloud in YAML format.

Additionally, if a user wants to register a new API service, they can instruct the AI agent to register it. In that case, the agent can:

1. Attempt to read the documentation via web scraping, parse it using an LLM, and add a structured representation to a local database of user-registered API services.
2. Use browser automation to systematically read the documentation and then register it locally.

### Registration contract

Let’s say we are registering [DoorDash](https://developer.doordash.com/en-US/docs/drive/tutorials/get_started/) as a tool. Below is the precise structure we can follow for a tool registration contract:

```yml
# doordash_drive.tool.yaml
# Example "tool registry" spec for DoorDash Drive API capabilities.
# Goal: capture ONLY what the agent needs to call the API safely + reliably (not the entire docs).

tool:
  id: doordash.drive
  name: DoorDash Drive API
  version: "2.1.2"
  description: >
    DoorDash Drive lets you request deliveries fulfilled by Dashers.
    This tool exposes a small set of delivery capabilities (quote, accept, create, get, update, cancel).
  docs:
    getting_started: "https://developer.doordash.com/en-US/docs/drive/tutorials/get_started/"
    api_reference: "https://developer.doordash.com/en-US/api/drive/"
  environments:
    sandbox:
      base_url: "https://openapi.doordash.com"
    production:
      base_url: "https://openapi.doordash.com"
      notes: >
        Production access may be restricted; ensure credentials and certification are approved.

auth:
  type: jwt_bearer
  header: "Authorization"
  token_prefix: "Bearer"
  jwt:
    issuer: "${DOORDASH_ISSUER}"          # stored in secrets manager
    key_id: "${DOORDASH_KEY_ID}"          # from Developer Portal credential
    signing_secret: "${DOORDASH_SECRET}"  # never shown to the model
    audience: null
    algorithm: "HS256"                    # example; use whatever DoorDash issues for your key
    ttl_seconds: 300
  failure_modes:
    - code: missing_credentials
      message: "DoorDash credentials are not configured."
      recover: "Ask user/admin to configure DoorDash Developer Portal credentials."
    - code: unauthorized
      http_status: [401, 403]
      message: "DoorDash rejected the JWT (unauthorized)."
      recover: "Regenerate JWT; if persistent, credentials/scopes/environment are incorrect."

http:
  default_headers:
    Content-Type: "application/json"
  retries:
    # DoorDash Drive docs recommend retrying transient 5xx errors (up to 3 retries).
    on_status: [500, 502, 503, 504]
    max_attempts: 3
    backoff: exponential
    base_delay_ms: 250
    max_delay_ms: 2000
  timeouts:
    connect_ms: 1500
    read_ms: 8000
  idempotency:
    enabled: true
    key_header: "Idempotency-Key"
    key_strategy: "hash(capability_name + stable_request_fingerprint)"

policies:
  # Important: Drive is delivery logistics, not restaurant ordering checkout.
  # However, it can still trigger real operational costs, so keep it gated if necessary.
  user_confirmation:
    default: false
    require_for:
      - doordash.drive.create_delivery
      - doordash.drive.cancel_delivery
      - doordash.drive.update_delivery
  pii_handling:
    # Pickup/dropoff phone numbers and addresses are required for some calls.
    allowed_fields:
      - pickup_address
      - dropoff_address
      - pickup_phone_number
      - dropoff_phone_number
    storage: "do_not_log_raw"   # log hashes or redacted versions only
  safety:
    disallow:
      - "attempt to guess phone numbers or addresses"
      - "submit payments"       # Drive API here is not a payment tool

capabilities:
  - name: doordash.drive.create_quote
    summary: "Confirm that a delivery is serviceable and get an estimated cost."
    method: POST
    path: "/drive/v2/quotes"
    input_schema:
      type: object
      required:
        - external_delivery_id
        - dropoff_address
        - dropoff_phone_number
      properties:
        external_delivery_id:
          type: string
          description: "Unique ID generated by the caller for the delivery."
        pickup_address:
          type: string
        pickup_phone_number:
          type: string
        dropoff_address:
          type: string
        dropoff_phone_number:
          type: string
        order_fulfillment_method:
          type: string
          enum: ["standard", "parcel", "shop_stage", "shop_deliver", "shop_handoff", "large_order"]
        locale:
          type: string
          enum: ["en-US", "fr-CA", "es-US"]
    output_schema:
      type: object
      description: "Quote object containing fee estimate, serviceability, and timing."
    errors:
      - http_status: 409
        code: duplicate_delivery_id
        recover: "Generate a new external_delivery_id or consistently reuse the prior one."
    examples:
      - input:
          external_delivery_id: "D-1763"
          pickup_address: "901 Market Street 6th Floor San Francisco, CA 94103"
          pickup_phone_number: "+16505555555"
          dropoff_address: "901 Market Street 6th Floor San Francisco, CA 94103"
          dropoff_phone_number: "+16505555555"
          order_fulfillment_method: "standard"
          locale: "en-US"

  - name: doordash.drive.accept_quote
    summary: "Accept a previously created quote to start the delivery process."
    method: POST
    path: "/drive/v2/quotes/{external_delivery_id}/accept"
    path_params:
      external_delivery_id: { type: string, required: true }
    input_schema:
      type: object
      properties:
        tip:
          type: integer
          minimum: 0
          description: "Tip in cents (or the lowest currency denomination)."
        dropoff_phone_number:
          type: string
    output_schema:
      type: object
      description: "Delivery object created from the accepted quote."
    policies:
      user_confirmation: false
    examples:
      - input:
          external_delivery_id: "D-1763"
          tip: 599
          dropoff_phone_number: "+16505555555"

  - name: doordash.drive.create_delivery
    summary: "Create a delivery directly."
    method: POST
    path: "/drive/v2/deliveries"
    input_schema:
      type: object
      required: ["external_delivery_id", "dropoff_address", "dropoff_phone_number"]
      properties:
        external_delivery_id: { type: string }
        pickup_address: { type: string }
        pickup_phone_number: { type: string }
        dropoff_address: { type: string }
        dropoff_phone_number: { type: string }
        pickup_instructions: { type: string }
        dropoff_instructions: { type: string }
    output_schema:
      type: object
      description: "Created delivery object."
    policies:
      user_confirmation: true

  - name: doordash.drive.get_delivery
    summary: "Fetch delivery status and details."
    method: GET
    path: "/drive/v2/deliveries/{external_delivery_id}"
    path_params:
      external_delivery_id: { type: string, required: true }
    input_schema:
      type: object
      required: ["external_delivery_id"]
      properties:
        external_delivery_id: { type: string }
    output_schema:
      type: object
      description: "Delivery object including its current state."
    policies:
      user_confirmation: false

  - name: doordash.drive.update_delivery
    summary: "Update delivery details before the cutoff time."
    method: PATCH
    path: "/drive/v2/deliveries/{external_delivery_id}"
    path_params:
      external_delivery_id: { type: string, required: true }
    input_schema:
      type: object
      properties:
        pickup_instructions: { type: string }
        dropoff_instructions: { type: string }
        dropoff_phone_number: { type: string }
    output_schema:
      type: object
      description: "Updated delivery object."
    policies:
      user_confirmation: true

  - name: doordash.drive.cancel_delivery
    summary: "Cancel a delivery."
    method: PUT
    path: "/drive/v2/deliveries/{external_delivery_id}/cancel"
    path_params:
      external_delivery_id: { type: string, required: true }
    input_schema:
      type: object
      required: ["external_delivery_id"]
      properties:
        external_delivery_id: { type: string }
    output_schema:
      type: object
      description: "Cancellation confirmation and resulting delivery state."
    policies:
      user_confirmation: true

tooling:
  retrieval:
    # What the agent sees after semantic search.
    # Keep these short so the LLM can choose correctly.
    embedding_text_fields:
      - "tool.description"
      - "capabilities[].name"
      - "capabilities[].summary"
  presentation_to_model:
    include_fields:
      - tool.id
      - tool.name
      - environments.sandbox.base_url
      - auth.type
      - capabilities[].name
      - capabilities[].summary
      - capabilities[].method
      - capabilities[].path
      - capabilities[].input_schema
      - policies.user_confirmation
```