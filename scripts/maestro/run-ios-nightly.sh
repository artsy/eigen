#!/bin/bash
set -euxo pipefail

curl https://api.copilot.mobile.dev/v2/project/$MAESTRO_IOS_PROJECT_ID/run \
  -d '{
        "buildTag": "nightly",
        "testSuiteId": "'"$MAESTRO_NIGHTLY_IOS_TEST_SUITE_ID"'"
    }' \
  -H "Authorization: Bearer $MAESTRO_COPILOT_API_KEY" \
  -H "Content-Type: application/json"
