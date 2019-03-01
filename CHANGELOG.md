<!--

// Please add your own contribution below inside the Master section, no need to
// set a version number, that happens during a deploy.
//
// These docs are aimed at product people, so please limit technical
// terminology in here.
//
// Things that warrant a CHANGELOG entry:
//
//   * New Features
//   * Bug fixes across releases (not between betas)
//   * Major dev tool updates

-->

### Master

- Adds styled city picker modal - ashley
- Adds CityTab stying and passes CityName to AllEvents view - kieran

### 1.8.10

- The map will show up as full bleed in Eigen - orta
- Fixes fair view crash on fairs with no profiles - ash
- Fixes some analytics tracking events - luc

### 1.8.7

- Fixed the fairs thumbnails for a city, and makes the fairs clickable - orta
- Fixed fair links - ash
- Fixed various other edge-case broken links - ash

### 1.8.5

- Switches Fairs&Shows to use SwitchBoard routing instead of nested navigation controller - ash
- Add ellipsis to partner and event names - ashkan
- Fixes partner link on Fair Booth header - luc
- Adds Sentry to the app - orta
- Adds Sentry logger for users - orta
- Fix for the count of artworks in a show - orta
- Nearby show previews use a better placeholder - orta
- Fixes to the fair icon - orta
- Adds clickable links for maps - orta
- Fixes follow gallery button on fair booth page - ash
- Fixes fairbooth artwork counts in fair view - kieran

### 1.8.4

- Fair exhibitors overview looks up to spec - orta
- Hides additional info when a fair doesn't have it - orta
- When there's only a website for the fair additional info, the app goes there - orta
- Adds global saves & follows analytics - ash
- Adds display date to CountDownTimer - kieran
- The Markdown componeont is more cautious on re-rendering its content - orta
- Updates color of unsaved shows text indicator in global saves and follows - ashley
- Changes copy in Shows global saves and follows when user has not followed any shows - ashley
- Adds dates of currently running saved shows to Saved and Followed Shows - ashley
- Fixes hours section animation - luc
- Fixes FairBooth routes - luc
- Adds Component VCs for Artists, Artworks, Exhibitors screens - luc
- Adds CityTabs - kieran

### 1.8.3

- Updates show header gallery name to medium font weight - kieran
- Checks in the view for fair.profile before rending profile values - kieran
- Moves countdown timer higher on fair - kieran
- Fixes space under map when no description - kieran
- Fixes show title header when no carousel images - kieran
- Refactors Buckets for All events city view - luc
- Adds Fair Section in city view - luc
- Adds AllEvents data and styling to city view - kieran
- Adds Saved Shows section to city view - luc
- Styles Fair save button - kieran
- Fixes save show - kieran
- Show header title now links to gallery - kieran
- Show image now full width if one image - kieran
- Adds spacer below links in show about page - kieran
- Fixes empty schedules rendering empty Opening Hours - ash
- Uses Summary from Location before segmented address in locationMap - kieran
- Adds Follow functionality to Fair partners - kieran
- Fixes inconsistent padding between items in show and fair views - kieran
- Removes fair save button - kieran
- Adds params to fair link - kieran
- Fixes Exhibitor name overflows and pushes follow button off the screen - kieran
- Fixes x-margin on images in grid - kieran
- Fixes artworks filter - kieran
- Fixes scroll in artworks grid - kieran
- Check for saleInfoLine before rendering sales info on artwork - kieran
- Adds analytics to all Show screens and views - luc
- Removes Fairs tab from Global Saves and Follows view - ashley
- Fixes FairBooth routing - kieran
- Adds Shows to Global Saves and Follows view - ashley
- Removes Fairs tab from Global Saves and Follows view -ashley
- Fix rendering strong elements in markdown all over the app - orta
- Fixes FairBooth routing - kieran
- Fair exhibitors overview looks up to spec - orta
- Adds Shows to Global Saves and Follows view -ashley
- Adds separator between fair entities - kieran
- Adds Fair analytics - kieran
- Refactor and style new filter header in map view - luc
- Move filters down to city view - luc
- Adds new map filter design to Map view - luc
- Support full bleed view controllers - luc

### 1.8.2

