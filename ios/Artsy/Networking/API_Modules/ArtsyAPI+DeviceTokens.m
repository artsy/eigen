#import <UIKit/UIKit.h>

#import "ArtsyAPI+Private.h"
#import "ARRouter+RestAPI.h"
#import "ARAppConstants.h"


@implementation ArtsyAPI (DeviceTokens)

+ (AFHTTPRequestOperation *)setAPNTokenForCurrentDevice:(NSString *)token success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    NSString *name = [[UIDevice currentDevice] name];
    
    if (token && name) {
        NSURLRequest *request = [ARRouter newSetDeviceAPNTokenRequest:token forDevice:name];

        // TODO: Is it a problem that this can be nil?
        // Should we fail loudly? Wait for the httpClient to be ready?
        if (!request) {
            return nil;
        }

        return [ArtsyAPI performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            if (failure) {
                failure(error);
            }
        }];
    }
    
    return nil;
}

+ (AFHTTPRequestOperation *)deleteAPNTokenForCurrentDeviceWithCompletion:(void (^)(void))completion
{
    NSString *token = [[NSUserDefaults standardUserDefaults] stringForKey:ARAPNSDeviceTokenKey];
    if (!token) {
        completion();
        return nil;
    }
    NSURLRequest *request = [ARRouter newDeleteDeviceRequest:token];

    if (!request) {
        completion();
        return nil;
    }
    return [ArtsyAPI performRequest:request success:^ (id _) {
        completion();
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        completion();
    }];
}
@end

