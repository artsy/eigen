// Thanks!  http://stackoverflow.com/questions/808503/uibutton-making-the-hit-area-larger-than-the-default-hit-area

#import "UIView+HitTestExpansion.h"
#import <objc/runtime.h>


@implementation UIView (HitTestExpansion)

static const NSString *KEY_HIT_TEST_EDGE_INSETS = @"HitTestEdgeInsets";

- (void)ar_extendHitTestSizeByWidth:(CGFloat)width andHeight:(CGFloat)height
{
    // As they are stored as a UIEdgeInset and we're dealing with extending
    // we invert the height & width to make the API make sense

    UIEdgeInsets insets = UIEdgeInsetsMake(-height, -width, -height, -width);
    NSValue *value = [NSValue value:&insets withObjCType:@encode(UIEdgeInsets)];
    objc_setAssociatedObject(self, &KEY_HIT_TEST_EDGE_INSETS, value, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIEdgeInsets)hitTestEdgeInsets
{
    NSValue *value = objc_getAssociatedObject(self, &KEY_HIT_TEST_EDGE_INSETS);
    if (value) {
        UIEdgeInsets edgeInsets;
        [value getValue:&edgeInsets];
        return edgeInsets;
    } else {
        return UIEdgeInsetsZero;
    }
}

@end
