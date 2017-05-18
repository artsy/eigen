#import "ARSerifStatusMaintainer.h"
#import "UIApplication+StatusBar.h"


@interface ARSerifStatusMaintainer ()
@property (nonatomic, assign) BOOL oldStatusBarHiddenStatus;
@property (nonatomic, assign) UIStatusBarStyle oldStatusBarStyle;

@end


@implementation ARSerifStatusMaintainer

- (void)viewWillAppear:(BOOL)animated app:(UIApplication *)app
{
    self.oldStatusBarStyle = app.statusBarStyle;
    self.oldStatusBarHiddenStatus = app.statusBarHidden;

    [app ar_setStatusBarStyle:UIStatusBarStyleDefault animated:animated];

    UIStatusBarAnimation animation = animated ? UIStatusBarAnimationFade : UIStatusBarAnimationNone;
    [app ar_setStatusBarHidden:NO withAnimation:animation];
}

- (void)viewWillDisappear:(BOOL)animated app:(UIApplication *)app
{
    [app ar_setStatusBarStyle:self.oldStatusBarStyle animated:animated];

    UIStatusBarAnimation animation = animated ? UIStatusBarAnimationFade : UIStatusBarAnimationNone;
    [app ar_setStatusBarHidden:self.oldStatusBarHiddenStatus withAnimation:animation];
}

@end
