#import "ARFairArtistNetworkModel.h"


@implementation ARFairArtistNetworkModel

- (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure
{
    return [ArtsyAPI getShowsForArtistID:artistID inFairID:fairID success:success failure:failure];
}

- (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    return [ArtsyAPI getArtistForArtistID:artistID success:success failure:failure];
}

@end


@implementation ARStubbedFairArtistNetworkModel

- (AFHTTPRequestOperation *)getShowsForArtistID:(NSString *)artistID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure
{
    if (self.shows) {
        success(self.shows);
        return nil;
    }

    if (failure) {
        failure(nil);
    }
    return nil;
}

- (void)getArtistForArtistID:(NSString *)artistID success:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    if (self.artist) {
        success(self.artist);
        return;
    }

    if (failure) {
        failure(nil);
    }
}

@end