- Styles Fair view to match design - kieran
- Removes All Artworks from artwork preview - kieran
- Adds booth number to fair booth view - kieran
- Adds item separator to FairBooth - kieran
- Adds counts to Artworks and Artist previews for FairBooth - kieran
- Restyles CaretButton to reflect design - kieran
- Clicking on Fair booth title now takes you to booth view (Reviewed this with Jun) - kieran
- Adds inter-component communication for map and bottom sheet view - ash
- Fix createMockNetworkLayer and update tests - luc
- Adds inter-component communication for map and bottom sheet view - ash
- Adds SearchIcon from svg - Kieran
- Styles SearchLink - Kieran
- Fixes bug in filter bar when centering selected items - ash
- Replaces PNG Chevron for SVG icon - kieran
- Centers Fair titles in fairbooth preview - kieran
- Adds some small styling adjustments to the hoursCollapsible - kieran
- Fix overfetching data on Fair Detail - luc
- Update Show detail view spacing & copy - luc
- Improves native integration with bottom sheet UI - ash
- Adds missing fair booth separator - kieran
- Refactors Fair Header view to use EntityList - luc
- Fix bug with Markdown renderer - luc
- Refactors Show Header view to use EntityList - luc
- Fix fair booth view by adding query renderer - luc
- Enable saving fairs in Fair header view - ashley
- Moves Description and View more information below map - kieran
- Decreases size of pin slightly - kieran
- Resizes fair banner to be larger - kieran
- Adds artwork count to view all in booth preview - kieran
- Checks coords before rending map & checks for artworks before render fair booth preview - kieran
- Adds save functionality to show - kieran
- Adds city and zip code to show address - kieran
- Checks for works before rendering works section - kieran
- Checks for hours before rending hours section - kieran
- Parter names in entitylist now link to LD view - Kieran
- Adds logging for relay queries and metaphysics extensions used in query - luc
- Minor styling adjustments to Fair and Show - Kieran
- Styles about fair and uses correct link for website - kieran
- Adds Scrollable tab to Favorites screen - ashley
- Enables followed Fairs in Favorites - ashley

### 1.8.1

- Ports over @ds300's Relay mock utils from reaction - luc
- Swap Mapbox style from default to Artsy theme - luc
- Display pins on map based user location - luc
- Update MapRenderer to user Geolocation service - luc
- Adds `Make Offer` badge to artwork brick - matt
- Fair booth title now a link to gallery - kieran
- Replace theme and icon on LocationMap - luc
- Adds links to fair exhibitors - Kieran
- Removes "All" from Artists, Exhibitors, and Works Headers - ashley
- Adds navigation from Fair Booth Partners to Partners page and from Fair Artists view to Artists page - ashley
- Show UI cleanup: removes map icon, enables Artist navigation - ashley
- Expands Show installation shot carousel to screen width - ashley
- Adds external link to partner galleries - ashley
- Replace theme and icon on LocationMap - luc
- Removes "View on Map" text from More Shows section in Show view - ashley
- Adds more data marshalling for city view, sets up city scaffold - ash
- Readds the overlay to fair banner image - kieran

### 1.8.0

- Adds styled LocationMap with custom pins - kieran
- Refactor auctions countdown timer, add fair countdown timer - javamonn
- Refactors ARNotificationManager to implicitly call all JS methods on main queue - ash
- Adds the mapBoxAPIClientKey to cocoapods
- Updates Show detail view styles - luc
- Styles artists list - Kieran
- Updates @artsy/palette (2.21.1) - javamonn
- Refactor More Shows section - luc
- Styles fair header view - luc
- Increases size of pin for LocationMap and zooms in slighlty - kieran
- Adds extra checking around sale artwork messaging in artwork grids - ash
- Add fair-scoped search link to native Eigen screen - javamonn
- Adds "View on map" to show view for "More shows" - Kieran
- Adds AllArtist page to Shows and adds styled gray border InvertedButton - Kieran
- Add HoursCollapsible to Fair detail view - javamonn
- Adds fair booth section - luc
- Add browse artworks screen to Fair, Show - javamonn
- fixes to the artwork favourites pagination - orta
- Add rules prop to Markdown, left-align fair and show hours markdown - javamonn
- Add paginated artists screen to fair detail, refactor show artists - javamonn
- Update Show MoreInfo screen with events - javamonn
- Update artwork grid item text spacing - javamonn
- Add Browse Artworks link from Fair booth, works - javamonn
- Enable navigation link from Fair contextual detail to Gallery and Artist pages - ashley
- All Exhibitors View bug fix - ashley
- Add FairBooth screen - javamonn
- Splits Fair screens into seperate query renderers - luc
- Adds Map and City view container - luc
- Adds native unit test suite and CI - ash
- Add FairMoreInfo screen - roop and javamonn
- Adds shows list to Show View - ashley
- Adds fair exhibitors to Fair view - ashley
- Reordering Fair sections to match design specs -ashley
- Add contextual data to Fair view - ashley
- Enable navigation on contextual data in Show view - ashley

### 1.7.6

- Removes the buy now banner from the homescreen - orta

### 1.7.5

- fixes to the artwork favourites pagination - orta

### 1.7.4

- Emission's podspec contains deps for all of its native dependencies - orta

### 1.7.3

#### User Facing

- Makes the consignment banner show by default, and allows changing this via an echo flag - orta
- Fixes crash in marketing banner - ash

#### Not user facing

- Adds Shows detail page header components - javamonn
- Updates to relay-compiler and relay-runtime - ash
- Adds tslint-plugin-relay lint rule (from Reaction) - ash
- Adds a new ARComponentVC and root React Components for Shows - javamonn
- Updates cocoapods (1.5.3) - luc
- Adds Mapbox + Location Component - luc
- Adds Artwork grids with infinite scroll to Show View - ashley
- Adds Relay DevTools, Update Node.js to 10.13.0 - javamonn
- Adds artists list component to show detail view - javamonn
- Adds Fair detail view header components - luc
- Adds MoreInfo screen to show detail view - javamonn
- Clean up Jest log output, update relay-mock-network-layer - javamonn
- Fair performance enhancements - ashley
- Add start and end properties to Favorites Works and Shows page info queries -ashley

