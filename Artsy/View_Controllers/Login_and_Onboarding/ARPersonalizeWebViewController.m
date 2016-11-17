#import "ARPersonalizeWebViewController.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"
#import "ARSpinner.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARPersonalizeWebViewController () <WKNavigationDelegate>
@property (nonatomic, strong, readonly) ARSpinner *spinner;
@end


@implementation ARPersonalizeWebViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    _spinner = [[ARSpinner alloc] init];
    [self.view addSubview:self.spinner];
    [self.spinner alignCenterWithView:self.webView];

    UITapGestureRecognizer *exitTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(exitOnboarding)];
    [self.view addGestureRecognizer:exitTap];

    self.view.backgroundColor = [UIColor clearColor];
}

// Override ARExternalWebBrowserViewController's webview contstraints in viewWillLayoutSubviews

- (void)viewWillLayoutSubviews
{
    [self.webView constrainWidthToView:self.view predicate:@"-200"];
    [self.webView constrainHeightToView:self.view predicate:@"-200"];
    [self.webView alignCenterXWithView:self.view predicate:@"0"];
    [self.webView alignCenterYWithView:self.view predicate:@"0"];
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    WKNavigationActionPolicy shouldLoad = [super shouldLoadNavigationAction:navigationAction];
    NSURL *URL = navigationAction.request.URL;
    NSString *path = [URL lastPathComponent];

    if (shouldLoad == WKNavigationActionPolicyAllow && [ARRouter isInternalURL:URL] && [path isEqualToString:ARPersonalizePath]) {
        return WKNavigationActionPolicyAllow;

    } else if ([ARRouter isInternalURL:URL] && [path isEqualToString:@"/"]) {
        // Force onboarding is all push-state.
        // A new request to load the root page indicates that onboarding is complete.

        [self.personalizeDelegate dismissOnboardingWithVoidAnimation:YES];
        return WKNavigationActionPolicyCancel;

    } else {
        return WKNavigationActionPolicyAllow;
    }
}

- (void)showLoading
{
    [self.spinner fadeInAnimated:YES];
}

- (void)hideLoading
{
    [self.spinner fadeOutAnimated:YES];
}

@end
