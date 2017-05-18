#import <UIKit/UIKit.h>

@interface UIApplication (StatusBar)

// Works around non-silencable deprecation warnings in Swift files.
- (void)ar_setStatusBarStyle:(UIStatusBarStyle)statusBarStyle animated:(BOOL)animated;
- (void)ar_setStatusBarHidden:(BOOL)hidden withAnimation:(UIStatusBarAnimation)animation;

@end