### 1.7.1

- Updates BNMO /collect url to remove a/b test ref - chris
- Removes the BNMO feature flags - orta

### 1.7.0

- Adds a new ARComponentVC and root React Component for Fairs - orta + grow team

### 1.6.1

- Tweaks to artwork badges - matt
- New artwork brick style - matt
- Deployment improvements to hopefully automate everything again - orta
- Silence consignments sash on home for BNMO - chris
- Update copy on WorksForYou marketing header - chris

### 1.6.0

- Adding artwork badges to brick - matt
- Add MarketingHeader to Home/WorksForYou - chris/orta
- Add @artsy/palette - yuki/orta/chris

##### Tooling

- Adds a Labs setting UI to the example app - orta
- Added an option to the storybooks support to auto-launch into storybooks in the example app - orta
- Updates Typescript version to 3.0.3

### 1.5.15

- Fixes back button asset for BidFlow - ash
- Disables condition of sale link if the user has previously accepted them - ash

### 1.5.14

- Fixes typo in JSX of Registration flow - ash

### 1.5.13

- Conditions of sale link and checkbox are now disabled while bid is processing - yuki24
- Ignores cache when loading BidFlow query - ash

### 1.5.12

- Fixes an issue related to posting NSNotificationCenter notifications on not-main threads - erikdstock
- Improvements to form behavior when advancing through inputs - yuki24
- Loading enhancements - ashfurrow

### 1.5.11

- Fixes a bug where the error message for the country field remains even after selecting country - yuki24
- Adds an error modal to the bid flow - sweir27
- The country select form should pre-populate if user have already selected a country - yuki24
- Update graphql + use new argument to fetch increments - sweir27
- Sets artwork and artist name labels on ConfirmBid component to use only one line, and truncate the tail - ash
- Show error message when your credit card can't be added - sweir27
- Now Emission uses metaphysics system time to consider offset for auction timer - yuki24
- ARBidFlowViewController now exposes preloading queries - ash
- Now users are not allowed to click into the billing address/cc/max bid edit forms while your bid is being placed - yuki24
- Adds predictionURL and updates 'Live bidding has started' screen to link to live sale - sweir27
- Automatically scroll to the text input that has the focus - yuki24

### 1.5.10

- Fix trailing comma on confirm bid screen when artwork does not have a date - erikdstock
- More improvements/bug fixes for Bid/Registration flow

### 1.5.9

- Fix incorrect NSNotification name for sale registration - erikdstock
- Add secondary outline button style - maxim
- Adds `inputRef` to the styled `<Input>` component - yuki24
- Add analytics to registration screens - maxim
- Now users can add their country = yuki24

### 1.5.8

- There should be more space visually between conditions of sale checkbox and place bid button - yuki24
- Add placeholders to credit card form - erikdstock
- Now users see the minutes in the auction timer when the sale does not on the hour - yuki24
- Now users see an error message when MP returns an error on the Registration and Confirm bid screens - yuki24
- Update credit card form to have more sophisticated keyboard behavior - sweir27
- Add registration result screens - maxim
- Add a back button to the Billing address form screen and the Credit card form screen - yuki24

### 1.5.7

- Fixes the `commitMutation` compatibility by not throwing errors - yuki24
- Refetches bidder info when returning to ConfirmBid screen - sweir27
- Refactors auction timer to support state changes - sweir27
- Now User sees an error message when a request to MP did not go through due to the device's network condition - yuki24
- Fixes a style issue where the spacing of the messages looks weird on “Outbid” payoff screen - yuki24
- Update button style in bidflow to latest spec - maxim
- Add disabled state to new button type, primary black - maxim
- Registration screen handles when a user already has a credit card on file - sweir27
- Removes unnecessary white spaces in the bid result screen - yuki24
- Updates the text style and order for the auction timer - yuki24
- Registration screen sends mutation for creating a bidder/credit card - sweir27
- Route between bid/register flows based on user intent - erikdstock

### 1.5.6

- Updates bid status when returning to the [sale] artwork screen- erik
- Autocapitalizes words on billing address inputs - ash

### 1.5.5

- Removes some of the height hacks we used in the Zero state for inbox/consignments which aren't needed in new RN - orta

### 1.5.4

- Adds going back to max bid when selecting edit bid from confirmation screen - maxim
- Adds line-height to the type system - sepans
- Refetches bid increments once a bid has been processed - ash&sepans
- Adds `intent` to `ARBidFlowViewController` and `<BidFlow>` component - ash
- Adds the ability for first-time users to register and place bid simultaneously - yuki24
- Updates definition of Unica font default weight - sweir27
- Adds registration screen - sweir27
- Adds support for startAt in the auction timer - sweir27

