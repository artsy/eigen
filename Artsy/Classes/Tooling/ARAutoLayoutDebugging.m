//
// The original code and idea to add callstack info to layout constraints taken from
// https://github.com/objcio/issue-3-auto-layout-debugging
//

#if DEBUG

#import "ARAutoLayoutDebugging.h"

static int const ARLayoutConstraintDebuggingEnabled;
static int const ARLayoutConstraintDebuggingCallStackSymbols;
static int const ARLayoutConstraintDebuggingFilteredCallStackSymbols;

#import <objc/runtime.h>
static void
MethodSwizzle(Class c, SEL origSEL, SEL overrideSEL)
{
    Method origMethod = class_getInstanceMethod(c, origSEL);
    Method overrideMethod = class_getInstanceMethod(c, overrideSEL);
    if (class_addMethod(c, origSEL, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(c, overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    } else {
        method_exchangeImplementations(origMethod, overrideMethod);
    }
}

static void
WithoutConstraintsUnsatisfiableLogging(dispatch_block_t block)
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    BOOL before = [defaults boolForKey:@"_UIConstraintBasedLayoutLogUnsatisfiable"];
    [defaults setBool:NO forKey:@"_UIConstraintBasedLayoutLogUnsatisfiable"];
    block();
    [defaults setBool:before forKey:@"_UIConstraintBasedLayoutLogUnsatisfiable"];
}

#import <mach-o/dyld.h>
static BOOL
SymbolIsFromAppImage(const char *symbol)
{
    static const char *app_image_name = NULL;
    if (app_image_name == NULL) {
        app_image_name = _dyld_get_image_name(0);
    }
    return strcmp(symbol, app_image_name) == 0;
}

static BOOL
SymbolIsFromAutoLayoutDebugging(NSString *symbol)
{
    return [symbol hasPrefix:@"-[UIView(ARAutoLayoutDebugging)"];
}

static BOOL
SymbolHasBlacklistedPrefix(NSString *symbol)
{
    NSScanner *scanner = [NSScanner scannerWithString:symbol];
    // First remove block prefixes
    [scanner scanString:@"__" intoString:NULL] && [scanner scanInt:NULL];
    // Then remove class or instance method indicators
    [scanner scanString:@"+[" intoString:NULL] || [scanner scanString:@"-[" intoString:NULL];
    return [scanner scanString:@"main" intoString:NULL] ||
           [scanner scanString:@"FLK" intoString:NULL] ||
           [scanner scanString:@"UIView(FLK" intoString:NULL];
}

#import <execinfo.h>
#import <dlfcn.h>
static void
AddCallstackToConstraints(NSArray *constraints)
{
    void *callstack[128];
    int callstack_size = backtrace(callstack, 128);

    NSMutableArray *appSymbols = [NSMutableArray new];
    NSMutableArray *prefixedAppSymbols = [NSMutableArray new];
    NSMutableArray *allSymbols = [NSMutableArray new];

    // Skip the frames for this function and the calling addConstraint(s) method.
    for (int i = 2; i < callstack_size; i++) {
        intptr_t address = (intptr_t)callstack[i];
        NSString *symbol = nil;
        Dl_info info;
        if (dladdr((void *)address, &info) == 0) {
            symbol = [NSString stringWithFormat:@"???? (%p)", (void *)address];
        } else {
            symbol = [NSString stringWithFormat:@"%s (%p)", info.dli_sname, (void *)address];
            if (SymbolIsFromAppImage(info.dli_fname) && !SymbolIsFromAutoLayoutDebugging(symbol)) {
                [appSymbols addObject:symbol];
                if (!SymbolHasBlacklistedPrefix(symbol)) {
                    [prefixedAppSymbols addObject:symbol];
                }
            }
        }
        [allSymbols addObject:symbol];
    }

    NSArray *filteredSymbols = nil;
    if (prefixedAppSymbols.count > 0) {
        filteredSymbols = prefixedAppSymbols;
    } else if (appSymbols.count > 0) {
        filteredSymbols = appSymbols;
    } else {
        filteredSymbols = allSymbols;
    }

    for (NSLayoutConstraint *constraint in constraints) {
        objc_setAssociatedObject(constraint, &ARLayoutConstraintDebuggingCallStackSymbols, allSymbols, OBJC_ASSOCIATION_COPY_NONATOMIC);
        objc_setAssociatedObject(constraint, &ARLayoutConstraintDebuggingFilteredCallStackSymbols, filteredSymbols, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
}

static NSArray *
RecursiveViewsAndFramesDescription(NSArray *views, int indent)
{
    NSMutableArray *descriptions = [NSMutableArray new];
    for (UIView *view in views) {
        const char *className = class_getName(object_getClass(view));
        NSString *frameDescription = NSStringFromCGRect(view.frame);
        NSString *description = [NSString stringWithFormat:@"<%s:%p %@>", className, (void *)view, frameDescription];
        for (int i = 0; i < indent; i++) {
            description = [@"*" stringByAppendingString:description];
        }
        [descriptions addObject:description];
        [descriptions addObjectsFromArray:RecursiveViewsAndFramesDescription(view.subviews, indent+2)];
    }
    return descriptions;
}

@implementation NSLayoutConstraint (ARAutoLayoutDebugging)

- (NSArray *)ARAutoLayoutDebugging_callStackSymbols;
{
    return objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingCallStackSymbols);
}

- (NSArray *)ARAutoLayoutDebugging_filteredCallStackSymbols;
{
    return objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingFilteredCallStackSymbols);
}

@end

@implementation UIView (ARAutoLayoutDebugging)

+ (void)load;
{
    if (getenv("ARAutoLayoutDebuggingEnabled") != NULL) {
        MethodSwizzle(self, @selector(addConstraint:), @selector(ARAutoLayoutDebugging_addConstraint:));
        MethodSwizzle(self, @selector(addConstraints:), @selector(ARAutoLayoutDebugging_addConstraints:));
    }
}

- (void)ARAutoLayoutDebugging_setLogConstraints:(BOOL)flag;
{
    objc_setAssociatedObject(self, &ARLayoutConstraintDebuggingEnabled, @(flag), OBJC_ASSOCIATION_RETAIN);
}

- (BOOL)ARAutoLayoutDebugging_logConstraints;
{
    return [objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingEnabled) boolValue] || getenv("ARAutoLayoutDebuggingLog") != NULL;
}

