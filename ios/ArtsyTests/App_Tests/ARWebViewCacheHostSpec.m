#import "ARWebViewCacheHost.h"
#import <WebKit/WebKit.h>

SpecBegin(ARWebViewCacheHost);

__block ARWebViewCacheHost *sut;

it(@"it generates the same cache configuration objects on webviews", ^{
    sut = [[ARWebViewCacheHost alloc] init];

    WKWebView *webView = [sut dequeueWebView];
    [webView stopLoading];

    WKWebView *webView2 = [sut dequeueWebView];
    [webView2 stopLoading];

    expect(webView.configuration.processPool).to.equal(webView2.configuration.processPool);
});

it(@"it generates a webviews that is already requesting a blank url", ^{
    sut = [[ARWebViewCacheHost alloc] init];

    WKWebView *webView = [sut dequeueWebView];
    NSURL *url = webView.backForwardList.currentItem.URL;
    [webView stopLoading];

    // HACK!

    // OK, so if you're offline, the WKWebView halts the web loading process
    // and there's no way to get to the URL that was originally requested (via the
    // webview) so, _this test only works when online_ - which is true for CI

    // So, we only do the test if the url is not nil
    if (url) {
        expect(url.path).to.equal(@"/dev/blank");
    }
});

it(@"it autoplays HTML5 content (used in super-posts)", ^{
    sut = [[ARWebViewCacheHost alloc] init];

    WKWebView *webView = [sut dequeueWebView];
    [webView stopLoading];

    expect(webView.configuration.mediaTypesRequiringUserActionForPlayback).to.equal(WKAudiovisualMediaTypeNone);
});

SpecEnd
