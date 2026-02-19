#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

write_index_json() {
  content_dir="$1"
  index_file="$content_dir/index.json"
  list_file="$(mktemp "${TMPDIR:-/tmp}/sync-list.XXXXXX")"
  json_file="$(mktemp "${TMPDIR:-/tmp}/sync-json.XXXXXX")"

  find "$content_dir" -maxdepth 1 -type f -name "*.md" -exec basename {} \; | LC_ALL=C sort > "$list_file"

  {
    printf "[\n"
    first=1
    while IFS= read -r name; do
      escaped_name="$(printf '%s' "$name" | sed 's/\\/\\\\/g; s/"/\\"/g')"
      if [ "$first" -eq 1 ]; then
        printf '  "%s"' "$escaped_name"
        first=0
      else
        printf ',\n  "%s"' "$escaped_name"
      fi
    done < "$list_file"

    if [ "$first" -eq 0 ]; then
      printf "\n"
    fi
    printf "]\n"
  } > "$json_file"

  mv "$json_file" "$index_file"
  rm -f "$list_file"
  printf "Updated %s\n" "$index_file"
}

for section in blogs research work-blogs; do
  dir_path="$ROOT_DIR/data/$section"
  if [ ! -d "$dir_path" ]; then
    printf "Missing directory: %s\n" "$dir_path" >&2
    exit 1
  fi
  write_index_json "$dir_path"
done
