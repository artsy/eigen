@import UIKit;
@class ARAugmentedRealityConfig;

#import "ARMenuAwareViewController.h"

@interface ARAugmentedVIRViewController : UIViewController <ARMenuAwareViewController>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config;

@end
