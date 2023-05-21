#!/bin/bash
# Treats errors and failing conditions sooner and better.
set -euo pipefail

# Check if .env file exists.
if [ ! -f .env ]; then
  echo "The .env file does not exist. Please create it and set the appropriate environment variables."
  exit 1
fi

# Load environment variables from .env file.
source .env

# Validate required environment variables.
if [[ -z "${DEVELOPMENT_BASE_PATH}" ]] || [[ -z "${PRODUCTION_BASE_PATH}" ]]; then
  echo "Please set the appropriate path in the .env file."
  exit 1
fi

# Determine the path based on the NODE_ENV variable or default to development.
if [[ "${NODE_ENV:-}" == "production" ]]; then
  path="$PRODUCTION_BASE_PATH"
else
  path="$DEVELOPMENT_BASE_PATH"
fi

file="dump/catalogue.json"

echo "*** Parsing the list and the full catalogue. This will take a while..."

# Clear the file content before appending new data.
> "$file"

# Append tree output to the file.
tree -JNd -L 3 "$path" >> "$file"

echo "*** Updated list"
