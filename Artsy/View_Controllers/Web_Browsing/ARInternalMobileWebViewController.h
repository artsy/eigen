#import "ARExternalWebBrowserViewController.h"
#import "ARTrialController.h"

@interface ARInternalMobileWebViewController : ARExternalWebBrowserViewController <UIScrollViewDelegate>

@property (nonatomic, strong) Fair *fair;

- (void)startLoginOrSignupWithTrialContext:(ARTrialContext)context;
- (ARTrialContext)trialContextForRequestURL:(NSURL *)requestURL;

@end
