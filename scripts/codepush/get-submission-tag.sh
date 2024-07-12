#!/bin/bash
set -euo pipefail

# fetch the latest description from the deployment history the naming patern is "some description version:codepush-canary-ios-8.39.0-2024.05.10.09
description=$(appcenter codepush deployment history -a mobile-artsy/Eigen Canary --output json | jq '.[-1][4]')

# extract the version from the description
if [[ $description =~ version:(.*) ]]; then
  extracted_string="${BASH_REMATCH[1]}"
  modified_string="${extracted_string//staging/submission}"
  modified_string="${modified_string//canary/submission}"
  echo "$modified_string"
fi
