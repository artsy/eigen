#import "ARArtistNetworkModel.h"


@implementation ARArtistNetworkModel

- (instancetype)initWithArtist:(Artist *)artist
{
    self = [super init];
    if (!self) return nil;

    _artist = artist;

    return self;
}

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI getArtistForArtistID:self.artist.artistID success:success failure:failure];
}

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure

{
    [ArtsyAPI getArtistArtworks:self.artist andPage:page withParams:params success:success failure:failure];
}

- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI setFavoriteStatus:status forArtist:self.artist success:success failure:failure];
}

- (AFJSONRequestOperation *)getRelatedArtists:(void (^)(NSArray *artists))success;
{
    return [self.artist getRelatedArtists:success];
}

- (AFJSONRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;
{
    return [self.artist getRelatedPosts:success];
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    [self.artist getFollowState:success failure:failure];
}

@end


@implementation ARStubbedArtistNetworkModel

- (instancetype)initWithArtist:(Artist *)artist
{
    self = [super init];
    if (!self) return nil;

    _artist = artist;

    return self;
}

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    success(self.artistForArtistInfo);
}

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure

{
    if ([params[@"filter[]"] isEqualToString:@"for_sale"]) {
        success(self.forSaleArtworksForArtworksAtPage);
    } else {
        success(self.artworksForArtworksAtPage);
    }
}


- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    success(@{});
}

- (AFJSONRequestOperation *)getRelatedArtists:(void (^)(NSArray *artists))success;
{
    success(@[]);
    return nil;
}

- (AFJSONRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;
{
    success(@[]);
    return nil;
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    success(ARHeartStatusNo);
}

@end
