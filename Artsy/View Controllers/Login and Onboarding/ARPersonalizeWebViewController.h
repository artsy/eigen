#import "ARInternalMobileWebViewController.h"

@protocol ARPersonalizeWebViewControllerDelegate <NSObject>
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;
- (void)webOnboardingDone;
@end

@interface ARPersonalizeWebViewController : ARInternalMobileWebViewController
@property (nonatomic, weak) id <ARPersonalizeWebViewControllerDelegate> delegate;
@end
