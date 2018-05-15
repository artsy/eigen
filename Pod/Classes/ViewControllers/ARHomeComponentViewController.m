#import "ARHomeComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

- (void)changeHomeTabTo:(ARHomeTabType)tab
{
    NSMutableDictionary *appProperties = [self.rootView.appProperties mutableCopy];
    appProperties[@"selectedTab"] = @(tab);
    self.rootView.appProperties = appProperties;
}

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID tab:(ARHomeTabType)selectedTab emission:(nullable AREmission*)emission;
{
    NSDictionary *initialProperties = artistID ? @{ @"selectedArtist": artistID, @"initialTab": @(selectedTab) } : @{ @"initialTab": @(selectedTab) };
    if ((self = [super initWithEmission:emission
                             moduleName:@"Home"
                      initialProperties:initialProps])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
