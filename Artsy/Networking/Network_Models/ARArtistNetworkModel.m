#import "ARArtistNetworkModel.h"

#import "Artist.h"
#import "ArtsyAPI+Artists.h"
#import "ArtsyAPI+Artworks.h"
#import "ArtsyAPI+Following.h"

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

- (void)getRelatedArtists:(void (^)(NSArray *artists))success;
{
    [self.artist getRelatedArtists:success];
}

- (void)getRelatedPosts:(void (^)(NSArray *posts))success;
{
    [self.artist getRelatedPosts:success];
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

- (void)getRelatedArtists:(void (^)(NSArray *artists))success;
{
    success(@[]);
}

- (void)getRelatedPosts:(void (^)(NSArray *posts))success;
{
    success(@[]);
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    success(ARHeartStatusNo);
}

@end
