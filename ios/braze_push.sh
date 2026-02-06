curl -X "POST" "https://rest.iad-06.braze.com/messages/send" \
-H 'Authorization: Bearer 196ffa48-9f3c-4396-ae6f-121c43398a68' \
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
