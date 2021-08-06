## Undeployed Changes

### v6.10.2

- Status: **Beta**
- Changelog update date: **Fri Aug 06 2021 00:52:40 GMT+0000 (Coordinated Universal Time)**
- Changelog:

  - User facing changes:

    - Pass selected filters and artist name to the create saved search alert screen - dzmitry tratsiak
    - list of saved search alerts - dzmitry tratsiak
    - Saved search alert scene - dzmitry tratsiak
    - [Saved search M2] Tapping "create alert" navigates to create alert screen - dzmitry tratsiak
    - Adds a Notification when users add, edit, or delete a Saved Address
    - Fix the missing spinner on buttons - ole, brian, pavlos
    - Tag scene
    - Add separate marketing email checkbox to new signup flow - ole
    - fix auction FAQs not loading - ole
    - Add www to artsy web url (https://artsy.net -> https://www.artsy.net) / fix Auction FAQs screen - ole
    - change auction lots for you ending soon title to title case - ole
    - Show loading spinner on artist auction result keyword filter input - ole
    - Scroll to keyword filter input when keyboard opens on artist insights screen - ole
    - Update the medium size label – dzmitry tratsiak
    - User able to type any price in custom price – dzmitry tratsiak
    - Add edit address functionality and convert add new address to modal - gkartalis
    - Set the filter facets on iOS match the Artsy Copy Style Guide.
    - Stop jerky movement of multiple toasts - dzmitry tratsiak
    - Change the screen title from "Auction Results for You" to "Auction Results for Artists You Follow".
    - Enables users to delete saved addresses
    - default view of an address when multiple are saved
    - Implemented SavedAddresses List Item
    - Display "Recently added" sort by filter value when tap open saved search notification - dzmitry tratsiak
    - Fix push notification deeplinking - Brian
    - Fix a bug where in certain scenarios previously logged in users cannot create accounts - brian
    - Fix spacing on Viewing Room Artworks - pavlos

  - Dev changes:
    - introduces @testing-library/react-native - gkartalis
    - space from palette v3 - pavlos
    - Move `color` to palette v3 by default - pavlos
    - Fix login crash - brian
    - Use `.gitkeep` files correctly - pavlos
    - Delete address text link is added in the edit form. It will delete the address and navigate the user back to the list of Saved address screen.
    - Showing the error message as the title instead of [unknown].
    - use a separate store for the temporary palette flag
    - Create storybook config file when starting Android - ole
    - Fix tracking for auctions screens - Brian
    - Saved search banner M2 – dzmitry tratsiak
    - Add storybook integration - pavlos, ole
    - Braze integration follow-ups - Brian
    - Add detect secrets pre-commit hook - ole
    - flag for palette v3 - pavlos
    - tooling in preparation for palette v3 - pavlos
    - Prepare for 6.10.2 development
    - Adding inEditorialFeed: true to articlesConnection for all Fair and Other Queries. - christian
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
