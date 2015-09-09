#import "ARPersonalizeWebViewController.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"
#import "ARSpinner.h"


@interface ARPersonalizeWebViewController ()
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
    [self setupConstraints];
}

// Override ARExternalWebBrowserViewController's webview setup

- (void)setupConstraints
{
    [self.webView removeConstraints:self.webView.constraints];

    [self.webView constrainWidthToView:self.view predicate:@"-200"];
    [self.webView constrainHeightToView:self.view predicate:@"-200"];
    [self.webView alignCenterWithView:self.view];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    decisionHandler([self shouldLoadNavigationAction:navigationAction]);
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

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    [self exitOnboarding];
}

- (void)exitOnboarding
{
    [self.personalizeDelegate didSignUpAndLogin];
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
