#import "UIApplication+StatusBar.h"

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@implementation UIApplication (StatusBar)

- (void)ar_setStatusBarStyle:(UIStatusBarStyle)statusBarStyle animated:(BOOL)animated
{
    [self setStatusBarStyle:statusBarStyle animated:animated];
}

- (void)ar_setStatusBarHidden:(BOOL)hidden withAnimation:(UIStatusBarAnimation)animation
{
    [self setStatusBarHidden:hidden withAnimation:animation];
}

@end
#pragma clang diagnostic pop
