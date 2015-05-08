#import "ARInternalMobileWebViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARRouter.h"
#import "ARInternalShareValidator.h"

//@interface TSMiniWebBrowser (Private)
//@property(nonatomic, readonly, strong) UIWebView *webView;
//- (UIEdgeInsets)webViewContentInset;
//- (UIEdgeInsets)webViewScrollIndicatorsInsets;
//@end

// @interface ARInternalMobileWebViewController() <UIAlertViewDelegate, TSMiniWebBrowserDelegate>
@interface ARInternalMobileWebViewController () <UIAlertViewDelegate>
@property (nonatomic, assign) BOOL loaded;
@property (nonatomic, readonly, strong) ARInternalShareValidator *shareValidator;
@end

@implementation ARInternalMobileWebViewController

- (instancetype)initWithURL:(NSURL *)url
{
    NSString *urlString = url.absoluteString;
    NSString *urlHost = url.host;
    NSString *urlScheme = url.scheme;

    NSURL *correctBaseUrl = [ARRouter baseWebURL];
    NSString *correctHost = correctBaseUrl.host;
    NSString *correctScheme = correctBaseUrl.scheme;

    if ([[ARRouter artsyHosts] containsObject:urlHost]) {
        NSMutableString *mutableUrlString = [urlString mutableCopy];
        if (![urlScheme isEqualToString:correctScheme]){
            [mutableUrlString replaceOccurrencesOfString:urlScheme withString:correctScheme options:NSCaseInsensitiveSearch range:NSMakeRange(0, mutableUrlString.length)];
        }
        if (![url.host isEqualToString:correctBaseUrl.host]) {
            [mutableUrlString replaceOccurrencesOfString:urlHost withString:correctHost options:NSCaseInsensitiveSearch range:NSMakeRange(0, mutableUrlString.length)];
        }
        url = [NSURL URLWithString:mutableUrlString];
    } else if (!urlHost) {
        url = [NSURL URLWithString:urlString relativeToURL:correctBaseUrl];
    }

    if (![urlString isEqualToString:url.absoluteString]) {
        NSLog(@"Rewriting %@ as %@", urlString, url.absoluteString);
    }

    self = [super initWithURL:url];
    if (!self) { return nil; }

    // self.delegate = self;
    // self.showNavigationBar = NO;
    // self.mode = TSMiniWebBrowserModeNavigation;
    // self.showToolBar = NO;
//    self.backgroundColor = [UIColor whiteColor];
//    self.opaque = NO;
    _shareValidator = [[ARInternalShareValidator alloc] init];

    ARInfoLog(@"Initialized with URL %@", url);
    return self;
}

- (void)loadURL:(NSURL *)URL
{
    self.loaded = NO;
    [self showLoading];
    [super loadURL:URL];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    // As we initially show the loading, we don't want this to appear when you do a back or when a modal covers this view.
    if (!self.loaded) {
        [self showLoading];
    }
}

- (void)showLoading
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)viewDidAppear:(BOOL)animated
{
    //[UIView animateWithDuration:ARAnimationDuration animations:^{
         //self.scrollView.contentInset = [self webViewContentInset];
         //self.scrollView.scrollIndicatorInsets = [self webViewScrollIndicatorsInsets];
    //}];

    [super viewDidAppear:animated];
}
//
//- (void)webViewDidFinishLoad:(UIWebView *)aWebView
//{
//    [super webViewDidFinishLoad:aWebView];
//    [self hideLoading];
//    self.loaded = YES;
//}

- (void)hideLoading
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

// Load a new internal web VC for each link we can do

// - (BOOL)webView:(UIWebView *)aWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
// - (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    NSURL *URL = navigationAction.request.URL;
    ARInfoLog(@"Martsy URL %@", URL);

    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        if ([self.shareValidator isSocialSharingURL:URL]) {
            [self.shareValidator shareURL:URL inView:self.view];
            return WKNavigationActionPolicyCancel;
        } else {

            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL fair:self.fair];
            if (viewController) {
                [self.navigationController pushViewController:viewController animated:YES];
                return WKNavigationActionPolicyCancel;
            }
        }

    } else if ([ARRouter isInternalURL:URL] && ([URL.path isEqual:@"/log_in"] || [URL.path isEqual:@"/sign_up"])) {
        // hijack AJAX requests
        if ([User isTrialUser]) {
            [ARTrialController presentTrialWithContext:ARTrialContextNotTrial fromTarget:self selector:@selector(userDidSignUp)];
        }
        return WKNavigationActionPolicyCancel;
    }

    return WKNavigationActionPolicyAllow;
}

// A full reload, not just a webView.reload, which only refreshes the view without re-requesting data.

- (void)userDidSignUp
{
    [self.webView loadRequest:[self requestWithURL:self.webView.URL]];
}

- (NSURLRequest *)requestWithURL:(NSURL *)url
{
    return [ARRouter requestForURL:url];
}

#pragma mark - UIScrollViewDelegate

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
{
    return nil;
}

@end
