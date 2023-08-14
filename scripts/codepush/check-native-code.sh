#!/bin/bash

# Get the directory of the currently executing script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Calculate the hash
calculated_hash=$("$DIR/calculate-native-hash.sh")

# Get the latest native code version
native_code_version=$(jq -r '.nativeCodeVersion | to_entries | reduce .[] as $item (0; . as $key | if $item.key | tonumber > $key then $item.key | tonumber else $key end)' app.json)

# Get the corresponding hash value
stored_hash=$(jq -r --arg version "$native_code_version" '.nativeCodeVersion[$version]' app.json)

if [ "$stored_hash" != "$calculated_hash" ]; then
  echo "$stored_hash $calculated_hash" # Output the hashes
  echo "Native code has changed but the native code version hasn't been incremented."
  exit 1
fi

echo "Native code is up to date."