### 1.5.3

- `dismissModalViewController` now returns a promise - ash&sarah
- Continue button now dismisses BidFlow, opens LAI if appropriate - ash&sarah
- Shows correct message when reserve is not met - sepans
- Corrects problem with AROpaqueImageView showing empty images - ash
- Adds the ability for first-time bidders to add thier billing address - erikdstock and yuki24
- Display "Credit card" and "Billing address" to users without qualified credit cards - yuki24
- Add first round analytics for the bidflow - maxim&erik

### 1.5.2

- Adds a checkbox to the confirm your bid screen - yuki24
- Adds the ability to style the text in the inverted button with a spinner - yuki24
- Now the `<ConfirmBid>` component shows a spinner while loading - yuki24
- Now the `<Input>` component updates the border color when the parent component updates the `error` prop - yuki24
- Shows correct message when reserve is not met - sepans
- Shows the appropriate Auction end/start time adjusted to the user's time zone - yuki24

### 1.5.1

- Adds Recently Viewed Works rail to Home - sarah
- Use a more appropriate type for textStyle in ButtonProps - yuki24
- Adds confirm bid screen for Bid Flow - sepans
- Load Bid prices dynamically - sepans
- Adds bid result screens - yuki24
- Updates bid flow to consume preformatted bid increments - ash
- Updates MaxBidPicker to maintain state of currently selected bid increment - ash
- Adds commonly used typefaces - yuki24
- Updates logging in native code to use NSNumber instead of platform-specific casts - ash
- Transitions between the bid picker to the bid confirmation components - ash
- Adds a more re-useable low-level components - yuki24
- Adds a confirmation screen for first-time bidders - yuki24
- Adds a new color `red100` (`#F7625A`) to the theme - yuki24
- Adds a `<CheckBox>` component - yuki24
- Adds support for viewing conditions of sale - ash
- Add ability to specifically style the button headline - yuki24
- Creates and verifies bidder position - sepans
- Adds `<MarkdownRenderer>` component - sepans
- Expands ConfirmBid tests - ash
- Changes `<BidFlow>` component and `ARBidFlowViewController` to accept artworkID and saleID as params - ash
- Adds a `<Input>` component - yuki24
- Adds a billing address screen - yuki24
- Reflect style updates for the `<Checkbox>` component - yuki24
- Load Real values into `BidResult` screen + re-implement `<MarkdownRenderer>` - sepans
- Fixes an edge case where the border color of an `<Input>` component does not get updated properly - yuki24

### 1.5.0

- Upgrade to React Native 0.54.4 - alloy/orta
- Follow Force and reduce image quality to 80 - alloy
- Inquiries use the same user-agent as emission - orta
- Optimise the generic artwork grid for rotation - maxim
- Cache queries on-disk for 1 day - alloy
- Add persisted queries support to Relay - alloy
- Add ability to preload queries - alloy
- Adds BidFlow component and view controller - ashfurrow
- Fixes crash when following an artist from the ‘related artist’ Home/ForYou rail - alloy

### 1.4.9

- Adds setProperty:forKey: to ARComponentViewController - ash&maxim
- Add support for changing tabs of the home vc - maxim
- Update home analytics for tab changes and initial tab props - maxim
- Update switching for home tabs - ash&maxim

### 1.4.8

- Fixing broken previous deploy, no changes - alloy

### 1.4.7

- Fixes crash when following an artist from the ‘related artist’ Home/ForYou rail - alloy

### 1.4.6

- Scroll to last sent message upon send - sarah
- Upgrade to latest Relay, including our custom Node ID and language plugin patches - alloy
- Switch to using TypeScript artifacts generated by relay-compiler and the TS plugin - alloy
- Relay queries include a user-agent header - orta
- Fix truncation bug for artwork previews, noticeably on inquiry screen - maxim
- Fix bug on works displaying auction closed when auction is about to open - maxim

### 1.4.5

- Schema fixes for LotsByFollowedArtists.tsx - ashkan

### 1.4.4

- Fix for consignment welcome text not fitting on iPhone 5s - orta
- The sale images in the auctions section now fits correctly on iPhone - orta

### 1.4.3

- Fix for SaleList not updating its dimensions upon rotation - sarah
- Allow blank messages in Conversations, but only if they have attachments - sarah
- Hack fix for the consignments done button on iPhone X - orta

### 1.4.2

- Allow blank Messages in Conversation - sarah
- Removed unused imports that Relay no longer requires - sarah
- Fixed the top margin for home - orta
- Fixed the messages header when there's no convos - maxim
- Added pagination spinners to each Saves & Follows tab - alloy
- Automatically default packager host to build machine when running a dev build on device - alloy
- Handle errors that can occur when using the camera and move UIImagePickerController code into Emission - alloy
- Fix for consignments analytics not being triggered correctly - orta
- Re-instate the Relay Classic behaviour where any GraphQL response errors would lead to showing the ‘UNABLE TO LOAD’ view - alloy
- Make sure ArtworkCarouselHeader queries for all required artist details regardless of what type of suggestion it’s showing - alloy
- Possibly fix a crash that would occur when dispatching analytics events - alloy
- The fairs rail is now constrained to just it's tab - orta
- Re-enable Lots by Artists You Follow and hide it when there are no live sale lots - alloy
- Don’t crash on trying to JSON parse a network error - alloy
- [Dev] Moved to CocoaPods keys - orta
- [Dev] Make it possible to impersonate a user given their ID and an access token - alloy

