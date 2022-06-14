// Thanks!  http://stackoverflow.com/questions/808503/uibutton-making-the-hit-area-larger-than-the-default-hit-area

#import "UIView+HitTestExpansion.h"
#import <objc/runtime.h>


@implementation UIView (HitTestExpansion)

static const NSString *KEY_HIT_TEST_EDGE_INSETS = @"HitTestEdgeInsets";
static BOOL ARHasSwizzledSetFrame;

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

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
    CGRect relativeFrame = self.bounds;
    CGRect hitFrame = UIEdgeInsetsInsetRect(relativeFrame, self.hitTestEdgeInsets);

    return CGRectContainsPoint(hitFrame, point);
}

static const NSInteger HighlightViewTag = 232323;

// Support showing what it would look like at runtime
// We need to ensure that setting the frame resizes correctly
// Thus swizzling only when at least one view uses the visually method

- (void)ar_visuallyExtendHitTestSizeByWidth:(CGFloat)width andHeight:(CGFloat)height
{
    [self ar_extendHitTestSizeByWidth:width andHeight:height];
    [self ar_visualizeHitTestArea];
}

- (void)ar_visualizeHitTestArea;
{
    UIEdgeInsets insets = self.hitTestEdgeInsets;

    // Ensure the value is set to at least something so that the frame will get updated from swizzledLayoutSubviews.
    if (UIEdgeInsetsEqualToEdgeInsets(insets, UIEdgeInsetsZero)) {
        [self ar_extendHitTestSizeByWidth:0 andHeight:0];
    }

    UIView *highlightView = [self viewWithTag:HighlightViewTag];
    if (!highlightView) {
        highlightView = [[UIView alloc] init];
        highlightView.backgroundColor = [[UIColor purpleColor] colorWithAlphaComponent:0.5];
        highlightView.tag = HighlightViewTag;
        highlightView.userInteractionEnabled = NO;
        self.clipsToBounds = NO;
        [self addSubview:highlightView];
    }
    highlightView.frame = UIEdgeInsetsInsetRect(self.bounds, insets);

    if (!ARHasSwizzledSetFrame) {
        ARHasSwizzledSetFrame = YES;

        SEL setFrame = @selector(layoutSubviews);
        SEL newSetFrame = @selector(swizzledLayoutSubviews);

        Method originalMethod = class_getInstanceMethod(self.class, setFrame);
        Method overrideMethod = class_getInstanceMethod(self.class, newSetFrame);
        if (class_addMethod(self.class, setFrame, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
            class_replaceMethod(self.class, newSetFrame, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
        } else {
            method_exchangeImplementations(originalMethod, overrideMethod);
        }
    }
}

- (void)swizzledLayoutSubviews
{
    [self swizzledLayoutSubviews];

    NSValue *value = objc_getAssociatedObject(self, &KEY_HIT_TEST_EDGE_INSETS);
    if (value) [self ar_visualizeHitTestArea];
}


@end
