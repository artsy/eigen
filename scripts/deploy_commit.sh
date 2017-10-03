#!/bin/sh

# Give us a CLI to work with
yarn global add s3-cli

# Createa bundle with embedded storybooks also into Emission.js
yarn bundle-with-storybooks

# Uploads the file to our s3 bucket - credentials are in the ENV vars for same-repo PRs
s3-cli put Pod/Assets/Emission.js "s3://artsy-emission-js/$TRAVIS_PULL_REQUEST.js"
