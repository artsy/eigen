### Unreleased

* Reduce memory consumption while indexing all of the user’s favourites. - alloy

### 2.3.0 (2015.10.09)

* Fix crash on iOS 8 when trying to workaround WKWebKit scroll deceleration bug. - alloy
* Fix a layout bug in embedded models VC on iPad. - alloy 

### 2.3.0 (2015.10.08)

* Fixes post-bidding bug on iPad, return to native artwork view instead of Force view - jorystiefel
* Added "Not for Sale" to the Artwork's price information - orta
* Workaround bug in WKWebKit that makes it impossible to fix the scrollview’s deceleration rate through public API. - alloy
* Fixed Peek/Pop issue where items from a view lower in the stack would get previewed. - orta
* Added a spinner to bidding flow so after bidding, user doesn't see flash of old amount or "Not for sale" message - jorystiefel
* Remove auction registration webview from VC stack once completed and reload the artwork webviews for that auction. - alloy
