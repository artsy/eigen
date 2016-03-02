#import "ArtsyAPI.h"

#import <AFNetworking/AFNetworking.h>


@interface ArtsyAPI (Notifications)

+ (AFHTTPRequestOperation *)getWorksForYouCount:(void (^)(NSUInteger notificationCount))success
                                        failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getRecommendedArtworksForUser:(NSString *)userID page:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)markUserNotificationsReadWithSuccess:(void (^)(id response))success
                                                         failure:(void (^)(NSError *error))failure;

@end
