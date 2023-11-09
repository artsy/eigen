#!/bin/bash
set -euo pipefail

# Step 1: Check if a commit hash is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <commit-hash>"
    exit 1
fi

commit_hash=$1

# Step 2: Calculate initial hash of native code
initial_hash=$(./scripts/codepush/calculate-native-hash.sh)
if [ $? -ne 0 ]; then
    echo "Error calculating initial native code hash"
    exit 2
fi

echo "Initial native code hash: $initial_hash"

# Step 3: Cherry-pick the provided commit
git cherry-pick "$commit_hash"
if [ $? -ne 0 ]; then
    echo "Error cherry-picking commit: $commit_hash"
    exit 3
fi

# Step 4: Calculate final hash of native code
final_hash=$(./scripts/codepush/calculate-native-hash.sh)
if [ $? -ne 0 ]; then
    echo "Error calculating final native code hash"
    exit 4
fi

echo "Final native code hash: $final_hash"

# Step 5: Compare hashes and output message
if [ "$initial_hash" != "$final_hash" ]; then
    echo -e "\033[0;31mWarning: native code changed you cannot use codepush for this hotfix, please follow the native release hotfix process steps.\033[0m"
else
    echo "Fix applied and native code did not change! You can continue with the codepush release process."
fi
