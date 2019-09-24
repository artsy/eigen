#import "ARAppConstants.h"
#import "ARLogger.h"
#import "ARInternalMobileWebViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARRouter.h"
#import "ARInternalShareValidator.h"
#import "ARAppDelegate.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"
#import "AROptions.h"

static void *ARProgressContext = &ARProgressContext;

@interface ARInternalMobileWebViewController () <WKNavigationDelegate>
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

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self.webView stopLoading];
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
    [self showLoading];
    
    // KVO on progress for when we can show the page
    [self.webView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew & NSKeyValueObservingOptionOld context:ARProgressContext];
    
    if ([AROptions boolForOption:AROptionsShowMartsyOnScreen]) {
        [self displayDebugMartsyIndicator];
    }
}

- (void)displayDebugMartsyIndicator {
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake(self.view.frame.size.width - 25, 30, 10, 10)]; // nice and oldschool
    view.layer.cornerRadius = 5;
    view.layer.masksToBounds = YES;
    view.backgroundColor = [UIColor redColor];
    [self.view insertSubview:view aboveSubview:self.webView];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    if (!self.loaded) {
        [self.webView loadRequest:[self requestWithURL:self.currentURL]];
    }
}

- (void)dealloc
{
    [self.webView removeObserver:self forKeyPath:@"estimatedProgress" context:ARProgressContext];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    // Check if the view has reached the DOMContentLoaded stage.
    if (context == ARProgressContext && [keyPath isEqualToString:@"estimatedProgress"]) {
        [self.webView evaluateJavaScript:@"document.readyState == \"interactive\"" completionHandler:^(id response, NSError *error) {
            if ([response boolValue]) {
                [self hideLoading];
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
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation;
{
    /// If we do this initially there's a chance of seeing a black screen
    /// instead of our default white
    self.webView.scrollView.backgroundColor = [UIColor whiteColor];

    self.loaded = YES;

    // There are certain edge-cases, not fully known atm, that make it so that the DOMContentLoaded hook isn’t
    // triggered. Therefore, hide the loading view here for good measure.
    [self hideLoading];
}

// Load a new internal web VC for each link we can do

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    NSURL *URL = navigationAction.request.URL;

    // If we really have to hijack regardless do it first.
    // This is to take into account AJAX requests which are not
    // strictly classed as a WKNavigationTypeLinkActivated
    // as the user may not have _directly_ loaded it

    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        if ([self.shareValidator isSocialSharingURL:URL]) {
            ARWindow *window = ARAppDelegate.sharedInstance.window;
            CGPoint lastTouchPointInView = [window convertPoint:window.lastTouchPoint toView:self.view];
            CGRect position = (CGRect){.origin = lastTouchPointInView, .size = CGSizeZero};
            [self.shareValidator shareURL:URL inView:self.view frame:position];

            ARActionLog(@"Artsy URL: Denied - %@ - %@", URL, @(navigationAction.navigationType));
            return WKNavigationActionPolicyCancel;

        } else {
            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL fair:self.fair];
            if (viewController) {
                [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
            }

            ARActionLog(@"Artsy URL: Denied - %@ - %@", URL, @(navigationAction.navigationType));
            return WKNavigationActionPolicyCancel;
        }
    }

    ARActionLog(@"Artsy URL: Allowed - %@ - %@", URL, @(navigationAction.navigationType));
    return WKNavigationActionPolicyAllow;
}

// A full reload, not just a webView.reload, which only refreshes the view without re-requesting data.

- (NSURLRequest *)requestWithURL:(NSURL *)URL
{
    return [ARRouter requestForURL:URL];
}

@end
