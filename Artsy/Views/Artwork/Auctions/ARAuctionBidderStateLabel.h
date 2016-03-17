@import Artsy_UILabels;

@class SaleArtwork;

@interface ARAuctionBidderStateLabel : ARBorderLabel

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork;

@end
