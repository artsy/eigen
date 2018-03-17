@import UIKit;
@class ARAugmentedRealityConfig;

#import "ARAugmentedVIRInteractionController.h"

/**
 A view controller which handles interacting with an VIRInteractionController to
 present a view in room experience.
 */
@interface ARAugmentedVIRViewController : UIViewController <ARVIRDelegate>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config;

@end
