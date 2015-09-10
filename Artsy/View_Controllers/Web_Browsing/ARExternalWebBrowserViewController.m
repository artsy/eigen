@import JLRoutes;
#import "ARExternalWebBrowserViewController.h"


@interface ARExternalWebBrowserViewController () <UIGestureRecognizerDelegate, UIScrollViewDelegate>
@property (nonatomic, readonly, strong) UIGestureRecognizer *gesture;
@property (nonatomic, readonly, strong) NSURL *initialURL;
@end


@implementation ARExternalWebBrowserViewController


- (void)dealloc
{
    self.webView.navigationDelegate = nil;
    self.webView.scrollView.delegate = nil;
}

- (void)loadURL:(NSURL *)URL;
{
    [self.webView loadRequest:[NSURLRequest requestWithURL:URL]];
}

- (instancetype)initWithURL:(NSURL *)url
{
    self = [super init];
    if (!self) {
        return nil;
    }

    // So we can separate init, from view loading
    _initialURL = url;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    WKWebView *webView = [[WKWebView alloc] initWithFrame:self.view.bounds];
    webView.navigationDelegate = self;
    [self.view addSubview:webView];

    NSURLRequest *initialRequest = [NSURLRequest requestWithURL:self.initialURL];
    [webView loadRequest:initialRequest];

    webView.scrollView.delegate = self;
    webView.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;

    _webView = webView;

#ifndef STORE
    UILongPressGestureRecognizer *adminGesture;
    adminGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(showAdminDetails:)];
    [self.view addGestureRecognizer:adminGesture];
}

- (void)showAdminDetails:(UILongPressGestureRecognizer *)gesture
{
    gesture.enabled = NO;
    UITextView *textView = [[UITextView alloc] init];
    textView.font = [UIFont fontWithName:@"Courier" size:14];
    textView.backgroundColor = [UIColor colorWithWhite:0.9 alpha:1];
    [self.view addSubview:textView];
    [textView alignLeading:@"0" trailing:@"0" toView:self.view];
    [textView alignBottomEdgeWithView:self.view predicate:@"0"];
    [textView constrainHeightToView:self.view predicate:@"*.5"];

#warning BRING BACK INTROSPECTION

//    NSMutableString *details = [[NSMutableString alloc] initWithString:@"## Web View Details \n\n"];
//    if (self.webView.request.URL.absoluteString.length) {
//        [details appendFormat:@"Requested: %@ \n", self.webView.request.URL];
//    }
//
//    NSString *currentAddress = [self.webView stringByEvaluatingJavaScriptFromString:@"document.location.href"];
//    if (![currentAddress isEqualToString:self.webView.request.URL.absoluteString]) {
//        [details appendFormat:@"Current URL: %@ \n", currentAddress];
//    }
//
//    [details appendFormat:@"\n"];
//
//    NSString *userName = [self.webView stringByEvaluatingJavaScriptFromString:@"sd.CURRENT_USER.name"];
//    if (userName.length) {
//        [details appendFormat:@"User: %@ \n", userName];
//    } else {
//        [details appendString:@"User: Not logged in \n"];
//    }
//
//    NSString *userAgent = [self.webView stringByEvaluatingJavaScriptFromString:@"window.clientInformation.userAgent"];
//    [details appendFormat:@"User agent: %@ \n", userAgent];
//
//    NSString *webSession = [self.webView stringByEvaluatingJavaScriptFromString:@"sd.SESSION_ID"];
//    [details appendFormat:@"Web Session: %@ \n", webSession];
//
//
//    textView.text = details;
#endif
}

- (void)viewWillLayoutSubviews
{
    [self.webView constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];
    [self.webView alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.webView alignBottomEdgeWithView:self.view predicate:@"0"];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
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
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
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
        if ([JLRoutes canRouteURL:URL]) {
            [JLRoutes routeURL:URL];
            return WKNavigationActionPolicyCancel;
        }
    }
    return WKNavigationActionPolicyAllow;
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
