#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <deployment>"
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

# Run the appcenter codepush release-react command with the specified deployment option
appcenter codepush release-react -a mobile-artsy/Eigen -d $deployment --plist-file-prefix ios/Artsy/App_Resources

echo "Release to $deployment deployment successful."