#import "ArtsyAPI.h"

@class Artist;


@interface ArtsyAPI (Artists)

+ (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

@end
