#import "NATiledImageMapView.h"

// This custom subclass moves the subviews into a single content view so that we can safely use a
// mix of both frame and Auto Layout code, as described under ‘Mixed approach’ here:
//
//   https://developer.apple.com/library/ios/releasenotes/General/RN-iOSSDK-6_0/index.html
//
// It does this by overriding the UIView subview APIs (that we currently use), so that the existing
// code can remain the same and no immediate changes are needed to the NAMapView library.
//
@interface ARFairMapView : NATiledImageMapView
@end
