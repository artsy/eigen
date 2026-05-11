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

RCT_EXPORT_METHOD(getRecentPushPayloads:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if (![ARAppStatus isBetaOrDev]) {
        resolve(@[]);
        return;
    }

    NSArray *stored = [[NSUserDefaults standardUserDefaults] arrayForKey:ARAPNSRecentPushPayloadsKey];
    if (!stored) stored = @[];

    NSMutableArray *converted = [NSMutableArray arrayWithCapacity:stored.count];

    for (NSDictionary *record in stored) {
        NSDictionary *item = [self convertRecordForJS:record];
        if (item) {
            [converted addObject:item];
        }
    }

    resolve([converted copy]);
}

- (NSDictionary *)convertRecordForJS:(NSDictionary *)record {
    NSData *jsonData = record[@"rawJSON"];
    if (![jsonData isKindOfClass:[NSData class]]) { return nil; }
    NSString *jsonString =
        [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    return @{
        @"json": jsonString ?: @"{}",
        @"receivedAt": record[@"_receivedAt"] ?: @"",
        @"source": record[@"_source"] ?: @"",
    };
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
