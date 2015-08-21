#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (DeviceTokens)

+ (AFHTTPRequestOperation *)setAPNTokenForCurrentDevice:(NSString *)token success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    NSString *name = [[UIDevice currentDevice] name];

    if (token && name) {
        NSURLRequest *request = [ARRouter newSetDeviceAPNTokenRequest:token forDevice:name];
        return [ArtsyAPI performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            if (failure) {
                failure(error);
            }
        }];
    }

    return nil;
}

@end
