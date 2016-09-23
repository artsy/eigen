#import "ARExternalWebBrowserViewController.h"

@class Fair;

@interface ARInternalMobileWebViewController : ARExternalWebBrowserViewController <UIScrollViewDelegate>

@property (nonatomic, strong) Fair *fair;

// TODO MAXIM URGENT: find alternative here / do we still need this?
//- (void)startLoginOrSignupWithTrialContext:(ARTrialContext)context;
//- (ARTrialContext)trialContextForRequestURL:(NSURL *)requestURL;

@end
