#import "ARWebViewCacheHost.h"

#import "ARRouter.h"
#import "ARDispatchManager.h"
#import "ARAppConstants.h"
#import "ARAppStatus.h"

#import <WebKit/WebKit.h>

@interface ARWebViewCacheHost () <WKNavigationDelegate>
@property (nonatomic, strong, nonnull) WKProcessPool *processPool;
@property (nonatomic, strong, nonnull) NSMutableArray<WKWebView *> *webViews;
@end


@implementation ARWebViewCacheHost

+ (void)startup
{
    [self sharedInstance];
}

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
            if (ARPerformWorkAsynchronously && sharedInstance.webViews.count == 0) {
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
    _webViews = [NSMutableArray array];

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

    // Make inline video playback work.
    config.allowsInlineMediaPlayback = YES;
    config.mediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypeNone;

    // Allow hooking up to the web inspector
    if(ARAppStatus.isBetaDevOrAdmin) {
        [config.preferences setValue:@YES forKey:@"developerExtrasEnabled"];
    }
    CGRect deviceBounds = [UIScreen mainScreen].bounds;
    WKWebView *webView = [[WKWebView alloc] initWithFrame:deviceBounds configuration:config];
    webView.navigationDelegate = self;

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

- (WKWebView *)dequeueWebView
{
    ARWebViewCacheHost *shared = [ARWebViewCacheHost sharedInstance];

    if (shared.webViews.count == 0) {
        // Add three to the cache
        [shared startPrecache];
    }

    WKWebView *first = shared.webViews.firstObject;
    [shared.webViews removeObject:first];
    [shared addNewWebViewToCache];
    return first;
}

@end
