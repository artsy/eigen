#import "ArtsyAPI.h"

@interface ArtsyAPI (Browse)

+ (void)getBrowseMenuFeedLinksWithSuccess:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure;

@end
