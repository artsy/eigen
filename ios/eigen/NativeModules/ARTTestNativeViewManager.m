#import <MapKit/MapKit.h>
#import <React/RCTViewManager.h>

#import "ARTTestNativeViewManager.h"

@implementation ARTTestNativeViewManager

RCT_EXPORT_MODULE(ARTTestNativeView)

- (UIView *)view
{
  return [[MKMapView alloc] init];
}

@end
