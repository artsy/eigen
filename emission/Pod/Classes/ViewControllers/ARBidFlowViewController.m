#import "ARBidFlowViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARBidFlowViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID intent:(ARBidFlowViewControllerIntent)intent;
{
    // See implementation in AppRegistry, but we essentially need to switch between the two queries based on intent.
    // See: https://github.com/artsy/emission/blob/e9399cc1b050a18c5fc9d43ddfbef8268b118176/src/lib/AppRegistry.tsx#L93-L123
    if (intent == ARBidFlowViewControllerIntentBid) {
        NSDictionary *variables = @{ @"artworkID": artworkID, @"saleID": saleID };
        return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersBidFlowQuery" variables:variables]];
    } else { // if (intent == ARBidFlowViewControllerIntentRegister) {
        NSDictionary *variables = @{ @"saleID": saleID };
        return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersRegistrationFlowQuery" variables:variables]];
    }
}

- (instancetype)initWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID
{
    return [self initWithArtworkID:artworkID saleID:saleID intent:ARBidFlowViewControllerIntentBid];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID intent:(ARBidFlowViewControllerIntent)intent
{
  NSDictionary *props = @{
                          @"artworkID": artworkID ?: [NSNull null],
                          @"saleID": saleID,
                          @"intent": (intent == ARBidFlowViewControllerIntentBid ? @"bid" : @"register")
  };
  if ((self = [super initWithEmission:nil
                           moduleName:@"BidFlow"
                    initialProperties:props])) {
    _artworkID = artworkID;
    _saleID = saleID;
    _intent = intent;
  }
  return self;
}

@end
