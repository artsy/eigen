#import <ORStackView/ORStackView.h>

@class SaleArtwork;

@interface ARArtworkPriceView : ORStackView

- (void)addContactForPrice;
- (void)addNotForSaleLabel;
- (void)updatePriceWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork;

@end
