#import "ArtsyAPI+Sailthru.h"
#import "ARRouter.h"

#import <AFNetworking/AFNetworking.h>

@implementation ArtsyAPI (Sailthru)

+ (void)getDecodedURLAndRegisterClick:(NSURL *)encodedURL completion:(void (^)(NSURL *decodedURL))completion;
{
    NSURLRequest *request = [ARRouter newSailthruRegisterClickAndDecodeURLRequest:encodedURL];
    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
    [operation setRedirectResponseBlock:^NSURLRequest *(id _, NSURLRequest *request, NSURLResponse *response) {
        if (response == nil) {
            return request;
        } else {
            NSURL *decodedURL = [NSURL URLWithString:[(NSHTTPURLResponse *)response allHeaderFields][@"Location"]];
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(decodedURL);
            });
            return nil;
        }
    }];
    [[NSOperationQueue mainQueue] addOperation:operation];
}

@end
