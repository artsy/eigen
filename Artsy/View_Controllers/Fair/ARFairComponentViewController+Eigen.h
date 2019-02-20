#import <Emission/ARFairComponentViewController.h>
#import "ARFairSearchViewController.h"

@interface ARFairComponentViewController (Eigen) <ARFairSearchViewControllerDelegate>

- (void)presentFairSearchViewController:(ARFairSearchViewController *)searchViewController completion:(void (^__nullable)(void))completion;

@end
