#import "ArtsyAPI+HEAD.h"
#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (HEAD)

+ (void)getHTTPResponseHeadersForRequest:(NSURLRequest *)request completion:(void (^)(NSInteger responseCode, NSDictionary *headers, NSError *_Nullable error))completion
{
    [self performRequest:request fullSuccess:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        completion(response.statusCode, response.allHeaderFields, nil);
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        completion(response.statusCode, response.allHeaderFields, error);
    }];
}
@end
