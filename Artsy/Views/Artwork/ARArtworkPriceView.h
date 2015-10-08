#import <ORStackView/ORStackView.h>


@interface ARArtworkPriceView : ORStackView

- (void)addNotForSaleLabel;
- (void)updatePriceWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork;

@end
