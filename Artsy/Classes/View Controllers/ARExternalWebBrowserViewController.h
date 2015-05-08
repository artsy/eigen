#import <STKWebKitViewController/STKWebKitViewController.h>

@interface ARExternalWebBrowserViewController : STKWebKitViewController <UIScrollViewDelegate>
// @property (readonly, nonatomic, strong) UIScrollView *scrollView;

- (void)loadURL:(NSURL *)URL;

// Private
- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;

@end
