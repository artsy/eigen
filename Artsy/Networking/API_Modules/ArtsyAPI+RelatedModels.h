#import "ArtsyAPI.h"

@class Artist, Artwork, Fair, Gene;


@interface ArtsyAPI (RelatedModels)

+ (AFHTTPRequestOperation *)getRelatedArtistForArtist:(Artist *)artist excluding:(NSArray *)artistsToExclude success:(void (^)(NSArray *relatedArtist))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedArtistsForArtist:(Artist *)artist excluding:(NSArray *)artistsToExclude success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedGenesForGene:(Gene *)gene excluding:(NSArray *)genesToExclude success:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedGeneForGene:(Gene *)gene excluding:(NSArray *)genesToExclude success:(void (^)(NSArray *relatedGene))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getPopularArtistsWithSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getPopularArtistsFallbackWithSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getPopularGenesWithSuccess:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedArtworksForArtwork:(Artwork *)artwork inFair:(Fair *)fair success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedPostsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRelatedPostsForArtist:(Artist *)artist success:(void (^)(NSArray *posts))success failure:(void (^)(NSError *error))failure;

@end
