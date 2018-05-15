#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARBidFlowViewController : ARComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@property (nonatomic, copy) NSString *artworkID;
@property (nonatomic, copy) NSString *saleID;

@end

NS_ASSUME_NONNULL_END
