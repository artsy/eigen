#import <UIKit/UIKit.h>

int main(int argc, char * argv[]) {
  @autoreleasepool {
    NSString *delegate = @"AppDelegate";
#ifdef DEBUG
    if (NSClassFromString(@"XCTestCase")) {
      delegate = @"TestHelper";
      if (NSClassFromString(delegate) == nil) {
        NSString *testBundlePath = [[NSProcessInfo processInfo] environment][@"XCInjectBundle"];
        NSCParameterAssert(testBundlePath); 
        NSCParameterAssert([[NSBundle bundleWithPath:testBundlePath] load]);
      }
    }
#endif
    return UIApplicationMain(argc, argv, nil, delegate);
  }
}
