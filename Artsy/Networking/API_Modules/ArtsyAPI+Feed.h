#import "ArtsyAPI.h"

@class FairOrganizer;

@interface ArtsyAPI (Feed)

+ (void)getFeedResultsForMainFeedWithCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForProfile:(Profile *)profile withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForShowsWithCursor:(NSString *)cursor pageSize:(NSInteger)pageSize success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeaturedWorks:(void (^)(NSArray *works))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairOrganizer:(FairOrganizer *)fairOrganizer withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairShows:(Fair *)fair withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairShows:(Fair *)fair partnerID:(NSString *)partnerID withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
@end
