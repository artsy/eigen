#import "ArtsyAPI.h"

@interface ArtsyAPI (RelatedModels)

+ (AFJSONRequestOperation *)getRelatedArtistsForArtist:(Artist *)artist success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork inFair:(Fair *)fair success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getRelatedPostsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)getRelatedPostsForArtist:(Artist *)artist success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;

@end
