## Undeployed Changes

### v6.10.1

- Status: **Beta**
- Changelog update date: **Wed Jul 21 2021 19:16:05 GMT+0000 (Coordinated Universal Time)**
- Changelog:

  - User facing changes:

    - Set the filter facets on iOS match the Artsy Copy Style Guide.
    - Stop jerky movement of multiple toasts - dzmitry tratsiak
    - Change the screen title from "Auction Results for You" to "Auction Results for Artists You Follow".
    - Enables users to delete saved addresses
    - default view of an address when multiple are saved
    - Implemented SavedAddresses List Item
    - Display "Recently added" sort by filter value when tap open saved search notification - dzmitry tratsiak
    - Fix spacing on Viewing Room Artworks - pavlos

  - Dev changes:
    - Define separate feature flag for controlling saved search on Android
    - Use the right key for braze - Brian
    - Enable verbose logging for braze sdk - Brian
    - Fix .netrc during pod install for duplicate mapbox tokens - pavlos
    - Added analytics visualizer - pavlos, cx team
    - Fix braze integration
    - Replace ios native analytics with segment analytics
    - Fix fastlane API Key
    - Do not run ci on update-changelog branch
    - Kill all .env files - pavlos
    - Rejoice! No more fighting with CHANGELOG conflicts! - david, mounir

<!-- DO NOT CHANGE -->

## Released Changes
