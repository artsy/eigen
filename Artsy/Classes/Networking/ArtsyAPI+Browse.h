#import "ArtsyAPI.h"

@interface ArtsyAPI (Browse)

+ (void)getFeaturedLinksForGenesWithSuccess:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;
+ (void)getFeaturedLinkCategoriesForGenesWithSuccess:(void (^)(NSArray *sets))success failure:(void (^)(NSError *error))failure;
+ (void)getPersonalizeGenesWithSuccess:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedLinksWithSuccess:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;

@end