### 1.4.1

- Fixed the ordering of Home/Auctions - damassi
- Fixes some top margins for iPhone X support - orta
- [Dev] Emulates how Eigen handles status bars - orta

### 1.4.0

- Fix gene view pagination - alloy
- Fix home page analytics double fire upon entering background - maxim
- Consignments welcome wording fixes - barry/orta
- Disabled Lots by Artists You Follow for this release - alloy

### 1.4.0-rc.4

- Fix filter logic around sale works by followed artists - chris

### 1.4.0-rc.3

- Fix a bug where edition screen was considered seen based on metadata props - maxim
- Fix for selecting a painting in consignments - orta
- Fix submission requirements for consignments to match force - orta/maxim
- Add auto focus to the work details / metadata screen - maxim

### 1.4.0-rc.0-2

- Make sure Home/Fairs rail does not clip any icons at the end of the list - alloy
- Re-align headers in all Home tabs - alloy
- Fix crash that would occur when tapping artwork component on inquiry view - alloy
- Add analytics to the Home tabs - maxim
- Fix a bug that would not let an infinite scroll of artworks stop requesting more artworks - orta
- More pixel pushing in the consignments welcome screen - alloy
- More pixel pushing in the conversations zero state screen - alloy
- Add saves and follows analytics - maxim
- Track which images are being uploaded in consignments - orta
- Fix a bug where the relay query params for the gene page weren't being set - orta

### 1.4.0-beta.13

- Message timestamps are more human-readable with 'ago' - sarah
- Fixes for the camera roll order in consignments - orta
- Adds the new photo and selects it when taking a photo - orta
- Adds a confirmation screen to the end of the consignment submission process - maxim/orta

### 1.4.0-beta.12

- New methodology for unread indicator and marking conversation as read - matt
- Fixes Inbox loading indicator stuck and conversation row collapsing - luc
- Optimize the Home/ForYou view by re-enabling removal of clipped subviews - alloy
- Brings back artist rails on the Home/ForYou view - alloy
- Fix issue where unmounted Home/ForYou rails would be refreshed - chris & alloy
- Fix payment request component status not updating after payment - alloy
- Add pull-to-refresh to the ARTISTS and AUCTIONS tabs on the Home view - alloy
- Align conversation view header title with navigation button - alloy
- Remove rule underneath conversation view header - alloy
- Add analytics coverage for home, saves & follows, and gene events - maxim

### 1.4.0-beta.11

- Edition number field allows letters too - sarah
- Makes sure Home view shows Artists tab whenever there's a selected artist - sarah
- Adds webview support and zero state page for Auction tab - luc
- Sets the status bar BG color to dark for Consignments - orta
- Bug fix for the Gene refine not showing on Eigen - orta
- Taking a consignment photo will now select the created image by default - orta
- Rearrange Consignments overview page with Edition step - maxim
- Modify design and alignment on consignment screens - maxim
- Sort auctions by timeliness - chris
- Pixel pushing of margins between auctions - chris

### 1.4.0-beta.10

- Update WorksForYou to use new Metaphysics schema to avoid frequent empty states - matt
- Adds a way to select tab on Home scene from initial props - sarah
- Don't load an ArtistRail if it doesn't have any artists - sarah
- Refetch data when user re-enters Inbox tab - luc
- Send event from view controller to react component when tab changes - luc
- Allow passing a set of Artworks and an index to load to Eigen when clicking on
  a Artwork within a grid - orta
- Update Relay typings to current DT version - alloy
- Change inquiry status bar background to white - maxim
- Move pagination from home/sale index to LotsByfollowedArtists, misc QA - chris
- Only load a single Works For You page at a time - alloy
- QA on Inbox and Active Bids spacing - maxim
- iPad support for Active Bids - maxim
- Get rid of image view flag that would skip on-the-fly resizing - alloy
- Add noUnusedLocals / noUnusedParameters to tslint config; clean up refs in app -chris
- Swap ListView for FlatList in Inbox/ForYou and refactor rail registration, misc QA - chris
- New design for consignments welcome screen - maxim

### 1.4.0-beta.9

