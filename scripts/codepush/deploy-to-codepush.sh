#!/bin/bash
set -euxo pipefail

# Check if the correct number of arguments is provided
if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $0 <deployment> [description]"
  echo "Deployment must be either 'Canary' or 'Staging'."
  exit 1
fi

# Get the deployment option from the command-line argument
deployment=$1

# Validate the deployment option
if [ "$deployment" != "Canary" ] && [ "$deployment" != "Staging" ]; then
  echo "Invalid deployment option: $deployment"
  echo "Deployment must be either 'Canary' or 'Staging'."
  exit 1
fi

# Get the description from the command-line argument if provided, otherwise use the last commit hash and description
description=""
if [ -n "${2:-}" ]; then
  description="$2"
else
  commit_hash=$(git rev-parse --short HEAD)
  commit_description=$(git log -1 --pretty=%s)
  description="Commit: $commit_hash, Description: $commit_description"
fi

# Deploy to codepush
bundle exec fastlane deploy_to_codepush deployment_name:$deployment description:"$description" platform:ios
bundle exec fastlane deploy_to_codepush deployment_name:$deployment description:"$description" platform:android

echo "Release to $deployment deployment successful."
