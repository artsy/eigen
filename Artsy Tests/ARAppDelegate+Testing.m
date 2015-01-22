#import <objc/runtime.h>

#import "ARRouter.h"
#import "ARSwitchBoard.h"
#import "ARLogger.h"
#import "ARAppDelegate+Testing.h"
#import "ARDispatchManager.h"

@implementation ARAppDelegate (Testing)

// Swizzle out -application:willFinishLaunchingWithOptions: and
// -application:didFinishLaunchingWithOptions: to not have the normal
// app logic interfere with the tests.
//
// As per mxcl's comment here: http://stackoverflow.com/a/12709123/1254854

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self swapImplementationOf:@selector(application:didFinishLaunchingWithOptions:)
                              with:@selector(swizzled_application:didFinishLaunchingWithOptions:)];

        [self swapImplementationOf:@selector(application:willFinishLaunchingWithOptions:)
                              with:@selector(swizzled_application:willFinishLaunchingWithOptions:)];
    });
}

+ (void)swapImplementationOf:(SEL)old with:(SEL)new
{
    Class class = [self class];
    Method oldMethod = class_getInstanceMethod(class, old);
    Method newMethod = class_getInstanceMethod(class, new);

    if (class_addMethod(class, old, method_getImplementation(newMethod), method_getTypeEncoding(newMethod))) {
        class_replaceMethod(class, new, method_getImplementation(oldMethod), method_getTypeEncoding(oldMethod));
    } else {
        method_exchangeImplementations(oldMethod, newMethod);
    }
}

- (BOOL)swizzled_application:(id)app willFinishLaunchingWithOptions:(id)opts
{
    [ARRouter setup];
    [ARDispatchManager sharedManager].useSyncronousDispatches = YES;
    return YES;
}

- (BOOL)swizzled_application:(id)app didFinishLaunchingWithOptions:(id)opts
{
    [[ARLogger sharedLogger] startLogging];
    return YES;
}

@end