- During Inbox pull-to-refresh, Conversations container force-fetches itself - sarah
- Accommodate selectedArtist parameter in Home container - sarah
- Don’t require 2 taps to open a conversation attachment and keep keyboard up - alloy
- Don’t assume a photo was selected in the consignments photo picker - alloy
- QA for composer/thread view: ipad and fixed iphone size attachments - maxim
- QA for message attachments - maxim
- QA for saves & follows: enable pagination in Works tab in Saves & Follows - luc
- QA for home header font sizes and margins - maxim
- Minor: change text colour for provenance placeholder in consignments - maxim
- Don’t rely on user of the Gene VC to specify filter defaults, which could lead to a crash - alloy
- QA for inbox zero on ipad - maxim
- Add analytics to consignments - orta
- Fixes for metaphysics changes to consignment submission - orta
- Implement selected state for images in consignments photo set - maxim
- Support sending images for Consignments in production - orta
- QA for consignments on metadata screen - maxim
- Adds <LotsByArtistsYouFollow /> component to Sales - chris

### 1.4.0-beta.8

- Updates the default statusbar text color to black - not white - orta
- Updates zero states in Artists on Home, and all the Favs & Saves - orta
- Updates zero states in messaging - orta
- Adds pagination to the follow'd Artists and Categories- orta

### 1.4.0-beta.6 - 1.4.0-beta.7

- Provides native view controllers for the routing engine in Eigen - orta
- Changed invoice component to only being able to touch the PAY button - alloy
- Make invoice component’s payment status and button slightly wider to account for statuses like ‘REFUNDED’ and ‘CANCELED’ - alloy
- Don’t try to also fetch the invoice state after receiving a ‘paid’ notification, just trust the notification and keep showing the ‘PAID’ state - alloy

### 1.4.0-beta.5

- Adds Saves & Follows view - luc
- Renames MyProfile -> MyAccount, and sets up the design for it - orta
- Revised designs for consignments - orta
- Adds Live and timed auctions in home view - luc
- Adds Sale container to app registry - ash
- QA for Home: change tab colors - maxim
- QA Inquiry screen - maxim
- Home now includes a call to action for consignments - orta
- QA for Home: center tab labels with thin space hack - maxim
- Add new Analytics schema via React Tracking. - maxim
- Add analytics events for messaging - maxim
- Removes ‘works by artists you follow’ rail from ForYou view - alloy
- QA for Inbox view: center and cap size on iPad and solid line separator - maxim

###### Dev

- Converts relative to absolute paths for imports - luc
- Adds enzyme for tests - luc
- Fix test issues with react-tracking and enzyme - luc
- Updates Avant Garde font with a version that can handle special characters - sarah
- Remaps space key bidding to ctrl+space so we can enter spaces fromthe simulator - luc
- Conditionally use different past artist show fragments for iPad vs iPhone - alloy
- Upgrades Relay to ‘modern’ (v1.3.0) - alloy
- Upgrades React Native to v0.48.0 - sarah
- Upgrades React Native to v0.48.4 - orta
- Extracts connectivity banner into its own component - sarah
- Adds stylelint to the dev-experience, not validated on CI yet - orta
- Updates Storybooks to 3.2 - orta
- CocoaPods/Danger updates - orta
- AREmission bridging updates which require integration work in Eigen - orta
- You can choose any URL for gravity/metaphysics - orta
- Adds an env var for google maps API - orta
- Updates the beta/dev UI, and with docs - orta
- Some testing stability work - orta
- Add React Tracking lib for analytics - maxim
- Add typings and custom schema setup for React Tracking lib - alloy
- Fix release build by switching from the default React Native packager (Metro) to the community one based on webpack (Haul) - alloy
- Revert back to React Native packager (metro), life comes at you fast, see #785 for context - orta
- Updates invoice preview component status when a ARPaymentRequestPaid notification is received - alloy
- Present payment request view modally. - alloy
- Adds initial Sale container. - ash

###### Home

- Updates Artists section (aka works for you notifications) - sarah
- Adds a Recommended Fairs Rail - sarah
- Adds for For You tab with styled headers - luc
- Creates tab view container for new home - luc
- Adds Live and timed auctions in home view - luc
- Tab bar text now aligned and centered correctly - luc
- Adds iPad support for Auctions view layout - luc
- Adds <LotsByArtistsYouFollow /> component to Sales - chris
- Refactors <LotsByArtistsYouFollow /> by consolidating QueryRenderers - chris

###### Consignments

- Adds a camera roll screen for getting photos for consignments - orta
- Adds the native functionality for taking photos of a consignment - orta
- Infinite loop through all photos, and look good on both iPhone + iPad - orta
- Adds a provenance screen - ash
- Adds a final submission screen - orta
- Adds a screen for metadata editing - orta
- Looks better on iPads - orta
- Adds a screen for setting the location - orta
- Adds a spinner at the end of submission - orta
- Submit draft metadata to convection - orta
- Publish a consignment to convection - orta
- Keep track of the user's input during the submission process - orta
- Consolidate a lot of user interface elements - orta
- Photos are uploaded an attached to existing submissions - orta
- Correctly handles disabled button states - orta

###### Messaging

