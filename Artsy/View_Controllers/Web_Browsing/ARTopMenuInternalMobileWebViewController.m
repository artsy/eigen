#import "ARTopMenuInternalMobileWebViewController.h"

#define MAX_AGE 3600 // 1 hour


@interface ARInternalMobileWebViewController (Private) <WKNavigationDelegate>
@end


@interface ARTopMenuInternalMobileWebViewController ()
@property (nonatomic, assign) BOOL hasSuccessfullyLoadedLastRequest;
@property (nonatomic, strong) NSDate *lastRequestLoadedAt;
@end


@implementation ARTopMenuInternalMobileWebViewController

- (void)reload;
{
    [self loadURL:self.webView.URL];
}

// If the currently visible view is the root webview, reload it. This ensures that an existing view hierachy isn't
// thrown out every time the user changes tabs, but that the user also has a way to effectively ‘reload’ a webview.
// This is needed because there could have been a connectivity/server error at the time of loading and also because
// content needs to be refreshable.

- (BOOL)shouldBeReloaded;
{
    return !self.hasSuccessfullyLoadedLastRequest || (self.isCurrentlyVisibleViewController && self.isContentStale);
}

- (BOOL)isCurrentlyVisibleViewController;
{
    return self.navigationController.visibleViewController == self;
}

- (BOOL)isContentStale;
{
    return self.lastRequestLoadedAt.timeIntervalSinceNow < -MAX_AGE;
}

#pragma mark - Overrides

- (instancetype)initWithURL:(NSURL *)URL;
{
    if ((self = [super initWithURL:URL])) {
        _hasSuccessfullyLoadedLastRequest = YES;
    }
    return self;
}

- (void)loadURL:(NSURL *)URL
{
    self.lastRequestLoadedAt = nil;
    [super loadURL:URL];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation;
{
    self.hasSuccessfullyLoadedLastRequest = webView.estimatedProgress == 1;
    if (self.hasSuccessfullyLoadedLastRequest) {
        self.lastRequestLoadedAt = [NSDate date];
    }
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    if ([super respondsToSelector:_cmd]) {
        [super webView:webView didFailNavigation:navigation withError:error];
    }

    self.hasSuccessfullyLoadedLastRequest = NO;
}

@end
