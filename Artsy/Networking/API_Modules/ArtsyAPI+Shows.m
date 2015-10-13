#import "ArtsyAPI+Private.h"
#import "ARRouter.h"


@implementation ArtsyAPI (Shows)

+ (AFHTTPRequestOperation *)getShowInfo:(PartnerShow *)show success:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowInfoRequestWithID:show.showID];
    return [self getRequest:request parseIntoAClass:PartnerShow.class success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getArtworksForShow:(PartnerShow *)show atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromShowRequest:show atPage:page];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getImagesForShow:(PartnerShow *)show atPage:(NSInteger)page success:(void (^)(NSArray *images))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newImagesFromShowRequest:show atPage:page];
    return [self getRequest:request parseIntoAnArrayOfClass:Image.class success:success failure:failure];
}

@end
