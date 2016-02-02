#import <Artsy_UILabels/ARLabelSubclasses.h>

@class SaleArtwork;

@interface ARAuctionBidderStateLabel : ARBorderLabel

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork;

@end
