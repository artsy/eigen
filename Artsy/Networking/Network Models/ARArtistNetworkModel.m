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


@end
