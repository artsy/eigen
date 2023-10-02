#!/bin/bash
set -euxo pipefail

# Calculate the current native hash
current_native_hash=$(./scripts/codepush/calculate-native-hash.sh)

# Read the previous native hash from the cache
if [ -f ./native-hash.txt ]; then
  previous_native_hash=$(cat ./native-hash.txt)
else
  previous_native_hash=""
fi

# Compare the current native hash with the previous one
if [ "$current_native_hash" != "$previous_native_hash" ]; then
  # If the native hash has changed, then we need to deploy a new native build
  echo "beta"
else
  # If the native hash has not changed, then we can deploy using codepush
  echo "codepush"
fi

# Save the current native hash for the next build
echo $current_native_hash > ./native-hash.txt
