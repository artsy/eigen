#import "ARTCityGuideViewManager.h"
#import <React/RCTViewManager.h>
#import "Artsy-Swift.h"

@implementation ARTCityGuideViewManager

RCT_EXPORT_MODULE(ARTCityGuideView)

- (UIView *)view
{
  return [[CityGuideView alloc] init];
}

@end
