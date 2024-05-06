## Platform Differences

This is a running document of UX, DX/code deltas between Android and iOS. Our ultimate goal is to get as close as possible to parity on the two platforms for both Developer Experience (DX) and User Experience (UX).

#### Important Exceptions

- When there is a choice between DX and UX, UX takes precedent.
- If better platform integration requires platform specific code we should be okay with that.

However in most cases better DX leads to better UX and consolidation across platforms will lead to a better experience for us and our users.

#### DX differences:

Push Notifications:

- on iOS these are handled via custom native modules and code on native side, we also have an extension for supporting rich push notifications, on Android we use an npm package, react-native-push-notification, and cofigure using a hook on login. Can we use the same library on iOS?

#### UX Differences:

View In Room (iOS only):

- we support viewing artworks on walls, this is all native iOS code that has not been ported to Android

City Guide (iOS only):

- we have a map driven feature for finding fairs, galleries and shows in supported cities, you get there through a tile in search tab, this feature is semi-deprecated so likely won't be ported to android, it is a combination of both native and react-native code

Media Previews (iOS only):

- in inquiries galleries can respond to messages with attachments, tapping on a message with a PDF or image attachment shows a new window with a preview,
  seems like there should be a library or this should be straightforward to do on Android as well

Live Auctions:

- On iOS we have native screens for handling live auctions and bidding via websockets, on Android we use prediction via a webview. Don't know numbers but would guess that it would be worthwhile to have a native experience on both platforms to improve UX
