#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ]; then
    echo "Skipping deploy of the commit"
    exit 0
fi

# Give us a CLI to work with
yarn global add s3-cli

# Createa bundle with embedded storybooks also into Emission.js
yarn bundle-with-storybooks

# Uploads the file to our s3 bucket - credentials are in the ENV vars for same-repo PRs
s3-cli put Emission.js "s3://artsy-emission-js/$TRAVIS_PULL_REQUEST.js"
