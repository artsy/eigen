#!/bin/bash

SCRIPT_DIR=$(dirname "$(realpath "$0")")

sdk_names_file="$SCRIPT_DIR/required_reason_common_sdk_names.txt"

podfile="$SCRIPT_DIR/../../ios/Podfile.lock"
yarnfile="$SCRIPT_DIR/../../yarn.lock"

RED='\033[0;31m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m'

found_in_yarn=""
found_in_pod=""

if [ ! -f "$sdk_names_file" ]; then
    echo -e "${RED}The file $sdk_names_file containing SDK names does not exist.${NO_COLOR}"
    exit 1
fi

while IFS= read -r sdk
do
    echo -e "Searching for SDK: ${GREEN}$sdk${NO_COLOR}"

    if ggrep --color=always -Hn "$sdk" "$podfile"; then
        echo -e "${GREEN}Found in $podfile${NO_COLOR}"
        found_in_pod="${found_in_pod}${sdk}\n"
    else
        echo "Not found in $podfile"
    fi

    if ggrep --color=always -Hn "$sdk" "$yarnfile"; then
        echo -e "${GREEN}Found in $yarnfile${NO_COLOR}"
        found_in_yarn="${found_in_yarn}${sdk}\n"
    else
        echo "Not found in $yarnfile"
    fi

    echo "--------------------------------"
done < "$sdk_names_file"

# Print summary
echo -e "${GREEN}Found sdk usage:${NO_COLOR}"
if [ -n "$found_in_pod" ]; then
    echo -e "${GREEN}In Podfile.lock:${NO_COLOR}"
    echo -e "${found_in_pod}" | sort | uniq
fi
if [ -n "$found_in_yarn" ]; then
    echo -e "${GREEN}In yarn.lock:${NO_COLOR}"
    echo -e "${found_in_yarn}" | sort | uniq
fi
