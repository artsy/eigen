#!/bin/bash
set -euxo pipefail

# Check if the correct number of arguments is provided
if [ "$#" -lt 1 ] || [ "$#" -gt 1 ]; then
  echo "Usage: $0 <rollout_percentage e.g. 50>"
  exit 1
fi

# Get the rollout_percentage option from the command-line argument
rollout_percentage=$1

bundle exec fastlane promote_codepush rollout_percentage:$rollout_percentage
