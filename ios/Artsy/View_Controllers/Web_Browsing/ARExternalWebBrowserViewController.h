#import <WebKit/WebKit.h>


@interface ARExternalWebBrowserViewController : UIViewController <WKNavigationDelegate>

@property (readonly, nonatomic, strong) WKWebView *webView;
@property (readonly, nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, readonly, strong) NSURL *initialURL;
@property (nonatomic, assign) UIStatusBarStyle statusBarStyle;
@property (nonatomic, assign) CGPoint lastTapPoint;

- (instancetype)initWithURL:(NSURL *)url;

- (NSURL *)currentURL;
- (void)loadURL:(NSURL *)URL;
- (void)reload;

// This hook is exposed for subclasses to be able to make decisions as to how to handle the navigation action.
- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
- (WKNavigationResponsePolicy)shouldLoadNavigationResponse:(WKNavigationResponse *)navigationResponse;

@end
