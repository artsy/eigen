#import "ArtsyAPI.h"

@class Fair, FairOrganizer, Profile;

@interface ArtsyAPI (Feed)

+ (void)getFeedResultsForProfile:(Profile *)profile withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairOrganizer:(FairOrganizer *)fairOrganizer withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairShows:(Fair *)fair withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
+ (void)getFeedResultsForFairShows:(Fair *)fair partnerID:(NSString *)partnerID withCursor:(NSString *)cursor success:(void (^)(id JSON))success failure:(void (^)(NSError *error))failure;
@end
