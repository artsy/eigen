#import <Artsy+UILabels/Artsy+UILabels.h>

@class SaleArtwork;

@interface ARAuctionBidderStateLabel : ARBorderLabel

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork;

@end
