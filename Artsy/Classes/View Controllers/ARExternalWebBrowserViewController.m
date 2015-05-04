#import "ARExternalWebBrowserViewController.h"
#import <JLRoutes/JLRoutes.h>

@interface TSMiniWebBrowser (Private)
@property(nonatomic, readonly, strong) UIWebView *webView;
@end

@interface ARExternalWebBrowserViewController()<UIGestureRecognizerDelegate>
@property(nonatomic, readonly, strong) UIGestureRecognizer *gesture;
@end

@implementation ARExternalWebBrowserViewController

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }

    self.showNavigationBar = NO;
    return self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    self.webView.frame = self.view.bounds;
     self.scrollView.delegate = self;
     self.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;

    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    if ([self.navigationController isKindOfClass:[ARNavigationController class]]) {
        UIGestureRecognizer *gesture = self.navigationController.interactivePopGestureRecognizer;

        [ self.scrollView.panGestureRecognizer requireGestureRecognizerToFail:gesture];
        _gesture = gesture;
    }
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.gesture.delegate = nil;
    [super viewWillDisappear:animated];
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}

#pragma mark - Properties

- (UIScrollView *)scrollView
{
    return  self.webView.scrollView;
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

#pragma mark UIWebViewDelegate

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    if (navigationType == UIWebViewNavigationTypeLinkClicked) {
        if ([JLRoutes canRouteURL:request.URL]) {
            [JLRoutes routeURL:request.URL];
            return NO;
        }
    }

    return YES;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.currentURL) {
        return @{ @"url" : self.currentURL.absoluteString, @"type" : @"url" };
    }

    return nil;
}

// UIWebViews sometimes cause a memory leak if they are in the middle of loading somethign when they are deallocated.
// This memory leak caused failures in unrelated tests and could easily happen in production as well. This `dealloc` helps.
// See http://www.codercowboy.com/code-uiwebview-memory-leak-prevention/.

- (void)dealloc
{
    [self.webView loadHTMLString:@"" baseURL:nil];
    [self.webView stopLoading];
    self.webView.delegate = nil;
    [self.webView removeFromSuperview];
}

@end
