#import "ArtsyAPI+Pages.h"
#import "ArtsyAPI+Private.h"

#import "ARRouter+RestAPI.h"
#import "ARLogger.h"


@implementation ArtsyAPI (Pages)

+ (void)getPageContentForSlug:(NSString *)slug completion:(void (^)(NSString *))completion
{
    NSURLRequest *pageRequest = [ARRouter newRequestForPageContent:slug];
    [self performRequest:pageRequest success:^(id object) {
        if (![object[@"published"] boolValue]) {
            ARErrorLog(@"Accessed unpublished page: %@", object[@"name"]);
            return completion(@"");
        }
        completion(object[@"content"]);

    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        ARErrorLog(@"Error downloading page with slug: %@ - %@", request.URL, error.localizedDescription);
        completion(@"");
    }];
}

@end
