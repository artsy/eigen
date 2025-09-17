#!/bin/bash

### Script to get merge commit corresponding to a given PR number
### e.g if you want to see the commit hash for https://github.com/artsy/eigen/pull/10107
### Run the script as `./scripts/utils/commit-hash-from-pr.sh 10107`
### The merge commit is usually the commit you want to cherry-pick into release candidates
### Requires running `yarn setup:releases` to set up the environment variables

source .env.releases

OWNER="artsy"
REPO="eigen"

PR_NUMBER=$1

API_URL="https://api.github.com/repos/${OWNER}/${REPO}/pulls/${PR_NUMBER}"
pr_data=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" "${API_URL}")

# Extract the merge commit hash
merge_commit=$(echo "${pr_data}" | jq -r '.merge_commit_sha')

if [ "${merge_commit}" != "null" ]; then
    echo "Merge commit for PR #${PR_NUMBER}: ${merge_commit}"
else
    echo "No merge commit found for PR #${PR_NUMBER}. It might not be merged yet."
fi
