#import "ARBidFlowViewController.h"

@implementation ARBidFlowViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID saleID:(NSString *)saleID
{
  if ((self = [super initWithEmission:nil
                           moduleName:@"BidFlow"
                    initialProperties:@{ @"artworkID": artworkID, @"saleID": saleID }])) {
    _artworkID = artworkID;
    _saleID = saleID;
  }
  return self;
}

@end
