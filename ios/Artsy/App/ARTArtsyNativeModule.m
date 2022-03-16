#import "ARTArtsyNativeModule.h"
#import "ARAppStatus.h"
#import <Emission/AREmission.h>
#import "ARRouter.h"
#import "ARFileUtils.h"
#import "User.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+DeviceTokens.h"


@implementation ARTArtsyNativeModule

RCT_EXPORT_MODULE(ArtsyNativeModule);


RCT_EXPORT_METHOD(updateAuthState:(NSString *) token
                  expiryDateString:(NSString *) expiryDateString
                        JSON:(id) JSON)
{
    [[ARUserManager sharedManager] handleAuthState:token expiryDateString:expiryDateString JSON:JSON];
    
}

RCT_EXPORT_METHOD(clearUserData:(RCTPromiseResolveBlock)completion reject:(RCTPromiseRejectBlock) _reject)
{
    [ArtsyAPI deleteAPNTokenForCurrentDeviceWithCompletion:^ {
        [ARUserManager clearUserData];
        completion(nil);
    }];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSDictionary *)constantsToExport
{
    return @{
        @"gitCommitShortHash": [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitShortHash"],
        @"isBetaOrDev": @([ARAppStatus isBetaOrDev]),
    };
}

@end
