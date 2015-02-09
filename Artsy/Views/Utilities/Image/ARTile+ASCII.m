#import "ARTile+ASCII.h"
#import <objc/runtime.h>

@implementation ARTile (ASCII)

static BOOL _ascii = NO;

+ (BOOL)ascii
{
    @synchronized(self) {
        return _ascii;
    }
}

+ (void)setAscii:(BOOL)value
{
    @synchronized(self) {
        if (_ascii != value) {
            _ascii = value;
            if (value) {
                [ARTile swizzle:@selector(drawInRect:blendMode:alpha:) forMethod:@selector(drawInRectASCII:blendMode:alpha:)];
            } else {
                [ARTile swizzle:@selector(drawInRectASCII:blendMode:alpha:) forMethod:@selector(drawInRect:blendMode:alpha:)];
            }
        }
    }
}

+ (void)swizzle:(SEL)originalSelector forMethod:(SEL)overrideSelector
{
    Method originalMethod = class_getInstanceMethod(self, originalSelector);
    Method overrideMethod = class_getInstanceMethod(self, overrideSelector);
    if (class_addMethod(self, originalSelector, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(self, overrideSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, overrideMethod);
    }
}

- (void)drawInRectASCII:(CGRect)rect blendMode:(CGBlendMode)blendMode alpha:(CGFloat)alpha
{
    // do nothing, don't paint tiles
}

@end
