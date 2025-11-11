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
"external_user_ids": ["5fce98bf9981c52222061eea"],
"messages": {
"android_push": {
"title": "Some title",
"alert": "I should link to kaws",
"push_icon_image_url": "https://picsum.photos/200/300",
"custom_uri": "artsy://artist/kaws",
"extra": {
"data": {
"url": "artsy://artist/kaws"
},
"url": "artsy://artist/kaws"
}
}
}
}'