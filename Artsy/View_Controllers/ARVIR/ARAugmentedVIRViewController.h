@import UIKit;
@class ARAugmentedRealityConfig;

#import "ARAugmentedVIRInteractionController.h"

/**

 */
@interface ARAugmentedVIRViewController : UIViewController <ARVIRDelegate>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config;

@end
