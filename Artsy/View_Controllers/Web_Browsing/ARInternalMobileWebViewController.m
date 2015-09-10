#import "ARInternalMobileWebViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARRouter.h"
#import "ARInternalShareValidator.h"
#import "ARAppDelegate.h"

static void *ARProgressContext = &ARProgressContext;


@interface ARInternalMobileWebViewController () <UIAlertViewDelegate, WKNavigationDelegate>
@property (nonatomic, assign) BOOL loaded;
@property (nonatomic, strong) ARInternalShareValidator *shareValidator;
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
        if (![urlScheme isEqualToString:correctScheme]) {
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
    if (!self) {
        return nil;
    }

    _shareValidator = [[ARInternalShareValidator alloc] init];

    ARActionLog(@"InternalWebVC init with URL %@", url);
    return self;
}

- (void)loadURL:(NSURL *)URL
{
    self.loaded = NO;
    [self showLoading];
    [super loadURL:URL];
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    // KVO on progress for when we can show the page
    [self.webView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew & NSKeyValueObservingOptionOld context:ARProgressContext];
}

- (void)dealloc
{
    [self.webView removeObserver:self forKeyPath:@"estimatedProgress" context:ARProgressContext];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (context == ARProgressContext && [keyPath isEqualToString:@"estimatedProgress"]) {
        [self.webView evaluateJavaScript:@"document.readyState == \"interactive\"" completionHandler:^(id response, NSError *error) {
            if ([response respondsToSelector:@selector(boolValue)]) {
                if (self.loaded == NO && [response boolValue] == YES) {
                    [self hideLoading];
                }
            }
        }];
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)showLoading
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)hideLoading
{
    self.loaded = YES;
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

// Load a new internal web VC for each link we can do

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
{
    decisionHandler([self shouldLoadNavigationAction:navigationAction]);
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    NSURL *URL = navigationAction.request.URL;

    // If we really have to hijack regardless do it first.
    // This is to take into account AJAX requests which are not
    // strictly classed as a WKNavigationTypeLinkActivated
    // as the user may not have _directly_ loaded it

    BOOL urlIsLoginOrSignUp = [URL.path isEqual:@"/log_in"] || [URL.path isEqual:@"/sign_up"];
    if ([ARRouter isInternalURL:URL] && (urlIsLoginOrSignUp)) {
        if ([User isTrialUser]) {
            [ARTrialController presentTrialWithContext:ARTrialContextNotTrial success:^(BOOL newUser) {
                [self userDidSignUp];
            }];
        }
        return WKNavigationActionPolicyCancel;
    }

    // WKWebKit sends us this shouldLoad twice, we only
    // care if it's not an Other ( which seems to maybe be the main frame
    // actually loading after it has a response. )

    if (navigationAction.navigationType == WKNavigationTypeOther) {
        return WKNavigationActionPolicyAllow;
    }

    NSLog(@"Martsy URL %@ - %@", URL, @(navigationAction.navigationType));

    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        if ([self.shareValidator isSocialSharingURL:URL]) {
            ARWindow *window = ARAppDelegate.sharedInstance.window;
            CGPoint lastTouchPointInView = [window convertPoint:window.lastTouchPoint toView:self.view];
            CGRect position = (CGRect){.origin = lastTouchPointInView, .size = CGSizeZero};
            [self.shareValidator shareURL:URL inView:self.view frame:position];

            return WKNavigationActionPolicyCancel;

        } else {
            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL fair:self.fair];
            if (viewController && ![self.navigationController.viewControllers containsObject:viewController]) {
                [self.navigationController pushViewController:viewController animated:YES];
            }
            return WKNavigationActionPolicyCancel;
        }
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
