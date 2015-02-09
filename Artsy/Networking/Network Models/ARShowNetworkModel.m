#import "ARShowNetworkModel.h"

@interface ARShowNetworkModel ()

@property (nonatomic, strong, readwrite) Fair *fair;
@property (nonatomic, strong, readwrite) PartnerShow *show;

@end

@implementation ARShowNetworkModel

- (instancetype)initWithFair:(Fair *)fair show:(PartnerShow *)show
{
    self = [super init];
    if (self == nil) { return nil; }

    _fair = fair;
    _show = show;

    return self;
}

- (void)getShowInfo:(void (^)(PartnerShow *))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    [ArtsyAPI getShowInfo:_show success:^(PartnerShow *show) {
        @strongify(self);

        if (!self.fair) {
            self.fair = show.fair;
        }

        if (success) {
            success(show);
        }
    } failure:^(NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

- (void)getFairMaps:(void (^)(NSArray *maps))success
{
    [self.fair getFairMaps:^(NSArray *maps) {
        if (success) {
            success(maps);
        }
    }];
}

- (void)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI getArtworksForShow:self.show atPage:page success:^(NSArray *artworks) {
        if (success) {
            success(artworks);
        }
    } failure:^(NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

- (void)getFairBoothArtworksAndInstallShots:(PartnerShow *)show
                           gotInstallImages:(void (^)(NSArray *images))gotInstallImages
                                gotArtworks:(void (^)(NSArray *images))gotArtworkImages
                                   noImages:(void (^)(void))noImages;
{
    [ArtsyAPI getImagesForShow:show atPage:1 success:^(NSArray *images) {
        if (images.count) {
            gotInstallImages(images);

        } else {
            [self downloadArtworksForShow:show gotArtworks:gotArtworkImages noImages:noImages];
        }


    } failure:^(NSError *error) {
        [self downloadArtworksForShow:show gotArtworks:gotArtworkImages noImages:noImages];
    }];
}

- (void)downloadArtworksForShow:(PartnerShow *)show gotArtworks:(void (^)(NSArray *images))gotArtworkImages noImages:(void (^)(void))noImages;
{
    [ArtsyAPI getArtworksForShow:show atPage:1 success:^(NSArray *artworks) {

        NSArray *artworkImages = [[artworks reject:^BOOL(Artwork *artwork) {
            return !artwork.isPublished.boolValue;

        }] map:^id(Artwork *artwork) {
            return artwork.defaultImage;
        }];

        if (artworkImages.count) {
            gotArtworkImages(artworkImages);

        } else {
            noImages();
        }

    } failure:^(NSError *error) {
        noImages();
    }];
}


@end
