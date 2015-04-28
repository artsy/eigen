#import "TSMiniWebBrowser.h"

@interface ARExternalWebBrowserViewController : TSMiniWebBrowser <UIScrollViewDelegate>
@property (readonly, nonatomic, strong) UIScrollView *scrollView;
@end
