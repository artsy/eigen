#import "ARAppDelegateHelper+Testing.h"
#import <objc/runtime.h>

@implementation ARAppDelegateHelper (Testing)

static ARAppDelegateHelper *testInstance = nil;

+ (void)setSharedInstanceForTesting:(ARAppDelegateHelper *)instance {
    testInstance = instance;
    
    // Swizzle the sharedInstance method to return our test instance
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Method originalMethod = class_getClassMethod(self, @selector(sharedInstance));
        Method swizzledMethod = class_getClassMethod(self, @selector(testing_sharedInstance));
        method_exchangeImplementations(originalMethod, swizzledMethod);
    });
}

+ (void)resetSharedInstanceForTesting {
    testInstance = nil;
    
    // Note: We don't un-swizzle here since dispatch_once ensures swizzling happens only once
    // per app lifetime. The test instance being nil will make sharedInstance work normally.
}

+ (instancetype)testing_sharedInstance {
    if (testInstance) {
        return testInstance;
    }
    
    // Call the original implementation (which is now mapped to testing_sharedInstance due to swizzling)
    return [self testing_sharedInstance];
}

@end