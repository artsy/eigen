#import <ORStackView/ORStackView.h>


@interface ARArtworkPriceView : ORStackView

- (void)updateWithArtwork:(Artwork *)artwork;
- (void)updateWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork;

@end
