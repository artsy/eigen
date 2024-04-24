#!/bin/bash

### Script to sort commit hashes by commit date in the main branch
### Useful when trying to cherry-pick many commits to minimize conflicts
### Save the commit hashes (each on its own line) to a file 'commits.txt' in the app directory and run the script

# File containing the commit hashes
commit_file="commits.txt"

# Temporary file to store commit date and hash
temp_file=$(mktemp)


# Read each commit hash and get its commit date in the main branch
# Check if the read operation succeeds and if the variable contains data
# Save to temp_file
while IFS= read -r commit_hash || [[ -n $commit_hash ]]; do
    # Retrieve the commit date for the given hash in ISO 8601 format
    commit_date=$(git log -1 --format="%ci" ${commit_hash})
    if [ -n "$commit_date" ]; then
        echo "${commit_date} ${commit_hash}" >> ${temp_file}
    else
        echo "No date found for $commit_hash"
    fi
done < ${commit_file}

cat ${temp_file}

# Sort the temporary file by date, extract the hashes
sorted_hashes=$(sort -k1,1 ${temp_file} | awk '{print $4}')

echo "Sorted commit hashes:"
echo "${sorted_hashes}"

rm ${temp_file}
