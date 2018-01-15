#import "ARExternalWebBrowserViewController.h"
#import "ARScrollNavigationChief.h"
#import "ARWebViewCacheHost.h"


@interface ARExternalWebBrowserViewController (Tests) <UIScrollViewDelegate>
@property (readonly, nonatomic, strong) UIWebView *webView;
@end

SpecBegin(ARExternalWebBrowserViewController);

__block ARExternalWebBrowserViewController *vc;

beforeEach(^{
    vc = [[ARExternalWebBrowserViewController alloc] initWithURL:[NSURL URLWithString:@""]];
});

afterEach(^{
    vc = nil;
});

it(@"sets the scroll view's `delegate` if it belongs to ARNavigationController", ^{
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    ARNavigationController *nav =[[ARNavigationController alloc] initWithRootViewController:vc];
    expect(vc.scrollView.delegate).to.equal(vc);
});

it(@"does not set the scroll view's `delegate` if it does not belong to ARNavigationController", ^{
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    expect(vc.scrollView.delegate).to.equal(nil);
});

it(@"forwards its web view's scroll view", ^{
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    expect(vc.scrollView).to.equal(vc.webView.scrollView);
});

it(@"uses the shared ARWebViewCacheHost WKWebView instances", ^{
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];

    ARWebViewCacheHost *webviewCache = [[ARWebViewCacheHost alloc] init];
    WKWebView *webView = [webviewCache dequeueWebView];
    [webView stopLoading];

    expect(vc.webView.configuration.processPool).to.equal(webView.configuration.processPool);
});

SpecEnd;
