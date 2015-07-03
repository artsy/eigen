@import TSMiniWebBrowser_dblock;


@interface ARExternalWebBrowserViewController : TSMiniWebBrowser <UIScrollViewDelegate>
@property (readonly, nonatomic, strong) UIScrollView *scrollView;


- (instancetype)initWithURL:(NSURL *)url __attribute((objc_designated_initializer));

// TSMiniBrowser setup doesn't happen if you don't use initWithURL.
// Initializing without an NSURL also causes problems in tests.
- (instancetype)init __attribute__((unavailable("Designated Initializer initWithURL: must be used.")));

@end
