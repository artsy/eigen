#import "ARSerifStatusMaintainer.h"


@interface ARSerifStatusMaintainer ()
@property (nonatomic, assign) BOOL oldStatusBarHiddenStatus;
@property (nonatomic, assign) UIStatusBarStyle oldStatusBarStyle;

@end


@implementation ARSerifStatusMaintainer

- (void)viewWillAppear:(BOOL)animated app:(UIApplication *)app
{
    self.oldStatusBarStyle = app.statusBarStyle;
    self.oldStatusBarHiddenStatus = app.statusBarHidden;

    [app setStatusBarStyle:UIStatusBarStyleDefault animated:animated];

    UIStatusBarAnimation animation = animated ? UIStatusBarAnimationFade : UIStatusBarAnimationNone;
    [app setStatusBarHidden:NO withAnimation:animation];
}

- (void)viewWillDisappear:(BOOL)animated app:(UIApplication *)app
{
    [app setStatusBarStyle:self.oldStatusBarStyle animated:animated];

    UIStatusBarAnimation animation = animated ? UIStatusBarAnimationFade : UIStatusBarAnimationNone;
    [app setStatusBarHidden:self.oldStatusBarHiddenStatus withAnimation:animation];
}

@end
