#import "ArtsyWatchAPI.h"

/// Hopefully temporary

/// As we don't have our API ported to NSURLSession / AFNetworking 2.0
/// I have a smaller API that does NSURLSession things.

@implementation ArtsyWatchAPI

+ (void)getRequest:(NSURLRequest *)request parseToArrayOfClass:(Class)klass :(void (^)(NSArray *objects, NSURLResponse *response, NSError *error))completionHandler
{
    NSURLSession *session = [NSURLSession sharedSession];
    
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler: ^(NSData *data, NSURLResponse *response, NSError *error) {
        NSArray *jsonArray = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
        NSArray *mapped = [jsonArray map:^id(id object) {
            return [klass modelWithJSON:object error:nil];
        }];

        completionHandler(mapped, response, error);

    }];

    [task resume];
}

@end
