#import "ArtsyAPI+HEAD.h"
#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (HEAD)

+ (void)getHTTPRedirectForRequest:(NSURLRequest *)request completion:(void (^)(NSString *_Nullable redirectLocation, NSError *_Nullable error))completion
{
    [self performRequest:request fullSuccess:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        BOOL redirected = ([request.URL isEqual:response.URL] == NO);
        if (redirected) {
            completion(response.URL.absoluteString, nil);
        } else {
            completion(nil, nil);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        completion(nil, error);
    }];
}
@end
