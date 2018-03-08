@import UIKit;
@class ARAugmentedRealityConfig;

#import "ARMenuAwareViewController.h"
#import "ARAugmentedVIRSceneController.h"

@interface ARAugmentedVIRViewController : UIViewController <ARMenuAwareViewController, ARVIRDelegate>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config;

@end
