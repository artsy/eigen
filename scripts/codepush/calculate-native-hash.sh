#!/bin/bash
set -euo pipefail

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
  exclusion_string=""
  for exclusion in ${ios_exclusions[@]}; do
    exclusion_string+=" -not -path ./${exclusion}\*"
  done

  find_command="find $path -type f \( -name \"${ios_extensions_to_check[0]}\" $(printf " -o -name \"%s\"" "${ios_extensions_to_check[@]:1}") \) $exclusion_string -print0"

  eval $find_command | xargs -0 shasum >> $hashes_file
done

# Sort the files to ensure consistency accross systems
sort $hashes_file -o $hashes_file

# Calculate the final hash
calculated_hash=$(shasum $hashes_file | awk '{print $1}')

# Output the calculated hash
echo $calculated_hash
