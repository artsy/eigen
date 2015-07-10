@import WebKit;


@interface ARExternalWebBrowserViewController : UIViewController

@property (readonly, nonatomic, strong) WKWebView *webView;
@property (readonly, nonatomic, strong) UIScrollView *scrollView;

- (instancetype)initWithURL:(NSURL *)url;

- (NSURL *)currentURL;
- (void)loadURL:(NSURL *)URL;

// Private
- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;

@end
