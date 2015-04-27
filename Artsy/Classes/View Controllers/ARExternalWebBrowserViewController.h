#import "TSMiniWebBrowser.h"

@protocol ARWebViewControllerScrollDelegate
- (void)scrollViewDidScroll:(UIScrollView *)scrollView;
@end

@interface ARExternalWebBrowserViewController : TSMiniWebBrowser <UIScrollViewDelegate>
@property (readonly, nonatomic, strong) UIScrollView *scrollView;
@end
