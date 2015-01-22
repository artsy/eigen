#import "UIViewController+FullScreenLoading.h"
#import "ARReusableLoadingView.h"
#import <objc/runtime.h>

@implementation UIViewController (FullScreenLoading)

static const NSString *AR_LOADING_VIEW = @"ARLoadingView";

- (void)ar_presentIndeterminateLoadingIndicatorAnimated:(BOOL)animated
{
    ARReusableLoadingView *loadingView = objc_getAssociatedObject(self, &AR_LOADING_VIEW);
    if (loadingView) { return; }

    loadingView = [[ARReusableLoadingView alloc] init];
    if ([AROptions boolForOption:AROptionsLoadingScreenAlpha]) {
        loadingView.backgroundColor = [UIColor colorWithWhite:1 alpha:0.3];
    }

    [self.view addSubview:loadingView];
    [loadingView startIndeterminateAnimated:animated completion:nil];

    [loadingView alignCenterWithView:self.view];
    [loadingView constrainWidthToView:self.view predicate:@""];
    [loadingView constrainHeightToView:self.view predicate:@""];

    objc_setAssociatedObject(self, &AR_LOADING_VIEW, loadingView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)ar_removeIndeterminateLoadingIndicatorAnimated:(BOOL)animated
{
    ARReusableLoadingView *loadingView = objc_getAssociatedObject(self, &AR_LOADING_VIEW);

    // Don't run an animation if it's not needed
    if (!loadingView) { return; }

    // Nil the associated object
    objc_setAssociatedObject(self, &AR_LOADING_VIEW, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    [loadingView stopIndeterminateAnimated:animated completion:^(BOOL finished) {
        [loadingView removeFromSuperview];
    }];
}

@end
