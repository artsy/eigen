#!/bin/bash

# Directory paths to be checked for changes
declare -a android_paths_to_check=("./android/app/src")
declare -a android_extensions_to_check=("*.java" "*.kt" "*.cpp")
declare -a ios_paths_to_check=("./ios")
declare -a ios_exclusions=("ios/Pods/" "ios/build/generated/" "ios/ArtsyTests/")
declare -a ios_extensions_to_check=("*.m" "*.mm" "*.swift" "*.h")

# File to store the hashes
hashes_file="file_hashes.txt"
rm -f $hashes_file

# Generate a hash from the contents of the Android paths
for path in ${android_paths_to_check[@]}; do
  find $path -type f \( -name "${android_extensions_to_check[0]}" $(printf " -o -name %s" "${android_extensions_to_check[@]:1}") \) -print0 | xargs -0 shasum >> $hashes_file
done

find "./ios/Podfile.lock" -type f -print0 | xargs -0 shasum >> $hashes_file

# Loop through the iOS paths and apply exclusions
for path in ${ios_paths_to_check[@]}; do
  echo "Checking path $path"
  exclusion_string=""
  for exclusion in ${ios_exclusions[@]}; do
    echo "Excluding $exclusion"
    exclusion_string+=" -not -path ./${exclusion}\*"
  done

  find_command="find $path -type f \( -name \"${ios_extensions_to_check[0]}\" $(printf " -o -name \"%s\"" "${ios_extensions_to_check[@]:1}") \) $exclusion_string -print0"

  echo $find_command
  eval $find_command | xargs -0 shasum >> $hashes_file
done

# Sort the files to ensure consistency accross systems
sort $hashes_file -o $hashes_file

# Calculate the final hash
calculated_hash=$(shasum $hashes_file | awk '{print $1}')

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

