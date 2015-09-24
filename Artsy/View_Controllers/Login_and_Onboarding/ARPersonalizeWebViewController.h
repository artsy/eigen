#import "ARInternalMobileWebViewController.h"
#import "AROnboardingViewController.h"


@interface ARPersonalizeWebViewController : ARInternalMobileWebViewController

@property (atomic, weak) id<ARLoginSignupDelegate> personalizeDelegate;

@end
