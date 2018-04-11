#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARBidFlowViewController : ARComponentViewController

- (instancetype)initWithSaleArtworkID:(NSString *)saleArtworkID NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@property (nonatomic, copy) NSString *saleArtworkID;

@end

NS_ASSUME_NONNULL_END
