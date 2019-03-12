#import "ARAppStatus.h"
#import "User.h"
#import "ARAppConstants.h"
#import <UIKit/UIKit.h>


@implementation ARAppStatus

// http://stackoverflow.com/questions/26081543/how-to-tell-at-runtime-whether-an-ios-app-is-running-through-a-testflight-beta-i

+ (BOOL)isDev;
{
#if TARGET_IPHONE_SIMULATOR
    return YES;
#elif DEBUG
    return YES;
#else
    return NO;
#endif
}

+ (BOOL)isBeta;
{
    static BOOL isBeta = NO;
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
        NSString *receiptURLString = [receiptURL path];
        isBeta = [receiptURLString rangeOfString:@"sandboxReceipt"].location != NSNotFound;

    });
    return isBeta;
}

+ (BOOL)isBetaOrDev;
{
    return [self isDev] || [self isBeta];
}

+ (BOOL)isAdmin;
{
    NSString *email = [User currentUser].email;
    BOOL isArtsyEmail = [email hasSuffix:@"@artsymail.com"] || [email hasSuffix:@"@artsy.net"];
    return isArtsyEmail;
}

+ (BOOL)isBetaDevOrAdmin;
{
    return [self isBetaOrDev] || [self isAdmin];
}

+ (BOOL)isDemo;
{
    return ARIsRunningInDemoMode;
}

+ (BOOL)isRunningTests;
{
    static BOOL isRunningTests = NO;
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        isRunningTests = NSClassFromString(@"XCTestCase") != NULL;
    });
    return isRunningTests;
}
@end
