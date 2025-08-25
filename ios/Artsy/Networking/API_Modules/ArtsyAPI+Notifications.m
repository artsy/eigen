#import "ArtsyAPI+Notifications.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter+RestAPI.h"
#import "Artwork.h"


@implementation ArtsyAPI (Notifications)

+ (AFHTTPRequestOperation *)markUserNotificationsReadWithSuccess:(void (^)(id response))success
                                                         failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter markNotificationsAsReadRequest];

    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
    [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *op, id __) {
        success(op.response);
    } failure:^(id _, NSError *error) {
        if (failure) failure(error);
    }];
    [operation start];

    return operation;
}

@end
