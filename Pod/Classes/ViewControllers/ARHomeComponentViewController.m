#import "ARHomeComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID tab:(ARHomeTabType)selectedTab emission:(nullable AREmission*)emission;
{
    NSDictionary *initialProps = artistID ? @{ @"selectedArtist": artistID, @"selectedTab": @(selectedTab) } : @{ @"selectedTab": @(selectedTab) };
    if ((self = [super initWithEmission:emission
                             moduleName:@"Home"
                      initialProperties:initialProps])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
