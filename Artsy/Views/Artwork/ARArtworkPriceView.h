#import <ORStackView/ORStackView.h>

@class Artwork, SaleArtwork;

@interface ARArtworkPriceView : ORStackView

- (void)addContactForPrice;
- (void)addShippingDetails:(Artwork *)artwork;
- (void)updatePriceWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork;

@end
