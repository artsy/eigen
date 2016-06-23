#import "ArtsyAPI+HEAD.h"
#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (HEAD)

+ (void)getHTTPRedirectForRequest:(NSURLRequest *)request completion:(void (^)(NSString *_Nullable redirectLocation, NSError *_Nullable error))completion
{
    [self performRequest:request fullSuccess:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        BOOL redirects = request.URL != response.URL;
        if (redirects) {
            completion(response.URL.absoluteString, nil);
        } else {
            completion(nil, nil);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        completion(nil, error);
    }];
}
@end
