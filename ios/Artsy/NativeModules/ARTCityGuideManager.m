#import <React/RCTViewManager.h>
#import "Artsy-Swift.h"

@interface ARTCityGuideManager : RCTViewManager
@end

@implementation ARTCityGuideManager

RCT_EXPORT_MODULE(ARTCityGuideView)

- (UIView *)view
{
    return [[CityGuideView alloc] init];
}

@end

