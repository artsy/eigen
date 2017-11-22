#import "ARHomeComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

- (instancetype)initWithSelectedArtist:(NSString *)artistID;
{
    return [self initWithSelectedArtist:artistID emission:nil];
}

- (instancetype)initWithSelectedArtist:(NSString *)artistID emission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"WorksForYou"
                      initialProperties:artistID ? @{ @"selectedArtist": artistID } : nil])) {
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
