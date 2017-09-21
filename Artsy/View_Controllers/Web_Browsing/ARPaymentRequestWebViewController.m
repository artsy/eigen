#import "ARPaymentRequestWebViewController.h"
#import "ARAppConstants.h"
#import "ARRouter.h"

@interface ARPaymentRequestWebViewController ()
@end

@implementation ARPaymentRequestWebViewController

- (instancetype)initWithURL:(NSURL *)URL;
{
    NSURL *initialURL = URL;
    if ([ARRouter isProductionPaymentRequestURL:initialURL] && ![initialURL.scheme isEqualToString:@"https"]) {
        NSURLComponents *components = [NSURLComponents componentsWithURL:initialURL resolvingAgainstBaseURL:YES];
        components.scheme = @"https";
        initialURL = components.URL;
    }
    if ((self = [super initWithURL:initialURL])) {
        _originalURL = URL;
    }
    return self;
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    if (navigationAction.navigationType == WKNavigationTypeOther) {
        if ([navigationAction.request.URL.fragment isEqualToString:@"success"]) {
            [self paymentRequestHasBeenPaid];
            return WKNavigationActionPolicyAllow;
        }
    }
    return [super shouldLoadNavigationAction:navigationAction];
}

// This uses the *original* URL because the listeners may compare against that and not our possibly https fixed URL.
- (void)paymentRequestHasBeenPaid;
{
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc postNotificationName:ARPaymentRequestPaidNotification
                      object:self
                    userInfo:@{ ARPaymentRequestURLKey: self.originalURL }];
}

@end
