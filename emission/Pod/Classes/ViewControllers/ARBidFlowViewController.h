#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    ARBidFlowViewControllerIntentBid,
    ARBidFlowViewControllerIntentRegister,
} ARBidFlowViewControllerIntent;

@interface ARBidFlowViewController : ARComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID intent:(ARBidFlowViewControllerIntent)intent;

- (instancetype)initWithArtworkID:(nullable NSString *)artworkID saleID:(NSString *)saleID; /// Defaults to bid.
- (instancetype)initWithArtworkID:(nullable NSString *)artworkID saleID:(NSString *)saleID intent:(ARBidFlowViewControllerIntent)intent;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@property (nonatomic, readonly, copy) NSString *artworkID;
@property (nonatomic, readonly, copy) NSString *saleID;
@property (nonatomic, readonly, assign) ARBidFlowViewControllerIntent intent;

@end

NS_ASSUME_NONNULL_END
