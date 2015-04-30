//
// objc.io #3 sample code (http://www.objc.io/issue-3)
// Advanced Auto Layout Toolbox
//

#import "NSLayoutConstraint+Debugging.h"

#if DEBUG

#import <objc/runtime.h>

static BOOL ObjcioLayoutConstraintsDebuggingEnabled(void)
{
    static BOOL enabled;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        enabled = ([[NSProcessInfo processInfo] environment][@"ObjcioLayoutConstraintsDebugging"] != nil);
    });
    return enabled;
}


// C.f. <http://www.mikeash.com/pyblog/friday-qa-2010-01-29-method-replacement-for-fun-and-profit.html>
static void MethodSwizzle(Class c, SEL origSEL, SEL overrideSEL)
{
    Method origMethod = class_getInstanceMethod(c, origSEL);
    Method overrideMethod = class_getInstanceMethod(c, overrideSEL);
    if(class_addMethod(c, origSEL, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(c, overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    } else {
        method_exchangeImplementations(origMethod, overrideMethod);
    }
}

static int const ObjcioLayoutConstraintDebuggingShort;
static int const ObjcioLayoutConstraintDebuggingCallStackSymbols;

@implementation NSView (ObjcioLayoutConstraintsDebugging)


// We're doing some nasty method swizzling here to make debugging of constraints easier.
+ (void)load;
{
    if (ObjcioLayoutConstraintsDebuggingEnabled()) {
        MethodSwizzle(self, @selector(addConstraint:), @selector(objcioOverride_addConstraint:));
        MethodSwizzle(self, @selector(addConstraints:), @selector(objcioOverride_addConstraints:));
    }
}

- (void)objcioOverride_addConstraint:(NSLayoutConstraint *)constraint
{
    AddTracebackToConstraints(@[constraint]);
    [self objcioOverride_addConstraint:constraint];
}

- (void)objcioOverride_addConstraints:(NSArray *)constraints
{
    AddTracebackToConstraints(constraints);
    [self objcioOverride_addConstraints:constraints];
}

static void AddTracebackToConstraints(NSArray *constraints)
{
    NSArray *a = [NSThread callStackSymbols];
    NSString *symbol = nil;
    if (2 < [a count]) {
        NSString *line = a[2];
        // Format is
        //               1         2         3         4         5
        //     012345678901234567890123456789012345678901234567890123456789
        //     8   MyCoolApp                           0x0000000100029809 -[MyViewController loadView] + 99
        //
        // Don't add if this wasn't called from "MyCoolApp":
        if (59 <= [line length]) {
            line = [line substringFromIndex:4];
            if ([line hasPrefix:@"My"]) {
                symbol = [line substringFromIndex:59 - 4];
            }
        }
    }
    for (NSLayoutConstraint *c in constraints) {
        if (symbol != nil) {
            objc_setAssociatedObject(c, &ObjcioLayoutConstraintDebuggingShort, symbol, OBJC_ASSOCIATION_COPY_NONATOMIC);
        }
        objc_setAssociatedObject(c, &ObjcioLayoutConstraintDebuggingCallStackSymbols, a, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
}

@end



@implementation NSLayoutConstraint (ObjcioLayoutConstraintsDebugging)

// We're doing some nasty method swizzling here to make debugging of constraints easier.
+ (void)load;
{
    if (ObjcioLayoutConstraintsDebuggingEnabled()) {
        MethodSwizzle(self, @selector(description), @selector(objcioOverride_description));
    }
}

- (NSString *)objcioOverride_description
{
    // call through to the original, really
    NSString *description = [self objcioOverride_description];
    NSString *objcioTag = objc_getAssociatedObject(self, &ObjcioLayoutConstraintDebuggingShort);
    if (objcioTag == nil) {
        return description;
    }
    return [description stringByAppendingFormat:@" %@", objcioTag];
}

- (NSArray *)creationCallStackSymbols
{
    return objc_getAssociatedObject(self, &ObjcioLayoutConstraintDebuggingCallStackSymbols);
}

@end

#else 

@implementation NSLayoutConstraint (ObjcioLayoutConstraintsDebugging)

- (NSArray *)creationCallStackSymbols
{
    return nil;
}

@end

#endif
