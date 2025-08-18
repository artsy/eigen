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

#ifdef RCT_NEW_ARCH_ENABLED
#import "ArtsyNativeModuleSpec.h"
#endif


@implementation ARTArtsyNativeModule

RCT_EXPORT_MODULE(ArtsyNativeModule);

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeArtsyNativeModuleSpecJSI>(params);
}
#endif


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

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::ModuleConstants<JS::NativeArtsyNativeModule::Constants>)getConstants {
    return facebook::react::typedConstants<JS::NativeArtsyNativeModule::Constants>({
        .gitCommitShortHash = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitShortHash"],
        .isBetaOrDev = @([ARAppStatus isBetaOrDev])
    });
}
#endif

@end
