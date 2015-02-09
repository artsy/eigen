#import "ARPersonalizeWebViewController.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"
#import "ARSpinner.h"

@interface TSMiniWebBrowser (Private)
@property(nonatomic, readonly, strong) UIWebView *webView;
@end

@interface ARPersonalizeWebViewController ()
@property (nonatomic, strong, readonly) ARSpinner *spinner;
@end

@implementation ARPersonalizeWebViewController

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

- (BOOL)webView:(UIWebView *)aWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    BOOL shouldLoad = [super webView:aWebView shouldStartLoadWithRequest:request navigationType:navigationType];
    NSString *path = [request.URL lastPathComponent];
    
    if (shouldLoad && [ARRouter isInternalURL:request.URL] && [path isEqualToString:ARPersonalizePath]) {
        return YES;
    } else {

        // Force onboarding is all push-state. A new request to load a page indicates that onboarding is complete.
        [self.delegate dismissOnboardingWithVoidAnimation:YES];
        return NO;
    }
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    [self exitOnboarding];
}

- (void)exitOnboarding
{
    [self.delegate webOnboardingDone];
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
