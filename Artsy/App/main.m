#import "ARAppDelegate.h"
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>

int main(int argc, char *argv[])
{
    @autoreleasepool
    {
        NSString *appDelegate = @"JSDecoupledAppDelegate";
#ifdef DEBUG
        if (NSClassFromString(@"XCTestCase")) {
            NSString *testBundlePath = [[NSProcessInfo processInfo] environment][@"XCInjectBundle"];
            NSCParameterAssert(testBundlePath);
            NSCParameterAssert([[NSBundle bundleWithPath:testBundlePath] load]);
            appDelegate = @"ARTestHelper";
        }
#endif
        return UIApplicationMain(argc, argv, @"ORKeyboardReactingApplication", appDelegate);
    }
}