- (void)ARAutoLayoutDebugging_addConstraint:(NSLayoutConstraint *)constraint;
{
    AddCallstackToConstraints(@[constraint]);
    if (self.ARAutoLayoutDebugging_logConstraints) {
        [self ARAutoLayoutDebugging_addSingleConstraint:constraint];
    } else {
        // This is the original -[UIView addConstraint:] method.
        [self ARAutoLayoutDebugging_addConstraint:constraint];
    }
}

// This adds the constraints one at a time to ensure that we get to see the changes for each constraint.
- (void)ARAutoLayoutDebugging_addConstraints:(NSArray *)constraints;
{
    AddCallstackToConstraints(constraints);
    if (self.ARAutoLayoutDebugging_logConstraints) {
        for (NSLayoutConstraint *constraint in constraints) {
            [self ARAutoLayoutDebugging_addSingleConstraint:constraint];
        }
    } else {
        // This is the original -[UIView addConstraints:] method.
        [self ARAutoLayoutDebugging_addConstraints:constraints];
    }
}

- (void)ARAutoLayoutDebugging_addSingleConstraint:(NSLayoutConstraint *)constraint;
{
    NSArray *changes = [self ARAutoLayoutDebugging_differenceInTree:^{
        WithoutConstraintsUnsatisfiableLogging(^{
            // This is the original -[UIView addConstraint:] method.
            [self ARAutoLayoutDebugging_addConstraint:constraint];
        });
    }];

    if (changes.count > 0) {
      printf("\n" \
             "================================================================================\n" \
             "Changes were made by adding constraint: %s\n" \
             "To view: %s\n" \
             "--------------------------------------------------------------------------------\n" \
             "%s\n" \
             "--------------------------------------------------------------------------------\n" \
             "%s\n" \
             "================================================================================\n" \
             "\n", [[constraint description] UTF8String], [[self description] UTF8String], [[changes componentsJoinedByString:@"\n"] UTF8String], [[constraint.ARAutoLayoutDebugging_filteredCallStackSymbols componentsJoinedByString:@"\n"] UTF8String]);
    }
}

- (NSArray *)ARAutoLayoutDebugging_differenceInTree:(dispatch_block_t)block;
{
    NSArray *before = [self ARAutoLayoutDebugging_recursiveDescription];
    block();
    [self layoutIfNeeded];
    NSArray *after = [self ARAutoLayoutDebugging_recursiveDescription];
    NSAssert(before.count == after.count, @"Expected recursiveDescription to not change in line count.");

    NSMutableArray *changes = [NSMutableArray new];
    for (NSUInteger i = 0; i < before.count; i++) {
        NSString *beforeLine = before[i];
        NSString *afterLine = after[i];
        if (![beforeLine isEqualToString:afterLine]) {
            [changes addObject:afterLine];
        }
    }
    return changes;
}

- (NSArray *)ARAutoLayoutDebugging_recursiveDescription;
{
    return RecursiveViewsAndFramesDescription(@[self], 0);
}

@end

#endif
