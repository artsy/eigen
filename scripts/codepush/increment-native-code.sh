#!/bin/bash

# Get the directory of the currently executing script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Calculate the hash
calculated_hash=$("$DIR/calculate-native-hash.sh")

# Retrieve the current native code version from app.json
native_code_version=$(jq -r '.nativeCodeVersion | to_entries | reduce .[] as $item (0; . as $key | if $item.key | tonumber > $key then $item.key | tonumber else $key end)' app.json)

# Retrieve the current hash value
current_hash_value=$(jq -r --arg version "$native_code_version" '.nativeCodeVersion[$version]' app.json)

# Check if the hash value changed
if [ "$calculated_hash" == "$current_hash_value" ]; then
  echo "Native code has not changed. Exiting."
  exit 1
fi

# Increment the native code version
new_native_code_version=$((native_code_version + 1))

# Update app.json by deleting the old native code version and adding the new one
jq --arg old_version "$native_code_version" --argjson new_version "$new_native_code_version" --arg hash "$calculated_hash" 'del(.nativeCodeVersion[$old_version | tostring]) | .nativeCodeVersion[($new_version | tostring)] = $hash' app.json > tmp.json && mv tmp.json app.json

