#import "ARInternalMobileWebViewController.h"

@interface ARPaymentRequestWebViewController : ARInternalMobileWebViewController

@property (nonatomic, readonly, strong) NSURL *originalURL;

- (instancetype)initWithURL:(NSURL *)URL;

- (void)paymentRequestHasBeenPaid;

@end
