//
// objc.io #3 sample code (http://www.objc.io/issue-3)
// Advanced Auto Layout Toolbox
//

#if DEBUG

#import <objc/runtime.h>

static BOOL
ARAutoLayoutDebuggingEnabled(void)
{
    return [[NSProcessInfo processInfo] environment][@"ARAutoLayoutDebugging"] != nil;
}

static void
MethodSwizzle(Class c, SEL origSEL, SEL overrideSEL)
{
    Method origMethod = class_getInstanceMethod(c, origSEL);
    Method overrideMethod = class_getInstanceMethod(c, overrideSEL);
    if(class_addMethod(c, origSEL, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(c, overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    } else {
        method_exchangeImplementations(origMethod, overrideMethod);
    }
}

static int const ARLayoutConstraintDebuggingShort;
static int const ARLayoutConstraintDebuggingCallStackSymbols;

@implementation UIView (ARAutoLayoutDebugging)

+ (void)load;
{
    if (ARAutoLayoutDebuggingEnabled()) {
        MethodSwizzle(self, @selector(addConstraint:), @selector(ARAutoLayoutDebugging_addConstraint:));
        MethodSwizzle(self, @selector(addConstraints:), @selector(ARAutoLayoutDebugging_addConstraints:));
    }
}

- (void)ARAutoLayoutDebugging_addConstraint:(NSLayoutConstraint *)constraint;
{
    AddTracebackToConstraints(@[constraint]);
    [self ARAutoLayoutDebugging_addConstraint:constraint];
}

- (void)ARAutoLayoutDebugging_addConstraints:(NSArray *)constraints;
{
    AddTracebackToConstraints(constraints);
    [self ARAutoLayoutDebugging_addConstraints:constraints];
}

static void
AddTracebackToConstraints(NSArray *constraints)
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
            objc_setAssociatedObject(c, &ARLayoutConstraintDebuggingShort, symbol, OBJC_ASSOCIATION_COPY_NONATOMIC);
        }
        objc_setAssociatedObject(c, &ARLayoutConstraintDebuggingCallStackSymbols, a, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
}

@end


@implementation NSLayoutConstraint (ARAutoLayoutDebugging)

+ (void)load;
{
    if (ARAutoLayoutDebuggingEnabled()) {
        MethodSwizzle(self, @selector(description), @selector(AROverride_description));
    }
}

- (NSString *)ARAutoLayoutDebugging_description;
{
    NSString *description = [self ARAutoLayoutDebugging_description];
    NSString *ARTag = objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingShort);
    if (ARTag == nil) {
        return description;
    }
    return [description stringByAppendingFormat:@" %@", ARTag];
}

- (NSArray *)creationCallStackSymbols;
{
    return objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingCallStackSymbols);
}

@end

#endif
