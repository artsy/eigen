#!/bin/sh

# Give us a CLI to work with
yarn global add s3-cli

# Createa bundle with embedded storybooks also into Emission.js
yarn bundle-with-storybooks

# Uploads the file to our s3 bucket - credentials are in the ENV vars for same-repo PRs
s3-cli put Pod/Assets/Emission.js "s3://artsy-emission-js/Emission-master.js"

# Get the most recent PR commit
SHA=`git rev-list --min-parents=2 --max-count=1 HEAD`

# Pull the name of the PR out of the auto-generated commit description
PR_DESC=`git log --format=%B -n 1 $SHA | tail -1`

# Get the PR number out of the merge commit title
PR_NUM=`git log --format=%B -n 1 $SHA | grep -Eo '#[0-9]+' | tail -n 1`

# Create a metadata file
echo "{\"title\":\"Downloading $SHA\",\"subtitle\":\"$PR_DESC\", \"pr\": $PR_NUM }" > head_metadata.json

# Uploads the metadata so that the app can show some info
s3-cli put head_metadata.json "s3://artsy-emission-js/master-metadata.json"
