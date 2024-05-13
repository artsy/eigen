#import <UIKit/UIKit.h>


int main(int argc, char *argv[])
{
    @autoreleasepool {
        NSString *appDelegate = @"JSDecoupledAppDelegate";
#ifdef DEBUG
        if (NSClassFromString(@"XCTestCase")) {
            appDelegate = @"ARTestHelper";
        }
#endif
        return UIApplicationMain(argc, argv, @"UIApplication", appDelegate);
    }
}

