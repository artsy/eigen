#import "ARHomeComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID tab:(NSInteger)selectedTab emission:(nullable AREmission*)emission;
{
    NSDictionary *initialProps = artistID ? @{ @"selectedArtist": artistID, @"selectedTab": @(selectedTab) } : @{ @"selectedTab": @(selectedTab) };
    if ((self = [super initWithEmission:emission
                             moduleName:@"Home"
                      initialProperties:initialProps])) {
        _selectedArtist = artistID;
    }
    return self;
}

- (NSLayoutConstraint *)topLayoutConstraintWithRootView:(UIView *)rootView;
{
  return [NSLayoutConstraint constraintWithItem:rootView
                                      attribute:NSLayoutAttributeTop
                                      relatedBy:NSLayoutRelationEqual
                                         toItem:self.view
                                      attribute:NSLayoutAttributeTop
                                     multiplier:1
                                       constant:0];
}

@end