- Fix crash by guarding against null `conversations_existence_check` - christina
- Fix crash of empty node in conversation list - maxim
- Hyperlinks in messages are now artsy purple & underlined - sarah
- Aligns message header with existing back button - sarah
- Temporarily removed partner response rate in inquiry - maxim
- Fixed payment request component collapsing and minor UI changes - luc
- Added support for live open auctions for active bids - sarah
- Fixed separator styling in the message component - luc
- Moved conversation loading indicator inside list view - luc
- Added Pending state to message timestamps - sarah
- Initial spike on adding some link detection - maxim + matt
- Initial message now sticks to the top of the scrollview - luc
- Added spinner and 'no more' message when paginating thru inbox - matt
- Refactored messaging-related interfaces, fixed mutations, added tests - luc + matt
- Fixed pagination on conversation component - luc
- Added ability to sort messages in ascending and descending order - luc
- Added capability to mark a message as read by the user - matt
- Updated logic to render purch requests and invoices better - matt
- If a message fails to send, display it again in the Composer so the user can retry - sarah
- Updated styling on bottom dotted border of ConversationSnippet - erik
- Fixed incorrect use of Attachment props in invoice component - matt
- Added inline rendering for invoices - matt
- Removed hard-coded sanitization of message body - sarah
- Small composer UI tweaks - maxim

### 1.4.0-beta.3

- Changes post-sale supplementary artwork info - ash
- Attempt to fix a crash by not assuming a work in auction has a `sale_artwork` - alloy
- Expect `null` to indicate that no settings were refined - alloy
- Only use `console.warn` level when reporting connectivity issues, otherwise Sentry shows these as ‘fatal’ - alloy

###### Messaging

- Display unread indicator in Inbox based on Metaphysics response. - matt
- Update `Message` to use `body` over `raw_text` to take advantage of some parsing. - matt
- Update `Message` to also show an informative signature when the message is not from the user. - matt
- Create `ShowPreview` and support show inquiries, plus refactor to use more generic conversation item schema - matt
- Fix for bug in `ArtworkPreview` related to the falsiness of an empty string - sarah
- Adds a banner on Conversations when network connectivity is lost - sarah

### 1.4.0-beta.3

###### Messaging

- Reload active bids on pull-to-refresh - alloy
- Make active bids link to their artworks - alloy
- Make zero inbox state hide on load if bids or conversations exist - alloy
- Fix crash on Gene view, when integrated into Eigen, due to missing RCTAnimation dependency - alloy
- Fix issue with missing icons - alloy

### 1.4.0-beta.2

###### Messaging

- Remove statusbar in inquiry modal view - maxim

### 1.4.0-beta.2

###### Messaging

- Show progress indicator during downloading of attachment - alloy
- Force fetch conversation on each load - alloy
- Make pull to refresh in the Inbox work - luc
- Don’t show pull to refresh control when loading the Inbox view - luc

### 1.4.0-beta.1

- [dev] Moves native view controllers to use iOS7+ status bar api - ash
- [dev] Renamed files to reflect case in component/function names - alloy

###### Emission

- Users/Devs can run any PR from inside beta/sim - orta
- Users now can access stories from inside the app - orta
- [dev] Applies prettier 1.5.0, and adds it to the webhooks + extension settings - orta
- [dev] Adds stories for new messaging components - maxim
- [dev] Upgrades Sentry to 3.0, note Eigen integrator, this may require changes to Eigen - orta
- [dev] Upgrades React Native to v0.45 - sarah
- [dev] Allows toggling the back button by pressing space - orta

###### Messaging

- Adds avatar component - maxim
- Adds multiple attachment support - matt
- Adds PDF Preview for attachments - matt
- Fixes pagination for Conversations - luc
- Adds pull to refresh support to Inbox view - luc
- Adds an `ImagePreview` to each Conversation, Relay-ified messages - matt
- Adds snapshot tests for active bids - luc
- Updates status label colors - luc
- Renders active bids before Messages - luc
- Adds active bids section on top of messages - luc
- Adds a mutation for appending messages to a thread - alloy, matt, sarah
- Adds an `ArtworkPreview` to each Conversation - sarah
- Adds Inbox zero state - maxim
- Relay support in Conversation container - sarah
- Adds a `FlatList` for Messages in Conversations - sarah
- Adds Conversation, Composer, and Message components - sarah
- Adds Inbox view with real data - luc
- Adds Inquiry modal - maxim
- Fixes composer to stay above keyboard - luc
- Adds a media preview controller that can show remote document files - alloy
- Updates initial load state for Inbox - luc

###### Consignments

- Adds a root component for the Consignments flow - orta
- Added the Welcome/Overview screen for consignments - orta
- Adds component for attaching buttons to the keyboard - orta
- Adds component for artist search - orta
- Adds component for consignments todo - orta
- Adds storybooks for consignments - orta
- Adds some form elements for consignments - orta
- Adds a component for choosing from a sets of images - orta

### 1.3.10

- No longer display bid/price info for artworks in sales that are closed.

### 1.3.8 & 1.3.9

- [dev] Moves native view controllers to use iOS7+ status bar api - ash

### 1.3.6

- Fixes missing compiled bundle - alloy

### 1.3.5

