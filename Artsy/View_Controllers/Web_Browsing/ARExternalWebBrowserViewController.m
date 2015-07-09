#import "ARExternalWebBrowserViewController.h"
#import <JLRoutes/JLRoutes.h>

//@interface TSMiniWebBrowser (Private)
//@property(nonatomic, readonly, strong) UIWebView *webView;
//@end

@interface ARExternalWebBrowserViewController () <UIGestureRecognizerDelegate>
@property(nonatomic, readonly, strong) UIGestureRecognizer *gesture;
@end

@implementation ARExternalWebBrowserViewController

- (void)loadURL:(NSURL *)URL;
{
    [self.webView loadRequest:[NSURLRequest requestWithURL:URL]];
}

//- (instancetype)initWithURL:(NSURL *)url
//{
    //self = [super initWithURL:url];
    //if (!self) { return nil; }

    //self.showNavigationBar = NO;
    //return self;
//}

- (void)viewDidLoad
{
    [super viewDidLoad];

    // self.scrollView.delegate = self;
    self.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;
}

//- (void)viewWillAppear:(BOOL)animated
//{
    //[super viewWillAppear:animated];

    //self.webView.frame = self.view.bounds;

    //[[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
//}

//- (void)viewDidAppear:(BOOL)animated
//{
    //[super viewDidAppear:animated];

    //if ([self.navigationController isKindOfClass:[ARNavigationController class]]) {
        //UIGestureRecognizer *gesture = self.navigationController.interactivePopGestureRecognizer;

        //[ self.scrollView.panGestureRecognizer requireGestureRecognizerToFail:gesture];
        //_gesture = gesture;
    //}
//}

//- (void)viewWillDisappear:(BOOL)animated
//{
    //self.gesture.delegate = nil;
    //[super viewWillDisappear:animated];
    //[[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
//}

#pragma mark - Properties

- (UIScrollView *)scrollView
{
    return  self.webView.scrollView;
}

#pragma mark UIScrollViewDelegate

//- (void)scrollViewDidScroll:(UIScrollView *)scrollView
//{
    //[[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
//}

#pragma mark UIGestureRecognizerDelegate

//- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
//{
    //return YES;
//}

#pragma mark UIWebViewDelegate

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

// - (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
{
    decisionHandler([self shouldLoadNavigationAction:navigationAction]);
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.webView.URL) {
        return @{ @"url" : self.webView.URL.absoluteString, @"type" : @"url" };
    }

    return nil;
}

@end
