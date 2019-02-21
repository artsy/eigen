#import <Emission/ARFairComponentViewController.h>
#import "ARFairSearchViewController.h"
#import "ARMenuAwareViewController.h"

@interface ARFairComponentViewController (Eigen) <ARFairSearchViewControllerDelegate, ARMenuAwareViewController>

- (void)presentFairSearchViewController:(ARFairSearchViewController *)searchViewController completion:(void (^__nullable)(void))completion;

@end
