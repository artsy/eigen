## 2.3.0 (2015.09.25)

* Improved Spotlight support for favorites. - alloy
* Make Native to desktop web Handoff work. - alloy
* Convert all web views to use WKWebView - orta

## 2.3.0 (2015.09.18)

* Add support for Universal Links on iOS 9. - alloy
* Add support for Web-to-Native Handoff. - alloy
* Make CircleCI work again by adding the `build` action to the `test` task to ensure the simulator is running. - alloy
* Remove `?foo=bar` parameter from Martsy calls - jorystiefel
* Re-installed all pods with current CocoaPods version, ensuring they’re installed from the new ‘externals’ cache. If running `pod install` changes checksums in `Podfile.lock` for you, then delete your `Pods` checkout and run `pod install` again. - alloy
* NSUserActivity object creation to support Spotlight Search and Handoff - jorystiefel
* Add Spotlight support for favorite artworks, artists, and genes. - alloy
