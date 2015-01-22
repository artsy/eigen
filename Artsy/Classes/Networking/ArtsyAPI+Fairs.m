#import "ArtsyAPI+Private.h"

@implementation ArtsyAPI (Fairs)

+ (void)getFairInfo:(NSString *)fairID success:(void (^)(Fair *fair))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFairInfoRequestWithID:fairID];
    [self getRequest:request parseIntoAClass:Fair.class success:success failure:failure];
}

+ (void)getPartnerShowsForFair:(Fair *)fair success:(void (^)(NSArray *partnerShows))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFairShowsRequestWithFair:fair];
    [self getRequest:request parseIntoAnArrayOfClass:PartnerShow.class fromDictionaryWithKey:@"results" success:success failure:failure];
}

+ (void)getMapInfoForFair:(Fair *)fair success:(void (^)(NSArray *maps))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFairMapRequestWithFair:fair];
    [self getRequest:request parseIntoAnArrayOfClass:Map.class success:success failure:failure];
}

+ (AFJSONRequestOperation *)getArtworkFavoritesForFair:(Fair *)fair success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworkFavoritesRequestWithFair:fair];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (void)getArtistFollowsForFair:(Fair *)fair success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowingArtistsRequestWithFair:fair];
    [self getRequest:request parseIntoAnArrayOfClass:Follow.class success:success failure:failure];
}

+ (void)getProfileFollowsForFair:(Fair *)fair success:(void (^)(NSArray *profiles))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newFollowingProfilesRequestWithFair:fair];
    [self getRequest:request parseIntoAnArrayOfClass:Follow.class success:success failure:failure];
}

@end
