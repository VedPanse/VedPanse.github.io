#!/bin/sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

write_index() {
  target_dir="$1"
  output_file="$2"
  mode="$3"

  if [ ! -d "$target_dir" ]; then
    echo "Missing directory: $target_dir" >&2
    return 1
  fi

  if [ "$mode" = "markdown" ]; then
    find "$target_dir" -maxdepth 1 -type f -name "*.md" ! -name "index.json" 2>/dev/null | sort | awk -F/ '
    BEGIN {
      print "[";
      first = 1;
    }
    {
      file = $NF;
      if (file == "") next;
      if (!first) {
        printf ",\n";
      }
      first = 0;
      printf "  \"%s\"", file;
    }
    END {
      print "";
      print "]";
    }
  ' > "$output_file"
  else
    find "$target_dir" -maxdepth 1 -type f ! -name "index.json" 2>/dev/null | sort | awk -F/ '
    BEGIN {
      print "[";
      first = 1;
    }
    {
      file = $NF;
      if (file == "") next;
      if (!first) {
        printf ",\n";
      }
      first = 0;
      printf "  \"%s\"", file;
    }
    END {
      print "";
      print "]";
    }
  ' > "$output_file"
  fi

  echo "Wrote $output_file"
}

write_recursive_index() {
  target_dir="$1"
  output_file="$2"

  if [ ! -d "$target_dir" ]; then
    echo "Missing directory: $target_dir" >&2
    return 1
  fi

  (
    cd "$target_dir"
    find . -type f ! -name "index.json" -print | sed 's|^\./||'
  ) | sort | awk '
    BEGIN {
      print "[";
      first = 1;
    }
    {
      file = $0;
      if (file == "") next;
      if (!first) {
        printf ",\n";
      }
      first = 0;
      printf "  \"%s\"", file;
    }
    END {
      print "";
      print "]";
    }
  ' > "$output_file"

  echo "Wrote $output_file"
}

write_index "$ROOT_DIR/data/blogs" "$ROOT_DIR/data/blogs/index.json" "markdown"
write_index "$ROOT_DIR/data/research" "$ROOT_DIR/data/research/index.json" "markdown"
write_index "$ROOT_DIR/data/work-blogs" "$ROOT_DIR/data/work-blogs/index.json" "markdown"
write_index "$ROOT_DIR/assets/banners/work" "$ROOT_DIR/assets/banners/work/index.json" "all-files"
write_recursive_index "$ROOT_DIR/assets/work" "$ROOT_DIR/assets/work/index.json"
