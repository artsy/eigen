#!/bin/bash
set -euo pipefail

# Send a braze push notification to the mobileqa2 user
# Must be in a testflight or production build

# Check if API token is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <BRAZE_API_TOKEN>"
  echo "Example: $0 your-api-token-here"
  exit 1
fi

API_TOKEN="$1"

curl -X "POST" "https://rest.iad-06.braze.com/messages/send" \
-H "Authorization: Bearer ${API_TOKEN}" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{
"messages": {
"apple_push": {
"custom_uri": "artsy://artist/kaws",
"alert": {
"title": "Some title",
"body": "I should link to kaws"
},
"asset_file_type": "jpg",
"asset_url": "https://picsum.photos/200/300",
"mutable_content": true
}
},
"external_user_ids": [
"5fce98bf9981c52222061eea"
],
"content-available": true,
"override_frequency_capping": true,
"alert": "Test notification",
"broadcast": false
}'