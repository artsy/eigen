#import "ARPersonalizeWebViewController.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"
#import "ARSpinner.h"

//@interface TSMiniWebBrowser (Private)
//@property(nonatomic, readonly, strong) UIWebView *webView;
//@end

@interface ARPersonalizeWebViewController ()
@property (nonatomic, strong, readonly) ARSpinner *spinner;
@end

@implementation ARPersonalizeWebViewController

// @dynamic delegate;

- (void)viewDidLoad
{
    [super viewDidLoad];
    _spinner = [[ARSpinner alloc] init];
    [self.view addSubview:self.spinner];
    [self.spinner alignCenterWithView: self.webView];

    UITapGestureRecognizer *exitTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(exitOnboarding)];
    [self.view addGestureRecognizer:exitTap];
    [self.webView constrainWidthToView:self.view predicate:@"-200"];
    [self.webView constrainHeightToView:self.view predicate:@"-200"];
    [self.webView alignCenterWithView:self.view];
    self.view.backgroundColor = [UIColor clearColor];
}

// - (BOOL)webView:(UIWebView *)aWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
// - (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
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

//- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
//{
    //[self exitOnboarding];
//}

- (void)exitOnboarding
{
    [self.personalizeDelegate webOnboardingDone];
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
