#import "ArtsyAPI+Private.h"

@implementation ArtsyAPI (DeviceTokens)

+ (AFJSONRequestOperation *)setAPNTokenForCurrentDevice:(NSData *)token success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    // http://stackoverflow.com/questions/9372815/how-can-i-convert-my-device-token-nsdata-into-an-nsstring
    const unsigned *tokenBytes = [token bytes];
    NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                          ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                          ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                          ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];

    NSString *name = [[UIDevice currentDevice] name];

    if (hexToken && name) {
        NSURLRequest *request = [ARRouter newSetDeviceAPNTokenRequest:hexToken forDevice:name];
        return [ArtsyAPI performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            if (failure) {
                failure(error);
            }
        }];
    }

    return nil;
}

@end
