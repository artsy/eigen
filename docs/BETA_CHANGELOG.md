## Next

* Do not show the search navigation button on fullscreen artwork view. - alloy
* Fix a crash caused by allowing the user to tap artworks in the ‘For Sale’ section of an artist that were actually
  stale cells of the ‘Artworks’ tab. The stale cells were being shown because of assumptions about the artworks being
  loaded before the end of the tab switch animation, which was prone to breakage on slow connections. - alloy
* Fix a crash caused by not guarding against `nil` values in show/partner analytics data. - alloy
* Add more breadcrumbs in order to fix my nemesis crasher in ARTiledImageView. - alloy
* Fixes a problem with view-in-room showing the back button when it was initially rotated into. - ash

## 2.1.0 (2015.07.20)

* Do not show the search navigation button in VIR mode. - alloy
* Adds Adjust SDK to the app. - orta
* Add back analytics page view event for Search and add Bell. - alloy
* Fixes crash on expanding gene text. - ash
* Hero units load when app connects to internet after offline start. - ash
* Explore tab loads when app connects to the internet after offline start. - ash

## 2.1.0 (2015.07.18)

* Fix broken web onboarding constraints - 1aurabrown
* Constrain size of launch logo to smaller size on iphone - 1aurabrown
* Keep search outside of the navigation stack and maintain search results. - alloy
* Make hit test areas of ‘MAG’, ‘YOU’, and ‘bell’ tab buttons wider. - alloy
* Adds some spacing to the question on "do you buy art?" in onboarding - orta
* Fix bad margins around home button - 1aurabrown
* Add updated design for when connection errors occur. - alloy
* Force the feed view controller to load its content when the network becomes available. - alloy
* Fix top margin & whitespace gobbler for shows without install shots - 1aurabrown
* Force portrait orientation for the admin menu on iPhone, which could be wrong on top of a landscape VIR view. - alloy
* Don't use square placeholder image for artwork image preview. - 1aurabrown

## 2.1.0 (2015.07.11)

* Show sign-in/sign-up flow when selecting ‘bell’ tab as a trial user. - alloy
* Fetch pending notifications count when the user signs-up/signs-in. - alloy
* Open notifications tab when tapping an incoming push notification. - alloy
* Always poll for remote notifications on app activationg. - alloy
* Reload notifications view whenever notifications come in or have been polled. - alloy
* Mark notifications as seen once the new notifications view has been loaded and was visible. - alloy
* Move search button from tab bar to navigation bar. - alloy
* Replace add/removeConstraint with activate/deactivateConstraints in ARArtworkPreviewImage View in hopes of fixing autolayout crash - 1aurabrown

## 2.1.0 (2015.07.04)

* Reduced the filesize of the Artsy Loading screen - orta
* Change onboarding callback to use a block rather then a delegate message. - 1aurabrown
* Pre-cache all Artsy Fonts on App launch. - orta
* Migrated to frameworks under the hood. This is a massive change to a lot
  of the foundations of the app. Most importantly it required making breaking 
  changes to facebook that are more or lesss impossible to test automatically. - orta
* Load all artworks in an artwork's show in the "artwork related artworks" view. - 1aurabrown
* Fixes auctions route. – ashfurrow
* Fix crash that could easily occur when the user would navigate back from a martsy view before it was fully done loading. - alloy
* Remove opaque background from Search keyboard. - 1aurabrown
* Reduce height of inquiry form on iPad - 1aurabrown
* Fix ARCollapsableTextView not expanding to full height - 1aurabrown
* Gracefully handle cancellation of sign-in with Twitter (and presumably on device with Facebook). - ashfurrow
* Adds ‘bell’ notifications tab and shows notification count (currently only on launch and only if already signed-in). - alloy
* Fix personalize search bar. - 1aurabrown

