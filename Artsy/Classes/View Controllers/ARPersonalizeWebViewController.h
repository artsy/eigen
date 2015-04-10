#import "ARInternalMobileWebViewController.h"

@protocol ARPersonalizeWebViewControllerDelegate <NSObject, TSMiniWebBrowserDelegate>
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;
- (void)webOnboardingDone;
@end

@interface ARPersonalizeWebViewController : ARInternalMobileWebViewController
@property (atomic, weak) id <ARPersonalizeWebViewControllerDelegate> delegate;
@end
