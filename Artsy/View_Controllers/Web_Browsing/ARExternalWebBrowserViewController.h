#import <WebKit/WebKit.h>;


@interface ARExternalWebBrowserViewController : UIViewController <WKNavigationDelegate>

@property (readonly, nonatomic, strong) WKWebView *webView;
@property (readonly, nonatomic, strong) UIScrollView *scrollView;

- (instancetype)initWithURL:(NSURL *)url;

- (NSURL *)currentURL;
- (void)loadURL:(NSURL *)URL;

@end
