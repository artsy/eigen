#import <objc/runtime.h>

@implementation UIScrollView (HitTest)

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        SEL old = @selector(hitTest:withEvent:);
        SEL new = @selector(swizzled_hitTest:withEvent:);
        Class class = [self class];
        Method oldMethod = class_getInstanceMethod(class, old);
        Method newMethod = class_getInstanceMethod(class, new);

        if (class_addMethod(class, old, method_getImplementation(newMethod), method_getTypeEncoding(newMethod))) {
            class_replaceMethod(class, new, method_getImplementation(oldMethod), method_getTypeEncoding(oldMethod));
        } else {
            method_exchangeImplementations(oldMethod, newMethod);
        }
    });
}

- (UIView *)swizzled_hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    if (self.isDragging || self.isDecelerating) {
        return self;
    }

    return [self swizzled_hitTest:point withEvent:event];
}

@end
