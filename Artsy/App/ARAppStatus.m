#import "ARAppStatus.h"


@implementation ARAppStatus

// http://stackoverflow.com/questions/26081543/how-to-tell-at-runtime-whether-an-ios-app-is-running-through-a-testflight-beta-i

- (BOOL)isBetaOrDev
{
#if TARGET_IPHONE_SIMULATOR
    return YES;
#endif

    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
    NSString *receiptURLString = [receiptURL path];
    return ([receiptURLString rangeOfString:@"sandboxReceipt"].location != NSNotFound);
}

- (BOOL)isDemo
{
    return ARIsRunningInDemoMode;
}

@end
