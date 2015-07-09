#import "ARExternalWebBrowserViewController.h"


@interface ARInternalMobileWebViewController : ARExternalWebBrowserViewController <UIScrollViewDelegate>

@property (nonatomic, strong) Fair *fair;

/// A hook that will be called when the webview has loaded the DOM, but not yet all other assets. So textual content
/// wise the view should be ready to present.
///
/// This corresponds to the `DOMContentLoaded` event.
///
- (void)webViewDidLoadDOMContent:(UIWebView *)webView;

@end
