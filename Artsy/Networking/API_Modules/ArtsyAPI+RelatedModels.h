#import "ArtsyAPI.h"


@interface ArtsyAPI (RelatedModels)

+ (AFHTTPRequestOperation *)getRelatedArtistsForArtist:(Artist *)artist success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork inFair:(Fair *)fair success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getRelatedPostsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedPostsForArtist:(Artist *)artist success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;

@end
