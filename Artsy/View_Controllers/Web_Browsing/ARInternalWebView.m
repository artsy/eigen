#import "ARInternalWebView.h"
#import "ARInternalMobileWebViewController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARRouter.h"
#import <React/UIView+React.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

@implementation ARInternalWebView

- (instancetype)initWithFrame:(CGRect)frame
{
    return [super initWithFrame:frame];
}

- (void)setRoute:(NSString *)route;
{
    if ([_route isEqual:route]) {
      return;
    }
    _route = route;
}

- (void)layoutSubviews {
    [super layoutSubviews];

    if (!self.webViewController) {
        [self embedWebView];
    }
}

- (void)embedWebView
{
    NSURL *resolvedURL = [ARRouter resolveRelativeUrl:self.route];
    ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:resolvedURL];
    UIViewController *parentVC = [self reactViewController];
    [parentVC ar_addModernChildViewController:webVC];
    if (self.showFullScreen) {
        [self alignToView:parentVC.view];
    }
    [webVC.view alignToView:self];
    self.webViewController = webVC;
}
@end
