#import "ARExternalWebBrowserViewController.h"
#import "ARWebViewCacheHost.h"
#import "ARSwitchBoard.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARLogger.h"
#import "ARExternalWebBrowserViewController.h"

#import "ARNavigationController.h"
#import "ARScrollNavigationChief.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <JLRoutes/JLRoutes.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import "ARDispatchManager.h"

#import <CoreServices/CoreServices.h>

@interface ARExternalWebBrowserViewController () <UIGestureRecognizerDelegate, UIScrollViewDelegate>
@property (nonatomic, readonly, strong) UIGestureRecognizer *gesture;
@end


@implementation ARExternalWebBrowserViewController


- (void)dealloc
{
    self.webView.navigationDelegate = nil;
    self.webView.scrollView.delegate = nil;
}

- (instancetype)initWithURL:(NSURL *)url
{
    self = [super init];
    if (!self) {
        return nil;
    }

    // So we can separate init, from view loading
    _initialURL = url;
    self.automaticallyAdjustsScrollViewInsets = NO;
    _statusBarStyle = UIStatusBarStyleDefault;

    return self;
}

- (void)loadURL:(NSURL *)URL;
{
    [self.webView loadRequest:[NSURLRequest requestWithURL:URL]];
}

- (void)reload;
{
    [self loadURL:self.currentURL];
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARWebViewCacheHost *webviewCache = [[ARWebViewCacheHost alloc] init];
    WKWebView *webView = [webviewCache dequeueWebView];

    webView.frame = self.view.bounds;
    webView.navigationDelegate = self;
    [self.view addSubview:webView];

    NSURLRequest *initialRequest = [NSURLRequest requestWithURL:self.initialURL];
    [webView loadRequest:initialRequest];

    UIScrollView *scrollView = webView.scrollView;
    scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;

    // Work around bug in WKScrollView by setting private ivar directly: http://trac.webkit.org/changeset/188541
    // This is fixed in iOS 10, but iOS 9 still needs the fix.
    if ([[NSProcessInfo processInfo] isOperatingSystemAtLeastVersion:(NSOperatingSystemVersion){9, 0, 0}] &&
        ![[NSProcessInfo processInfo] isOperatingSystemAtLeastVersion:(NSOperatingSystemVersion){10, 0, 0}]) {
#ifndef DEBUG
        @try {
#endif
            NSString *factorKey = [NSString stringWithFormat:@"%@%@ollDecelerationFactor", @"_pre", @"ferredScr"];
            [scrollView setValue:@(UIScrollViewDecelerationRateNormal) forKey:factorKey];
#ifndef DEBUG
        }
        @catch (NSException *exception) {
            ARErrorLog(@"Unable to apply workaround for WebKit bug: %@", exception);
        }
#endif
    }

    _webView = webView;
}

- (void)willMoveToParentViewController:(UIViewController *)parent;
{
    [super willMoveToParentViewController:parent];
    self.scrollView.delegate = [parent isKindOfClass:ARNavigationController.class] ? self : nil;
}


- (UIStatusBarStyle)preferredStatusBarStyle
{
    return self.statusBarStyle;
}

- (void)viewWillLayoutSubviews
{
    [self.webView constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];
    [self.webView alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.webView alignBottomEdgeWithView:self.view predicate:@"0"];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    if ([self.navigationController isKindOfClass:ARNavigationController.class]) {
        UIGestureRecognizer *gesture = self.navigationController.interactivePopGestureRecognizer;

        [self.scrollView.panGestureRecognizer requireGestureRecognizerToFail:gesture];
        _gesture = gesture;
    }
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.gesture.delegate = nil;
    [super viewWillDisappear:animated];
}

#pragma mark - Properties

- (UIScrollView *)scrollView
{
    return self.webView.scrollView;
}

#pragma mark UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    if ([self.navigationController isKindOfClass:ARNavigationController.class]) {
        [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    }
}

#pragma mark UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    return YES;
}

#pragma mark WKWebViewDelegate

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
{
    decisionHandler([self shouldLoadNavigationAction:navigationAction]);
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        NSURL *URL = navigationAction.request.URL;
        ARSwitchBoard *switchboard = ARSwitchBoard.sharedInstance;
        if ([switchboard canRouteURL:URL]) {
            UIViewController *controller = [switchboard loadURL:URL ];
            if (controller) {
                [switchboard presentViewController:controller];
            }
            return WKNavigationActionPolicyCancel;
        }
    }
    return WKNavigationActionPolicyAllow;
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler;
{
    decisionHandler([self shouldLoadNavigationResponse:navigationResponse]);
}

- (WKNavigationResponsePolicy)shouldLoadNavigationResponse:(WKNavigationResponse *)navigationResponse;
{
    if ([navigationResponse.response isKindOfClass:NSHTTPURLResponse.class]) {
        NSHTTPURLResponse *response = (id)navigationResponse.response;
        if (![navigationResponse canShowMIMEType]) {
            ARSwitchBoard *switchboard = ARSwitchBoard.sharedInstance;
            [switchboard openURLInExternalService:response.URL];

            // Go back to whatever page you're on, because otherwise you just have a white screen
            ar_dispatch_after(0.5, ^{
                [self.navigationController popViewControllerAnimated:YES];
            });
            
            return WKNavigationResponsePolicyCancel;
        }
    }

    return WKNavigationResponsePolicyAllow;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.currentURL) {
        return @{ @"url" : self.currentURL.absoluteString,
                  @"type" : @"url" };
    }

    return nil;
}

- (NSURL *)currentURL
{
    return self.webView.URL ?: self.initialURL;
}

@end
