#!/bin/bash

# Get the native code version before the merge (from the main branch)
pre_merge_native_code_version=$(git show main:app.json | jq -r '.nativeCodeVersion | to_entries | reduce .[] as $item (0; . as $key | if $item.key | tonumber > $key then $item.key | tonumber else $key end)')

# Get the native code version after the merge (from the current commit)
post_merge_native_code_version=$(jq -r '.nativeCodeVersion | to_entries | reduce .[] as $item (0; . as $key | if $item.key | tonumber > $key then $item.key | tonumber else $key end)' app.json)

# Compare the native version numbers before and after the merge
if [ "$pre_merge_native_code_version" != "$post_merge_native_code_version" ]; then
  # If the native version number has changed, then we need to deploy a new native build
  echo "beta"
else
  # If the native version number has not changed, then we can deploy using codepush
  echo "codepush"
fi
