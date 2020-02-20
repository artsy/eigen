# RCTTest

This directory contains the Objective-C files from [React Native's RCTTest library](https://github.com/facebook/react-native/tree/master/Libraries/RCTTest). Facebook's [original React Native license](https://github.com/facebook/react-native/blob/35a136801cbd9dd92604ca33bf364cf63d97a59a/LICENSE) is included in the LICENSE file.

## Why

This was added in [this PR](https://github.com/artsy/emission/pull/1255) to get around [this bug in CocoaPods](https://github.com/CocoaPods/CocoaPods/issues/7195). The bug limits how child targets can override a dependency's subspecs from its parent target, which means that in order for the child target (our test) to access the `RCTTest` subspec, it would need to be included in the parent target (the Emission iOS app). However, this won't work because `RCTTest` links against `XCTest`, which isn't available on devices.

The choices we considered were:

- Move our unit tests into their own Xcode project.
- Vendor the RCTTest library, modifying its `#import` declarations where necessary.

The biggest difference between the two options is what they make difficult and what they make complex. The first option makes upgrading React Native versions easier, but makes it more complex to write and run unit tests. The second option makes upgrading React Native more difficult, but makes tests easy to write and run.

Since we write and run unit tests more often than upgrading React Native versions, we chose that option.
