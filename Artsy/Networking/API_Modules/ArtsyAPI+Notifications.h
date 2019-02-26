#import "ArtsyAPI.h"

#import <AFNetworking/AFNetworking.h>


@interface ArtsyAPI (Notifications)

+ (AFHTTPRequestOperation *)markUserNotificationsReadWithSuccess:(void (^)(id response))success
                                                         failure:(void (^)(NSError *error))failure;

@end
