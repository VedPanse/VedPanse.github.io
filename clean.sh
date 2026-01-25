#!/bin/sh
set -eu

# Delete all .DS_Store files under the project root.
find "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)" -type f -name ".DS_Store" -delete
