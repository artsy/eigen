// The Mobile App QA Notion template that gets duplicated for each release.
// Uses the flat `392cab07…a54b` template so databases keep their layout
// (the nested `023cb09f…` template lands them at the page bottom).
export const QA_TEMPLATE_URL =
  "https://www.notion.so/artsy/2026-MM-DD-Mobile-App-QA-version-A-B-C-iOS-build-2026-W-X-Y-Z-Android-build-XYZ-392cab0764a080a293abc71acfc2a54b"

// Where each duplicated QA page is created (as a subpage at the end of this
// page). Must be shared with the NOTION_RELEASE_LOOKOUT_TOKEN integration.
export const QA_DESTINATION_URL =
  "https://www.notion.so/artsy/Mobile-App-QA-decba0c3a57a4508b726f3a8624ceca3"
