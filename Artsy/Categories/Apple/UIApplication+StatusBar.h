#import <UIKit/UIKit.h>

@interface UIApplication (StatusBar)

// Works around non-silencable deprecation warnings in Swift files.
// And also avoids silencing individual warnings in Objective-C files.
- (void)ar_setStatusBarStyle:(UIStatusBarStyle)statusBarStyle;
- (void)ar_setStatusBarStyle:(UIStatusBarStyle)statusBarStyle animated:(BOOL)animated;
- (void)ar_setStatusBarHidden:(BOOL)hidden;
- (void)ar_setStatusBarHidden:(BOOL)hidden withAnimation:(UIStatusBarAnimation)animation;

@end
