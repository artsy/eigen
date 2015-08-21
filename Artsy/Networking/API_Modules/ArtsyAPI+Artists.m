#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (Artists)

+ (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    [self getRequest:[ARRouter newArtistInfoRequestWithID:artistID] parseIntoAClass:[Artist class] success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowsRequestForArtist:artistID];
    return [self getRequest:request parseIntoAnArrayOfClass:[PartnerShow class] success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowsRequestForArtistID:artistID inFairID:fairID];
    return [self getRequest:request parseIntoAnArrayOfClass:[PartnerShow class] fromDictionaryWithKey:@"results" success:success failure:failure];
}

@end
