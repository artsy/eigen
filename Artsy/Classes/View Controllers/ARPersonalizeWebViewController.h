#import "ARInternalMobileWebViewController.h"

@protocol ARPersonalizeWebViewControllerDelegate <NSObject>
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;
- (void)webOnboardingDone;
@end

@interface ARPersonalizeWebViewController : ARInternalMobileWebViewController
@property (atomic, weak) id <ARPersonalizeWebViewControllerDelegate> personalizeDelegate;
@end
