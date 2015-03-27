## 2015.03.31

* Bump minimal iOS version to 7.1 to fix a UICollectionView related crash - alloy
* Fixes problem displaying map button on artworks in fairs with no map - ashfurrow
* Update ISO8601DateFormatter to be thread safe - alloy
* Added hooks for the share buttons in articles - orta
* Nullify scrollview delegate of artview after all to ensure it can never crash again - alloy
* Ensure navigation controllers properly cleanup and can’t lead to crashes - alloy

## 2015.03.28

* Ensure web views properly cleanup and can’t lead to crashes - alloy

## 2015.03.27

* Ensure labels don’t overlap with chevrons - alloy
* Add shows and magazine to available tabs - alloy
* Fix a crash caused by the assumption that an artwork will always have a artist - alloy
* Browse renamed to Explore - 1aurabrown
* Ensure XAPP token is fetched before pre-loading browse and hero units - 1aurabrown
* Logout and switching servers now completely exits app - 1aurabrown

## 2015.03.20

* Route shows natively on iPad - 1aurabrown
* New Browse view - 1aurabrown
* Prefetch hero units and browse data - 1aurabrown & ashfurrow
* Fix broken navigation button layout when rotating on iPad - 1aurabrown
* Only show ‘unpublished’ work warning once - alloy
* Show more related artworks on an artwork view - alloy

## 2015.03.03

* Fix a crash when sharing from an iPad. - alloy
* Fix a crash when swiping between artworks - alloy
* Tapping YOU as a Trial User invokes signup - 1aurabrown
* Share URLs always use desktop, not martsy, urls -- 1aurabrown
* Added works by artists you follow to fair guide Works section - 1aurabrown
* Minor changes to some buttons - 1aurabrown
* Featured categories removed from fair guide - 1aurabrown
* Fix missing thumbnail images on auction results - 1aurabrown
* Automatically invoke keyboard in email sign in on iPad - 1aurabrown

## 2014.12.24

* Fix iOS 8 status bar in onboarding - ash
* Fixes blinking map on fair guide - ash
* Revised UI for Show Views to match Artist in Fair - orta
* Support Logged In only Featured links on the main feed - orta
* Allow for more textual content in fair map callout view - alloy
* Only allow the portrait orientation for the fair map view on iPhone. - alloy
* Fix fair map annotation view disappearing once selected - alloy
* Fix fair map callout view disappearing on iOS 8 - alloy
* Remove open map button from fair artist view - alloy
* Update birth place/year subtitle on fair artist view - alloy
* Show auction lot on the artwork view - orta
* Added Support for iPhone 6 and 6+ throughout the app - orta
* Facebook auth fix - 1aurabrown
