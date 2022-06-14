#import "ArtsyAPI.h"

#import <AFNetworking/AFHTTPRequestOperation.h>


@interface ArtsyAPI (Notifications)

+ (AFHTTPRequestOperation *)markUserNotificationsReadWithSuccess:(void (^)(id response))success
                                                         failure:(void (^)(NSError *error))failure;

@end
