## Undeployed Changes

### v7.0.0

- Status: **Beta**
- Changelog:

  - User facing changes:

    - Don't restrict number of artwork modules in the home screen above-the-fold query - ole
    - Update copies for create saved search alert screen - dzmitry tratsiak
    - Show notifications when users add, update, or delete saved addresses
    - Apply custom Dialog for confirm saved search delete - dzmitry tratsiak
    - Dialog component - dzmitry tratsiak
    - Added V3 Select components (behind feature flag) - ole
    - The artwork filter helpers increment and "All" issue has been fixed -rquartararo
    - Introduce AboveTheFoldQueryRenderer to Home screen - ole

  - Dev changes:
    - remove `ARDottedSeparatorView` that was not used - pavlos
    - add `jest-extended` and upgrade `react-native-safe-area-context` to help with text v3 - pavlos
    - add a dev toggle to toggle palette v3 from anywhere in the app - pavlos
    - add stories for v1, v2, v3 of text - pavlos
    - made the v3 text, and map v1 (`Sans`, `Serif`) and v2 (`Text`) to the new v3 `Text` comp - pavlos
    - Use Webp - mounir
    - Place "saved alerts" above "my collection" - dzmitry tratsiak
    - add tests for delete address - gkartalis
    - Integrates Adjust SDK - Brian, Jon
    - removed brew update step from `build-test-app-ios` job - gkartalis
    - Add analytics for saved search M2 - dzmitry tratsiak
    - Add delay navigate for lazy load tabs - dzmitry tratsiak
    - Some luxon love - pavlos, roop, george, brian
    - Do not save the changelog update date - mounir
    - Track link tap and AuctionResultsForYou Screen - kizito

<!-- DO NOT CHANGE -->

## Released Changes
