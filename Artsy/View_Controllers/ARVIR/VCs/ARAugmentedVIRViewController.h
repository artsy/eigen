@import UIKit;
@class ARAugmentedRealityConfig;

#import "ARVIRVerticalWallInteractionController.h"

/**
 A view controller which handles interacting with an VIRInteractionController to
 present a view in room experience.
 */
@interface ARAugmentedVIRViewController : UIViewController <ARVIRDelegate>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config;

@property (readonly, nonatomic) ARAugmentedRealityConfig *config;

// Used to exit AR
- (void)exitARContext;

// Time spent in AR, in seconds
- (NSTimeInterval)timeInAR;
@end
