#import <UIKit/UIKit.h>


@interface UIView (HitTestExpansion)

/// Allow the tap detection range to be larger than the frame of the button.
- (void)ar_extendHitTestSizeByWidth:(CGFloat)width andHeight:(CGFloat)height;

@end
