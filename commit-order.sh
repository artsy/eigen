#!/bin/bash

# Define the main branch name
main_branch="main"

# File containing the commit hashes
commit_file="commits.txt"

# Temporary file to store commit date and hash
temp_file=$(mktemp)


# Read each commit hash and get its commit date in the main branch
# Check if the read operation succeeds and if the variable contains data
while IFS= read -r commit_hash || [[ -n $commit_hash ]]; do
    # Retrieve the commit date for the given hash in ISO 8601 format
    commit_date=$(git log -1 --format="%ci" ${commit_hash} ${main_branch})
    if [ -n "$commit_date" ]; then
        echo "${commit_date} ${commit_hash}" >> ${temp_file}
    else
        echo "No date found for $commit_hash"
    fi
done < ${commit_file}

cat ${temp_file}

# Sort the temporary file by date, extract the hashes
sorted_hashes=$(sort -k1,1 ${temp_file} | awk '{print $4}')

# Output the sorted hashes
echo "Sorted commit hashes:"
echo "${sorted_hashes}"

# Remove the temporary file
rm ${temp_file}
