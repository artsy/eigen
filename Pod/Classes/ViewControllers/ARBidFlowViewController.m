#import "ARBidFlowViewController.h"

@implementation ARBidFlowViewController

- (instancetype)initWithSaleArtworkID:(NSString *)saleArtworkID
{
  if ((self = [super initWithEmission:nil
                           moduleName:@"BidFlow"
                    initialProperties:@{ @"saleArtworkID": saleArtworkID }])) {
    _saleArtworkID = saleArtworkID;
  }
  return self;
}

@end
