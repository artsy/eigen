#import "ARArtistNetworkModel.h"

#import "Artist.h"
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

- (void)setFavoriteStatus:(BOOL)status success:(void (^)(id response))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI setFavoriteStatus:status forArtist:self.artist success:success failure:failure];
}

- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    [self.artist getFollowState:success failure:failure];
}

@end
