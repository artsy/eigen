## Undeployed Changes

### v6.10.1

- Status: **Beta**
- Changelog update date: **Wed Jul 21 2021 19:16:13 GMT+0000 (Coordinated Universal Time)**
- Changelog:

  - User facing changes:

    - Set the filter facets on iOS match the Artsy Copy Style Guide.
    - Stop jerky movement of multiple toasts - dzmitry tratsiak
    - Change the screen title from "Auction Results for You" to "Auction Results for Artists You Follow".
    - Enables users to delete saved addresses
    - default view of an address when multiple are saved
    - Implemented SavedAddresses List Item
    - Display "Recently added" sort by filter value when tap open saved search notification - dzmitry tratsiak
    - add a minimal Saved Addresses screen which sits behind a feature flag
    - Refactor category screen header and filters to match other artwork grids - dzmitry tratsiak
    - Fix spinner showing up on Collections Rail
    - added optionalField to fix "Unable to load error" in Order History and Order Details
    - Fix add touchable underlay color in ArtistSeriesListItem
    - User tapping saved search push notification sees filtered artworks and applied filters - dzmitry tratsiak
    - Sticky header on an Artist Series screen at the top of the artwork grid – dzmitry tratsiak
    - Hide "Refine" button on category screen header – dzmitry tratsiak
    - Update the design for Popover Message component – dzmitry tratsiak
    - Update the saved search banner label for enable/disable states - dzmitry tratsiak
    - Allow screen rotations on android tablets
    - For android devices, the change will not be visible
    - Fixes a crash when opening app from background - brian

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
    - Remove Sailthru
    - Add tracking to unable to load screen
    - Make home auction results by followed artists available for release
    - Rename the flag
    - Initial Push Notification Setup on android
    - Fix iOS braze integration
    - Add update changelog to CI, mounir, pavlos
    - Put PR changelog changes inside a collapsible section
    - Replace deleteSavedSearch mutation on disableSavedSearch – dzmitry tratsiak
    - Polish Auction Results for you screen and home rail (behind feature flag) - ole
    - Add analytics for auction results for artists you flow
    - Add a feature flag to toggle Saved Addresses.
    - 6.10.0 dev prep
    - dev prep
    - Allow custom attributes from push notifications to be passed through to React Native scenes

<!-- DO NOT CHANGE -->

## Released Changes
