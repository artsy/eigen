#import "ARStubbedShowNetworkModel.h"


@implementation ARStubbedShowNetworkModel

- (instancetype)initWithFair:(Fair *)fair show:(PartnerShow *)show maps:(NSArray *)maps
{
    self = [super initWithFair:fair show:show];
    if (self == nil) {
        return nil;
    }

    _maps = maps;

    return self;
}

- (void)getShowInfo:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure
{
    success(self.show);
}

- (void)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    success(@[]);
}

- (void)getFairBoothArtworksAndInstallShots:(PartnerShow *)show gotInstallImages:(void (^)(NSArray *images))gotInstallImages noImages:(void (^)(void))noImages
{
    if (self.imagesForBoothHeader.count > 0) {
        gotInstallImages(self.imagesForBoothHeader);
    } else {
        noImages();
    }
}

@end
