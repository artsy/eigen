#!/bin/bash
set -euxo pipefail

S3_BUCKET_PATH="s3://artsy-citadel/eigen/native-hash.txt"

# Calculate the current native hash
current_native_hash=$(./scripts/codepush/calculate-native-hash.sh)

aws s3 cp $S3_BUCKET_PATH ./native-hash.txt > /dev/null || echo "No previous native hash found." >&2

if [ -f ./native-hash.txt ]; then
  previous_native_hash=$(cat ./native-hash.txt)
else
  previous_native_hash=""
fi

# Compare the current native hash with the previous one
if [ "$current_native_hash" != "$previous_native_hash" ]; then
  # Save the current native hash to S3
  echo $current_native_hash | aws s3 cp - $S3_BUCKET_PATH > /dev/null

  # If the native hash has changed, then we need to deploy a new native build
  echo "beta"
else
  # If the native hash has not changed, then we can deploy using codepush
  echo "codepush"
fi
