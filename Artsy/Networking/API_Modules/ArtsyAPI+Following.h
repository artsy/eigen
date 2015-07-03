#import "ArtsyAPI.h"

@class Gene, Artist, Artwork;


@interface ArtsyAPI (Following)

#pragma mark - Artwork

+ (void)setFavoriteStatus:(BOOL)status forArtwork:(Artwork *)artwork success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

+ (void)checkFavoriteStatusForArtwork:(Artwork *)artwork
                              success:(void (^)(BOOL result))success
                              failure:(void (^)(NSError *error))failure;

#pragma mark - Artist

+ (void)checkFavoriteStatusForArtist:(Artist *)artist
                             success:(void (^)(BOOL result))success
                             failure:(void (^)(NSError *error))failure;

+ (void)setFavoriteStatus:(BOOL)status
                forArtist:(Artist *)artist
                  success:(void (^)(id response))success
                  failure:(void (^)(NSError *error))failure;

#pragma mark - Gene

+ (void)checkFavoriteStatusForGene:(Gene *)gene
                           success:(void (^)(BOOL result))success
                           failure:(void (^)(NSError *error))failure;

+ (void)setFavoriteStatus:(BOOL)status
                  forGene:(Gene *)gene
                  success:(void (^)(id response))success
                  failure:(void (^)(NSError *error))failure;

@end
