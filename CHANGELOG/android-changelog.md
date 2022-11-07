## Undeployed Changes

### v8.2.1

- Status: **Beta**
- Changelog:

  - User facing changes:

    - Allow users to create artists for My Collection (behind feature flag) - ole
    - Move all required fields to top in artwork form - ole
    - New setting to toggle "New Shows for You"
    - auction artwork screen minor style changes - gkartalis
    - Always show a message when a price estimate has been sent - ole
    - Go back to artwork not MyCollection after sending request price estimate - kizito
    - Minor style updates to fair screen
    - AREnableNewRequestPriceEstimateLogic feature flag
    - Adds banner and FAQ page for privately shared artworks @jpotts244
    - replace fixed heights with padding in collections onboarding header - gkartalis
    - updated styling on contextcard on artwork screen - gkartalis
    - New edition Sets radio section - dimatretyak
    - Show error toast when request price estimate fails - ole
    - fix back gesture and back button handling in request price estimate - kizito
    - add some bottom header padding in collections page onboarding - gkartalis
    - add artsy guarantee section in artwork screen - gkartalis
    - Fix bugs in third party authentication - Brian
    - remove extra % from Artists Market stats - mrsltun
    - disable new opaque image view on new-works-for-you grid - gkartalis
    - redesigned artwork details in artwork page - gkartalis
    - Update styling is Artwork Screen of the app - gkartalis - dimatretyak
    - Consolidated modals for coa / medium / classification - gkartalis - dimatretyak
    - Artwork page, update PartnerCard styling - gkartalis
    - Ensure Previously requested price estimate flow does not break - kizito
    - change Provenance / Exhibition History / Bibliography text styling - dimatretyak
    - Added confirmation page to the Request a Price Estimate flow, corrected the UI of the contact information page of the Request a Price Estimate flow -daria
    - Adjust request price estimate section design - ole
    - Approved to bid - checkmark not aligned - gkartalis
    - update MyC artist market subtitle font - mrsltun
    - Adjusted the request for a price estimate section in MyCollection Artwork to match the implementation in Force -daria
    - Design fixes and updates on SWA homepage and MyC empty states - mrsltun

  - Dev changes:
    - small improvements for "mark all as read" button - dimatretyak
    - add "Mark all as read" notifications button for activity screen - dimatretyak
    - "Recently Added" sort option should be preselected when the user clicks on an notification and navigates to the artist artworks screen - dimatretyak
    - Activity Panel tracking - dimatretyak
    - onboarding old screens cleanup - gkartalis
    - add dev toggle for adding label on new opaqueImageView - gkartalis
    - Use iPhone 14 Pro for ci tests - Brian
    - Hide activity panel notifications without artworks - dimatretyak
    - Update setup docs with `yarn relay`
    - Add an error message when trying to sign in with google on firebase beta - Brian
    - query formatted notification date - dimatretyak
    - update artwork loading placeholder - dimatretyak
    - add new request price estimate feature flag - mounir
    - cleanup AREnableNotFoundFailureView -daria
    - remove `AREnableCreateArtworkAlert` feature flag since it was released - dimatretyak
    - Change copy of Alert's tab empty state - dimatretyak
    - add update echo script in setup:artsy - gkartalis

<!-- DO NOT CHANGE -->

## Released Changes
