#import "ARInternalMobileWebViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARRouter.h"
#import "ARInternalShareValidator.h"

@interface TSMiniWebBrowser (Private)
@property(nonatomic, readonly, strong) UIWebView *webView;
- (UIEdgeInsets)webViewContentInset;
- (UIEdgeInsets)webViewScrollIndicatorsInsets;
@end

@interface ARInternalMobileWebViewController() <UIAlertViewDelegate, TSMiniWebBrowserDelegate>
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

    self.delegate = self;
    self.showNavigationBar = NO;
    self.mode = TSMiniWebBrowserModeNavigation;
    self.showToolBar = NO;
    self.backgroundColor = [UIColor whiteColor];
    self.opaque = NO;
    _shareValidator = [[ARInternalShareValidator alloc] init];

    ARInfoLog(@"Initialized with URL %@", url);
    return self;
}

- (void)loadURL:(NSURL *)url
{
    self.loaded = NO;
    [self showLoading];
    [super loadURL:url];
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
    [UIView animateWithDuration:ARAnimationDuration animations:^{
        self.webView.scrollView.contentInset = [self webViewContentInset];
        self.webView.scrollView.scrollIndicatorInsets = [self webViewScrollIndicatorsInsets];
    }];

    [super viewDidAppear:animated];
}

- (void)webViewDidFinishLoad:(UIWebView *)aWebView
{
    [super webViewDidFinishLoad:aWebView];
    [self hideLoading];
    _loaded = YES;
}

- (void)hideLoading
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

// Load a new internal web VC for each link we can do

- (BOOL)webView:(UIWebView *)aWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    ARInfoLog(@"Martsy URL %@", request.URL);

    if (navigationType == UIWebViewNavigationTypeLinkClicked) {
        if ([self.shareValidator isSocialSharingURL:request.URL]) {
            [self.shareValidator shareURL:request.URL inView:self.view];
            return NO;
        } else {

            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:request.URL fair:self.fair];
            if (viewController) {
                [self.navigationController pushViewController:viewController animated:YES];
                return NO;
            }
        }

    } else if ([ARRouter isInternalURL:request.URL] && ([request.URL.path isEqual:@"/log_in"] || [request.URL.path isEqual:@"/sign_up"])) {
        // hijack AJAX requests
        if ([User isTrialUser]) {
            [ARTrialController presentTrialWithContext:ARTrialContextNotTrial fromTarget:self selector:@selector(reload)];
        }
        return NO;
    }

    return YES;
}

// A full reload, not just a webView.reload, which only refreshes the view without re-requesting data.

- (void)reload
{
    [self.webView loadRequest:[self requestWithURL:self.currentURL]];
}

- (NSURLRequest *)requestWithURL:(NSURL *)url
{
    return [ARRouter requestForURL:url];
}


@end
