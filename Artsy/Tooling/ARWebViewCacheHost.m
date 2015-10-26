#import "ARWebViewCacheHost.h"
#import <WebKit/WebKit.h>
#import "ARRouter.h"


@interface ARWebViewCacheHost ()
@property (nonatomic, strong, nonnull) WKProcessPool *processPool;
@property (nonatomic, copy, nonnull) NSMutableArray<WKWebView *> *webViews;
@end


@implementation ARWebViewCacheHost

/// This class exposes an API that hides the behind the scene singleton-ness.

+ (instancetype)sharedInstance
{
    static ARWebViewCacheHost *sharedInstance;

    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ARWebViewCacheHost alloc] init];

        // Wait one second, then start pre-caching if no
        // webviews have already been generated

        ar_dispatch_after(1, ^{
            if (sharedInstance.webViews.count == 0) {
                [sharedInstance startPrecache];
            }
        });

    });

    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _processPool = [[WKProcessPool alloc] init];

    return self;
}

- (NSURLRequest *)requestForBlankPage
{
    return [ARRouter newRequestForBlankPage];
}

- (WKWebView *)spawnWebview
{
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    config.processPool = [ARWebViewCacheHost sharedInstance].processPool;

    CGRect deviceBounds = [UIScreen mainScreen].bounds;
    WKWebView *webView = [[WKWebView alloc] initWithFrame:deviceBounds configuration:config];

    return webView;
}

- (void)startPrecache
{
    ARWebViewCacheHost *shared = [ARWebViewCacheHost sharedInstance];

    [shared addNewWebViewToCache];
    [shared addNewWebViewToCache];
    [shared addNewWebViewToCache];
}

- (void)addNewWebViewToCache
{
    ARWebViewCacheHost *shared = [ARWebViewCacheHost sharedInstance];
    WKWebView *webview = [shared spawnWebview];
    [webview loadRequest:shared.requestForBlankPage];
    [shared.webViews addObject:webview];
}

- (WKWebView *)dequeueWebVewWithURL:(NSURL *)url
{
    ARWebViewCacheHost *shared = [ARWebViewCacheHost sharedInstance];

    if (shared.webViews.count == 0) {
        [shared startPrecache];
        return [shared spawnWebview];
    }

    WKWebView *foundWebview = [shared.webViews detect:^BOOL(WKWebView *webview) {
        return [webview.URL isEqual: url];
    }];

    if (foundWebview) {
        [shared.webViews removeObject:foundWebview];
        [shared addNewWebViewToCache];
        return foundWebview;
    }

    WKWebView *first = shared.webViews.firstObject;
    if (!first) {
        NSLog(@"Could not find a webview, returning new uncached webview");
        return [shared spawnWebview];
    }

    return first;
}

@end