- Fixes pull-to-refresh scroll position bug on Home - sarah
- Fixes an issue where the WFU component was fetching data for artworks itself rather than delegating that to the nested
  artworks components - alloy
- Fixes pull-to-refresh scroll position bug on Home - sarah
- Fixes an issue where the WFU component was fetching data for artworks itself rather than delegating that to the nested artworks components - alloy

### 1.3.4

- Fixes loading state UI for artwork rail - luc

### 1.3.3

- Ensured rails without artworks cannot be rendered - sarah
- Fix for strange scrolling behavior in WFU - sarah
- [dev] Updates TypeScript to 2.3 - orta
- [dev] Adds back storybooks - orta
- Adds initial work on a new personal profile page - orta
- [dev] Automates TS linting at dev time - orta
- Adds inline bid info to artist grid elements - ash
- Fixes display of artworks in non-expanding grids in artwork rails - ash
- Adds Sentry for React Native which integrates with Eigen’s use of Sentry - alloy

### 1.3.2

- Fix for blank scrollview bug - sarah

### 1.3.1

- Works For You container QA - sarah

### 1.3.0

- Added ability to create a special notification for a single artist in WFU - sarah
- Added pagination to WFU container - sarah
- Added a notifications updater to ARTemporaryAPIModule - sarah
- Added artist avatar to WFU notifications - sarah
- Added a Works For You container - sarah
- Upgrade to RN 0.42-rc.3 - alloy
- Made Gene view work with new relay-based infinite scroll grid - cab
- Updated our fonts lib - orta
- Converted to TypeScript - luc, sarah, alloy, orta

### 1.2.2

- Move active bids home module to the top of the feed - alloy

### 1.2.1

- Build with correct react-native version - alloy
- Replaced fetching in infinite artworks grid component with relay - cab

### 1.2.0

- Gave ESLint, Flow and Danger the ability to fail the build - orta
- Gene Refine button is enabled - orta
- Fix extra blankspace in Artist Card when data is missing - luc
- Gene titles wrap so they don't get covered by back button - luc

### 1.1.4

- Added test coverage for gene components - sarah
- Added test coverage to buttons - sarah
- Added test coverage to artwork grids - sarah
- Added test coverage to all containers and Artist components - sarah
- Added test coverage to Home container - sarah
- Fixes bug in GeneVC where fetching was starting on page 2 - sarah
- Update home view artworks rails order - maxim
- Fix artist link to auction results - alloy
- Update artworks grid to show multiple artist names when available - mzikherman

### 1.1.3

- Remove the refine button from the gene view, for now, as it doesn’t work right yet - alloy

### 1.1.2

- Artist VC uses one show component for medium & large lists - sarah
- Ensure the artwork rail expand button is not clipped too early - alloy
- Use a larger font size in hero units on iPad - alloy

### 1.1.1

- Only align home view to top of screen, otherwise default to bottom status bar - alloy

### 1.1.0

- Fix layout in Artist Shows component on iPad - sarah
- Order home page rails as per design - alloy
- Include all followed genes on home page (actually limited to 100) - alloy
- Fix crash that would occur for artworks that have no artists - alloy
- Added an auction results button to some artist pages - orta

### 1.1.0-beta.5

- Fix use of outdated artist follow API that lead to a crash - alloy
- Make banners 300 points tall on iPad - alloy

### 1.1.0-beta.4

- GeneVC scrolls as expected, and can request data from Eigen - orta
- Fix crash that would occur when tapping the "failed to load" view retry button a second time - alloy
- Make tapping the search bar open the search VC - sarah

### 1.1.0-beta.3

- Added a search bar to Home - sarah
- Show refresh control until all Relay requests have finished - alloy
- Reduce memory usage of home view by using a ListView to remove views not on screen from the hierarchy - alloy
- Fix text height and truncation for artist cards - maxim
- Add hero units - alloy
- Fix missing image asset issue - alloy
- [dev] Updates Flow to 0.32 - orta
- [dev] Updates React to 0.34 - orta
- [dev] Turns on "keychain sharing" to fix a keychain bug in sim - orta
- GeneVC now shows about information, and trending artists - orta
- GeneVC now shows artworks for the gene - orta
- Show "bid now" call to action on artworks that are in an auction - alloy

### 1.1.0-beta.2

- Adds an initial Gene view - orta
- Animate inverted button state change - alloy
- Do not show follow button on artist view until current status is retrieved - alloy
- Optimistically change state of follow button on artist view - alloy
- Bundle assets into a dir that can be included in release builds - alloy
- Remove typings from the npm `package.json` as the recommendation is a global install - orta
- Make follow artist button in artist rail work and replace with a new suggestion based on that artist - alloy
- Home now asks for maximum of 99 artwork rails - sarah
- Added pull-to-refresh functionality to home view - sarah
- Added a default minimum height for all rails - maxim
- Added a pretty load failure view and allow for retrying - alloy
- Added a section header for all Home rails - sarah
- Added an Artworks rail to Home view - sarah
- Added Danger, a CHANGELOG and some tests - orta

### 1.0.3

[Original release]
