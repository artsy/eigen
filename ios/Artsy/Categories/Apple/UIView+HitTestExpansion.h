#import <UIKit/UIKit.h>


@interface UIView (HitTestExpansion)

/// Allow the tap detection range to be larger than the frame of the button.
- (void)ar_extendHitTestSizeByWidth:(CGFloat)width andHeight:(CGFloat)height;

/// Check how big the tap frame would be.
- (void)ar_visuallyExtendHitTestSizeByWidth:(CGFloat)width andHeight:(CGFloat)height;

/// Show current hit test area.
- (void)ar_visualizeHitTestArea;

@end
