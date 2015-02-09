@interface ArtsyAPI (Artists)

+ (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getShowsForArtistID:(NSString *)artistID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

@end
