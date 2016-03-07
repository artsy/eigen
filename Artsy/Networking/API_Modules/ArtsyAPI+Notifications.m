#import "ArtsyAPI+Notifications.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"
#import "Artwork.h"


@implementation ArtsyAPI (Notifications)

+ (AFHTTPRequestOperation *)getWorksForYouCount:(void (^)(NSUInteger notificationCount))success
                                        failure:(void (^)(NSError *error))failure;
{
    NSURLRequest *request = [ARRouter worksForYouCountRequest];

    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
    [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *op, id __) {
        success((NSUInteger)[op.response.allHeaderFields[@"X-Total-Count"] integerValue]);
    } failure:^(id _, NSError *error) {
        if (failure) failure(error);
    }];
    [operation start];

    return operation;
}

+ (AFHTTPRequestOperation *)getRecommendedArtworksForUser:(NSString *)userID page:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksForYouRequestWithID:userID page:page];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}


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
