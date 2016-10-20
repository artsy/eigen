#import <Foundation/Foundation.h>

@class UIScrollView;

@protocol ARMenuAwareViewController <NSObject>

@optional
@property (readonly, nonatomic, assign) BOOL hidesToolbarMenu;
@property (readonly, nonatomic, assign) BOOL hidesNavigationButtons;
@property (readonly, nonatomic, assign) BOOL hidesBackButton;
@property (readonly, nonatomic, assign) BOOL hidesStatusBarBackground;

/**
 * The scrollview returned by this getter will have its delegate proxied through the ARScrollNavigationChief so that the
 * menu automatically gets hidden/shown on scroll.
 */
@property (readonly, nonatomic, weak) UIScrollView *menuAwareScrollView;

@end
