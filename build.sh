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
if [[ -z "${BASE_PATH}" ]]; then
  echo "Please set the path in the .env file."
  exit 1
fi

file="dump/catalogue.json"

echo "*** Parsing the list and the full catalogue. This will take a while..."

# Clear the file content before appending new data.
> "$file"

# Append tree output to the file.
tree -JNd -L 3 "$BASE_PATH" >> "$file"

echo "*** Updated list"
