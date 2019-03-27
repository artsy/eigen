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
    __unused ARNavigationController *nav = [[ARNavigationController alloc] initWithRootViewController:vc];
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

it(@"allows showing pages that a webview says it can show", ^{
    OCMockObject *mock = [OCMockObject niceMockForClass:WKNavigationResponse.class];

    NSURL *urlToRoute = [NSURL URLWithString:@"https://url.com/thing.pdf"];
    NSHTTPURLResponse *fakedResponse = [[NSHTTPURLResponse alloc] initWithURL:urlToRoute statusCode:200 HTTPVersion:@"HTTP/1.1" headerFields:@{}];
    [[[mock stub] andReturn: fakedResponse] response];

    // This should show, so it should do nothing
    [[[mock stub] andReturnValue:@YES] canShowMIMEType];

    expect([vc shouldLoadNavigationResponse: (id)mock]).to.equal(WKNavigationResponsePolicyAllow);
});


it(@"handles showing an alert punting a user to safari if we can't show something in a webview", ^{
    OCMockObject *mock = [OCMockObject niceMockForClass:WKNavigationResponse.class];

    NSURL *urlToRoute = [NSURL URLWithString:@"https://url.com/thing.pdf"];
    NSHTTPURLResponse *fakedResponse = [[NSHTTPURLResponse alloc] initWithURL:urlToRoute statusCode:200 HTTPVersion:@"HTTP/1.1" headerFields:@{}];
    [[[mock stub] andReturn: fakedResponse] response];

    [[[mock stub] andReturnValue:@NO] canShowMIMEType];

    id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
    // Validate that we call ARSwitchBoard's load extenal URL
    [[switchboardMock expect] openURLInExternalService:[OCMArg checkWithBlock:^BOOL(id obj) {
        return [obj isEqual:urlToRoute];
    }]];
});


SpecEnd;
