#import "ARBidFlowViewController.h"

@implementation ARBidFlowViewController

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
