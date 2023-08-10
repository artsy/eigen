#!/bin/bash

# Directory paths to be checked for changes
# TODO: Check dependency-locks when enabled
declare -a paths_to_check=(
    "./android"
    "./ios"
    "./ios/Podfile.lock"
)

# Generate a hash from the contents of the above paths
calculated_hash=$(find ${paths_to_check[@]} -type f -print0 | sort -z | xargs -0 shasum | shasum | awk '{print $1}')

# Get the latest native code version
native_code_version=$(jq -r '.nativeCodeVersion | to_entries | reduce .[] as $item (0; . as $key | if $item.key | tonumber > $key then $item.key | tonumber else $key end)' app.json)

# Get the corresponding hash value
stored_hash=$(jq -r --arg version "$native_code_version" '.nativeCodeVersion[$version]' app.json)

if [ "$stored_hash" != "$calculated_hash" ]; then
  echo "Native code has changed but the native code version hasn't been incremented."
  exit 1
fi

echo "Native code is up to date."
