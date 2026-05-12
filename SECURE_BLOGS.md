# Secure Blogs

Secure blog markdown lives locally under:

```text
secure-blogs/<vault>/<post>.md
```

Those `.md` files are ignored by git. Do not commit plaintext secure blogs to this public repository.

Generate encrypted public payloads with:

```sh
SECURE_BLOG_PASSWORD='your vault password' node scripts/encrypt-secure-blogs.mjs
```

For a per-vault password, use the vault-specific environment variable:

```sh
SECURE_BLOG_PASSWORD_COMPANY_ALPHA='your vault password' node scripts/encrypt-secure-blogs.mjs
```

That encrypts `secure-blogs/company-alpha/*.md` into:

```text
data/secure-blogs/company-alpha/*.json
```

Read a secure post at:

```text
secure-blog.html?vault=company-alpha&post=post-slug
```

## Security Model

This is password-based client-side decryption for a static site. The public site only serves encrypted JSON payloads, and the password is never stored in the repo or sent to a server.

This is still not a substitute for server-side access control. Anyone can download the encrypted payload and try passwords offline. Use long, random passwords. For real company secrets, use a private backend with authentication, authorization, logging, rate limits, and secret storage.
