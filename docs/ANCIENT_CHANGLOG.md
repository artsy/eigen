## 1.8.0 (01/04/2015)

- Make Fairs with a FairOrganizer ( e.g. fairs we've worked with for multiple years ) go to martsy instead of native - orta
- Fix a crash when swiping through artworks that have Markdown content - alloy
- Fix the formatting of title strings when title is absent but date is present - 1aurabrown
- Update the display of show header images to fit instead of fill - 1aurabrown
- Update Hero Unit margins - 1aurabrown
- Show the ‘YOU’ tab after tapping it and signing-in - alloy
- Bump minimal iOS version to 7.1 to fix a UICollectionView related crash - alloy
- Fix problem displaying map button on artworks in fairs with no map - ashfurrow
- Update ISO8601DateFormatter to be thread safe - alloy
- Added hooks for the share buttons in articles - orta
- Nullify scrollview delegate of artview after all to ensure it can never crash again - alloy
- Ensure navigation controllers properly cleanup and can’t lead to crashes - alloy
- Ensure web views properly cleanup and can’t lead to crashes - alloy
- Ensure labels don’t overlap with chevrons - alloy
- Add shows and magazine to available tabs - alloy
- Route ‘shows’ natively on iPad - 1aurabrown
- New Explore view - 1aurabrown
- Prefetch hero units and browse data - 1aurabrown & ashfurrow
- Fix broken navigation button layout when rotating on iPad - 1aurabrown
- Show more related artworks on an artwork view - alloy

## 1.7.2 (29/03/2015)

The same as 1.7.1 but _with_ analytics enabled - 1aurabrown

## 1.7.1 (06/03/2015)

- Add previously missing fair editorial content - alloy
- Fix a crash when sharing from an iPad - alloy
- Fix a crash when swiping between artworks. - alloy
- Tapping YOU as a Trial User invokes signup - 1aurabrown
- Share URLs always use desktop, not martsy, urls -- 1aurabrown
- Added works by artists you follow to fair guide Works section - 1aurabrown
- Minor changes to some buttons - 1aurabrown
- Featured categories removed from fair guide - 1aurabrown
- Fix missing thumbnail images on auction results - 1aurabrown
- Automatically invoke keyboard in email sign in on iPad - 1aurabrown

## 1.7.0 (16/02/2015)

- Fair Map will zoom to show annotations on first double tap - 1aurabrown
- Fix iOS 8 status bar in onboarding - ash
- Fixes Fixes blinking map on fair guide - ash
- Revised UI for Show Views to match Artist in Fair - orta
- Support Logged In only Featured links on the main feed - orta
- Allow for more textual content in fair map callout view - alloy
- Only allow the portrait orientation for the fair map view on iPhone - alloy
- Fix fair map annotation view disappearing once selected - alloy
- Fix fair map callout view disappearing on iOS 8 - alloy
- Remove open map button from fair artist view - alloy
- Update birth place/year subtitle on fair artist view - alloy
- Show auction lot on the artwork view - orta
- Added Support for iPhone 6 and 6+ throughout the app - orta
- Facebook auth fix - 1aurabrown

## 1.6.2 (30/01/2015)

- Fix iOS7 Search crash - orta
- Fix artwork view crash - orta
- Set correct sign up context for purchasable works - 1aurabrown
- Tapping a map can hide a callout - orta
- Fix our usages of th/nd/st in dates - orta
- Reset search when you leave the navigation tab - orta
- Buy Now artworks with Editions will see inquiry forms instead of a failed order then the inquiry - 1aurabrown

--- Open Sourced Jan 22 2015 ---

## 1.6.1 (16/01/2015)

- Facebook Auth Fixes - 1aurabrown

## 1.6.0 (05/01/2015)

- New Fair Guide view - ashfurrow
- New App Navigation System - orta
- Fair Search - ashfurrow & 1aurabrown
- New App Search - 1aurabrown
- Support artsy:// routing - orta
- Fixed hero units not loading on first launch - 1aurabrown & orta
- Fixed feature routing was erroring - 1aurabrown

## 1.5.1 (16/07/2014)

- Crash Fix for favourite Artist / Genes - 1aurabrown

## 1.5.0 (10/07/2014)

- Updated Artsy numbers in signup splash, now over 160,000 artworks from 2,500 partners - dblock
- Support e-commerce, including buying works in auctions - dblock
- Favorites now have a tabbed layout with Artworks, Artists and Categories - 1aurabrown
- Fair map is now its own view, removed parallax - ashfurrow
- Fair map on the personalized guide displays by dragging view down - ashfurrow
- Fair map annotations use short partner names - dblock
- Tapping on an item on a fair map displays a callouts with location information - dblock
- Do not display 'No Reserve' for auction works for sale - dblock
- Do not display map icon with an artist at a fair that doesn't have a map - dblock
- Support tapping the titles on show feed items - orta
- Support searching and browsing past fairs - orta
- Added admin option for allowing tapping on partner names on show feed items - orta
- Fixed crash when inquirying on an artwork without a title - dblock
- Fixed leaking of X-Access-Token and X-Xapp-Token headers to external websites - dblock
- Fixed blurry images on main feed - 1aurabrown
- Fixed margin issues with internal browser - dblock
- Fixed artworks disappearing on artist's page - dblock
- Cleaned up display of artist with no artworks - dblock
- Web views with links to log-in or sign-up are captured in the app - dblock
- New Fair Overview view - ashfurrow

## 1.4.3 (4/29/2014)

- Fixed search on 3.5'' iPhone, search bar cannot be clicked - dblock

## 1.4.2 (4/21/2014)

- External links prompt and open in a browser in demo mode - orta
- Updated Artsy color scheme - katarinabatina
- Fixed thumbnail when sharing via Twitter or Facebook - dblock
- Fixed sharing via AirDrop - dblock
- Fixed crash on artwork view - dblock
- Fixed settings labs feature - dblock
- Fixed beta auto-update - ashfurrow

## 1.4.1 (4/11/2014)

- Redesigned artwork inquiry workflow - katarinabatina
- Updated signup splash assets, moved logo - robertlenne
- Updated Artsy numbers in signup splash, now over 125,000 artworks from 1,500 partners - dblock
- Added ability to inquire on works for logged out users - dblock
- Added ability to contact Artsy specialists for logged out users - dblock
- Added artwork More Info page - 1aurabrown
- Added an error message trying to reach Artsy on splash - dblock
- Added ASCII art mode - dblock
- Added fade-in transition for splash screen after slideshow - dblock
- Added ability for users to re-login after expired or corrupted access tokens - dblock
- Improved performance and responsiveness of in-fair maps - dblock, orta
- Do not display Back button on fair overview when coming from global nav - 1aurabrown
- Do not display Contact Seller for artworks in auction - dblock
- Removed white glow from white hero units - 1aurabrown
- Removed shadowing of navigation buttons during transitions - dblock
- Fixed display of dollar amounts for auction price estimates - orta
- Fixed background color when pulling down on splash - dblock
- Fixed display of artworks for sale count on artist pages - dblock
- Fixed prematurely closing auctions by using server-side time - dblock
- Fixed display of artwork dimensions in both cm and inches - orta
- Fixed crash selecting a search result while still searching - dblock
- Fixed crash when loading home feed - dblock
- Fixed highlighting shows that have been previously favorited on fair map - dblock
- Fixed some partners not linked to their profile and cannot be followed in fairs - 1aurabrown
- Fixed web views incorrectly navigating to root of m.artsy.net instead of app nav - 1aurabrown
- Fixed crash displaying artworks with diameter - dblock
- Fixed crash after returning from a partner website from an artwork at a fair - dblock
- Fixed map items not tappable unless zoomed all the way in - 1aurabrown
- Fixed dark background in signup splash back from login or signup - dblock
- Fixed social signup that may not always display errors - dblock
- Fixed user favorites layout with different cases of favorited artists, artworks and genes - dblock
- Fixed signup and login password dots displaying in different font size when focused - dblock
- Fixed total artwork count on artist view - dblock
- Fixed line spacing in artwork auction results - dblock
- Fixed separator color between posts - dblock
- Fixed layout of gene pages without a description - dblock

## 1.3.1 (3/4/2014)

- Added map annotation analytics - dblock
- Fixed scolling on fairs without maps - orta
- Fixed crash upgrading from a previous version for logged in users - dblock
- Fixed displaying show at fair from A-Z list - dblock
- Fixed unfollowing a gallery doesn't update the map status - 1aurabrown

## 1.3.0 (3/3/2014)

- Added native fair experience with search, map, guide, features and posts - orta, robb, dblock, 1aurabrown
- New home screen search UI - dblock
- Display and edit user settings in labs - 1aurabrown
- Display related posts under artists and artworks - dblock
- Added search activity spinner and improved results fading - dblock
- Push notifications slide down and are no longer displayed as a popup - dblock
- Opening a notification when the app is in the background will not re-display the message in a popup - dblock
- Fixed `first_user_install` metric incorrectly reported - dblock
- Fixed hero units appearing outside of their start/end dates - dblock
- Measure initial feed load time with `initial_feed_load_time` metric - dblock
- Fixed intermittent logout on app restart - orta

## 1.1.0.2 (11/12/2013)

- Fixed truncation of artist artworks on 3.5" screens - dstnbrkr
- Allow blank inquiries - dstnbrkr
- Fixed crash: don't load stored, fetched items - dstnbrkr

## 1.1.0.1 (11/12/2013)

- Updates to design of auction price elements
- Prepend new feed items (were previously appended)
- Remove passive network error alert
- Include device type in User-Agent string
- Graphical improvements to search results
- Animate appearance of bidder status banners
- Move Artsy specialist icon above the subtitle
- Disable background fetch

## 1.1.0.0 (11/6/2013)

- Add live auction support to artwork view
- Add native auction results for artworks
- Add staging switch to admin menu
- Show auction-related works when work is in an auction
- Refactor internal URL handling
- Add profiles to search results

## 1.0.2.2 (10/14/2013)

- Fix nav button / menu overlap
- Fix related artists headline when no content

## 1.0.2.1 (10/14/2013)

- Added auction results button to artwork screen
- Added spinner to forgot password request
- Fixed crash when userdata filepath is nil
- Fixed crash when twitter auth is cancelled
- Fixed twitter login
- Fixed scroll-to-top in artwork view
- Turn on iPad support for all but debug builds
- Require all users to re-upload APNS device tokens

## 1.0.2.0 (10/14/2013)

- Improved performance of show feed load
- Use background fetch to load show feed
- Initial auction results API
- Remove extra loading of related works
- Fix loading/displaying of favorites

## 1.0.0.154 (10/7/2013)

- Improved internal app routing
- The artwork transitions are back to working state
- Builds as a 64 bit app for the new iPhone

## 1.0.0.148 (9/23/2013)

- Initial iPad support on feed and browse screens

## 1.0.0.147 (9/20/2013)

- Add void transition to last step of onboarding
- Misc fixes to sharing behavior
- Fix view in room scale when dimensions are in cm
- Update to SDWebImage 3.4

## 1.0.0.146 (9/20/2013)

- Support markdown in artwork blurbs
- Potential fix for crash during facebook authentication
- Potential fix for gesture delegate crash
- Improve metrics

## 1.0.0.145 (9/18/2013)

- Can now go back to search results
- Fix jumpiness in artwork detail render (show a spinner while info loads)
- Disable contact buttons when offline
- Improve scroll performance by reducing layer composting
- Misc graphical fixes

## 1.0.0.142 (9/12/2013)

- Artists artworks fade in and out when selection changes
- Fix to send push notification tokens to the website for later use
- Get feed data whilst the app is idle on onboarding
- Fixes for redirects in external sites
- Consolidation of keyboard colors

# 1.0 (9/11/2013)

- Initial public release to the App Store

## 0.0.140 (9/11/2013)

- Added a placeholder thumbnail for search results w/o an image
- Improved onboarding metrics
- Added preliminary auction results button
- Design improvements on login controller

## 0.0.133 (9/9/2013)

- Fixed handling of stale credentials
- Made ARTextView HTML parsing async
- Added additional analytics
- Improved user identification in analytics
- Misc fixes for feed links

## 0.0.130 (9/9/2013)

- Fixes to authentication on fresh installs
- Redirect users trying to sign in when they have accounts to the log in page
- Improved navigation button logic

## 0.0.129 (9/6/2013)

- Fix crash on related artworks

## 0.0.121 (9/5/2013)

- Corrected scale in View In Room
- Back button shows in View in Room portrait after switching to landscape and going back
- Gene titles dont overlap the selected tick
- Retina share icon
- Fixes to having multiple cancels in the menu
- Removed artwork spinner
- Disable for sale button on artist when artist has no for sale works
- Featured links come from the server
- More protection against nav buttons hiding
- Removed white bar above artworks
- Better handling of artworks with no prices

## 0.0.119 (9/4/2013)

- Improved analytics
- Real links for home feed
- Improved pricing on artworks

## 0.0.118 (9/4/2013)

- Fixes an issue with connecting to the right push notification server

## 0.0.117 (9/4/2013)

- Potential Artwork Zoom memory fixes
- Initial work on notifications in app
- Artwork pricing styling matches other sites

## 0.0.113 (9/3/2013)

- Matched the same categories as the website in browse
- Protection for people changing their minds mid-way through twitter signin and signup
- Improved typography around the app, notably page titles and hero units
- Shouldn't hide nav buttons if you are at the top of a view
- Search has a information label letting you know what you can search for
- Collector Level & Price Range are sent up to artsy so we can keep track of pricing
- Improvements to the layout in artist views

## 0.0.111 (9/2/2013)

- Brings back some missing assets, notably the back & close button icons
- Hides the artist bio if the artsy doesn't have a bio
- Related artist names are now clickable

## 0.0.110 (9/2/2013)

- Facebook / Twitter will log you in if you try to sign up with an existing account on artsy
- More asset compression to speed up app
- Added trial view thresholding to encourage sign in
- Added more precautions against rotating in the wrong place
- Featured Links added to the top of show feed

## 0.0.108 (9/1/2013)

- Fixes for 4" devices

## 0.0.103 (9/1/2013)

- Artwork zoom transition takes the scrolling offset into account
- Uses new faster blur API
- Internal browser links respect the edge swipe
- Fixes to single lines of artist artworks

## 0.0.102 (9/1/2013)

- Initial recommended genes are taken from the server, with a local backup
- Don't show partner chevron if there's no profile / website
- Navigation buttons respect the 3 second waiting period
- Initial work on an extremely simple push notification support

## 0.0.101 (8/31/2013)

- Fix for the 3.5" screen being reported for 4" devices

## 0.0.99 (8/31/2013)

- Added in-app analytics
- Loading artwork shows a spinner
- No more white lines on the artwork view
- Added forgot password workflow
- Show location now takes into account location in fairs
- Partner link in Artwork now takes you to the right partner profile

## 0.0.95 (8/30/2013)

- Fixed strange scrolling on artworks
- Better splash fadeout animation
- Showing the trial splash with an action (eg. favoriting a work) will do the action after sign up
- Fixes to twitter sign in on splash, and dealing with 3.5" screen
- Uses existing email if available in sign up with social

## 0.0.93 (8/30/2013)

- Login or Sign up via Facebook or Twitter
- Add personalize, including following artists and genes during signup
- Fix: heart button doesn't show grey border
- Fix: trial button doesn't flash on load
- Improvements to the behavior of nav buttons
- Fixed crash when scrolling through hundreds of artworks on artists and genes

## 0.0.92 (8/29/2013)

- Having no artworks in Favorites is now dealt with elegantly, with a hint of playfulness
- Creating a new user will keep you logged in
- Added terms & conditions, and privacy policy to sign up pages
- Added network failsafes for generating trial tokens
- Artist heart buttons now enabled by default so trial users can trigger them
- Improvements to the favorites loading indicator
- Personalize section of onboarding has a black background

## 0.0.91 (8/29/2013)

- Fix for View In Room Logic
- Edge swipes in Onboarding work
- Nav buttons are now top aligned
- Hero units are loaded when signing in / up
- Potential fix for iPhone 5 slideshow animation bug

## 0.0.90 (8/29/2013)

- Menu & Back buttons are at the bottom
- Menu & Back buttons will disappear depending on scroll direction
- Parallax direction is reveresed
- Trial sign up/in splash animates into view
- Fixed accidental jump back to the show feed
- Revised Menu, also is now insta-blur
- The app will now requesting rating after 10 days of usage

## 0.0.88 (8/28/2013)

- Adjustments to Onboarding, slideshow images, and the app menu parallax

## 0.0.86 (8/28/2013)

- New onboarding process that lets users create an account when trying to do things like favoriting
- Multiple artwork view fixes
- Added labs features for different navigation styles
- New menu style
- Multiple View in Room improvements

## 0.0.81 (8/27/2013)

- Added support for Guest log-in
- Improved Artwork View scrolling speed
- Improved shows view performance
- JSON parsing for most models is done off them main thread
- Added a non-interactive transition for edge swiping on every view
- Substantial Gene page improvements
- Added navigation options in the options panel, available via rage-shake

## 0.0.80 (8/31/2013)

- Display artwork Buy buttons for purchaseable works
- Display image rights when available
- Partner links are clickable
- Collection Institutions are shown and are linkable
- Inqiries are now sending live inquiries
- Loading footers on Gene Favorites
- Removed the triple tap on the hero units
- Added an option for the zoom tap to push in, instead of popping out
- Fixed layout with upside-down phones
- Don't show related artworks when not available
- Tapping the artwork in View in Room exits View in Room

## 0.0.79

- Artwork view auto layout
- Artwork view's related artworks show artist and artwork name
- Artwork view shows a minimum of ~30 pixels of artwork info, enough to show the tops of the action buttons
- Genes / Favorites views have been restructured for significantly lower memory consumption
- Back button works in full screen artwork zoom
- Removed instances of artworks accidentally scrolling
- Consolidated title positions throughout app
- Used correct image thumbnails in masonry height
- Hide back button in VIR when rotated
- Unpublished search results are now visually different
- Menu state only shows the selection if you open the menu from that view
- Fixed dark, pushed back root view controller

## 0.0.78

- Added grey artist chevron
- New search UI
- Added drop shadow to hero units, see in the rage-shake menu for a subtler alternative
- Edge swipe added to all views to go back
- New navigation aligments
- Added support for multi-line titles

## 0.0.71

- Improved logic for Back / Menu button
- For Sale Artworks on the Artist page are now generated from the All Published Artworks, loading instantly
- Hearts now flip vertically instead of the coin dropping animation
- Using new Unfollow API
- Artist names, and bio buttons are hidden when not there's nothing to show
- The rage-shake menu now contains an option to start onboarding
- Added option to make loading screens semi-transparent, so you can see what's happening behind the scenes
- Search requests that are cancelled are not reported as network errors
- Related artists appear under artists
- Post button is hidden on the menu
- Added protection against rotation on most views

## 0.0.68

- New nav concept
- Favorites now have a design
- Favorites now show artists
- Favorites now show genes
- Two-column masonry views now use full width
- Gene pages have an expandable description
- Internal (m.artsy) links are given the full navigation stack
- Website have black background for void-y-ness
- Artist Bios now show fully linked texts
- Fixed awkward scrolling in the Gene page
- Artists can be followed
- Genes can be followed

## 0.0.65

- API requests to artsy.net instead of artsyapi
- Force mobile pages to load without HTTPS

## 0.0.64

- Add Follow Artists
- Add Follow Genes
- Reduced App File Size by optimizing VIR images
- Improved typography on artwork page
- More loading screens when needed
- Supports internal / external links
- Hero Units are clickable
- Fixes to height in Show Feed
- Sharing copy improvements

## 0.0.63

- Genes now have a view
- Genes can be loaded from search, or through browse

## 0.0.62

- Added Browse Genes
- Added Search, including artists and artworks

## 0.0.61

- Artist View has more Polish, including share, heart and progress indicators
- Artists now have a bio page
- Display specific errors on API failures
- Improved general network error message for passive network issues

## 0.0.59

- Artist View; shows Artworks, artist info, and for sale only artworks
- Artist View is accessible view from tapping on an Artwork's artist
- Buttons for contact / inquire are now based on the artwork itself
- Indicators for Hero Units are now overlaid on the Units

## 0.0.54

- Smarter status bar positioning
- Rewrote transition to be faster & to use CALayer transforms, no view manipulation.
- Don’t change status bar in menu
- Inquiry uses garamond 16, has purple selection state
- Define a minimum artwork info size for artworkVC
- Fix related showing over full screen image
- Favorites don’t do animation & hero units can’t crash when dealing with empty state restoration
- Hero unit cleanup: shadow moved to above the views so no overlap & no more dodgy cropping when moving
- View in room now uses a different guy, walls meet at an alignment
- Remove all options; show VIR parallax by default, show title & show headlines
- Inquiry cancels by dropping, and background is faded in
- Black status bar

## 0.0.51

- Contact Gallery / Representative now has logic determining whether to show or not - speednoisemovement
- Shows load faster in the feed - speednoisemovement
- Menu only shows what's relevant - orta
- Menu will have correct item highlighted - orta
- Favorites has semi-built ability to show artwork metadata - orta
- Applied easing to enquiry form ( still stubbed. ) - orta
- Feeds are smarter about what data to reload - orta
- Statusbar is hidden when going into an artwork set - orta
- Feed & Favorites have a full screen loading view - orta
- Memory fixes for Masonry view - orta
