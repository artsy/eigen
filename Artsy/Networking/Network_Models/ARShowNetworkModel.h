#import <Foundation/Foundation.h>

@class Fair, PartnerShow;

@interface ARShowNetworkModel : NSObject

- (instancetype)initWithFair:(Fair *)fair show:(PartnerShow *)show;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) PartnerShow *show;

- (void)getShowInfo:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure;

- (void)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

- (void)getFairBoothArtworksAndInstallShots:(PartnerShow *)show gotInstallImages:(void (^)(NSArray *images))gotInstallImages noImages:(void (^)(void))noImages;

@end
