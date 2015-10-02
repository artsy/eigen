#import <JLRoutes/JLRoutes.h>
#import "ARExternalWebBrowserViewController.h"
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>

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

- (instancetype)initWithURL:(NSURL *)url
{
    self = [super init];
    if (!self) {
        return nil;
    }

    // So we can separate init, from view loading
    _initialURL = url;
    self.automaticallyAdjustsScrollViewInsets = NO;

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

    WKWebView *webView = [[WKWebView alloc] initWithFrame:self.view.bounds];
    webView.navigationDelegate = self;
    [self.view addSubview:webView];

    NSURLRequest *initialRequest = [NSURLRequest requestWithURL:self.initialURL];
    [webView loadRequest:initialRequest];

    webView.scrollView.delegate = self;
    webView.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;

    _webView = webView;
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
