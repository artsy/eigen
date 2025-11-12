#import "ARTArtsyNativeModule.h"
#import "ARAppStatus.h"
#import "AREmission.h"
#import "ARRouter.h"
#import "ARFileUtils.h"
#import "User.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+DeviceTokens.h"
#import "ARAppConstants.h"


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

RCT_EXPORT_METHOD(getPushToken:(RCTPromiseResolveBlock)completion reject:(RCTPromiseRejectBlock) _reject)
{
    NSString *pushToken = [[NSUserDefaults standardUserDefaults] stringForKey:ARAPNSDeviceTokenKey];
    completion(pushToken);
}

RCT_EXPORT_METHOD(getRecentPushPayloads:(RCTPromiseResolveBlock)completion reject:(RCTPromiseRejectBlock) _reject)
{
    if ([ARAppStatus isBetaOrDev]) {
        NSArray *pushPayloads = [[NSUserDefaults standardUserDefaults] arrayForKey:ARAPNSRecentPushPayloadsKey];
        if (!pushPayloads) pushPayloads = @[];
        completion(pushPayloads);
    } else {
        completion(@[]);
    }
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
