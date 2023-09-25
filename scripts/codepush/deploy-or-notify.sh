#!/bin/bash
set -euxo pipefail

export DEPLOYMENT_TYPE=$(./scripts/codepush/determine-deployment-type.sh)

if [ "$DEPLOYMENT_TYPE" == "codepush" ]; then
  echo "Triggering CodePush deployment..."
  yarn global add appcenter-cli
  bundle install
  yarn install
  ./scripts/codepush/deploy-to-codepush.sh Staging
else
  echo "Native code changed, notifying new beta needed!"
  bundle install
  bundle exec fastlane notify_beta_needed
fi
