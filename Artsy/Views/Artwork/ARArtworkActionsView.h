// Shows contact buttons, or buy buttons, or edition prices, etc

#import <ORStackView/ORStackView.h>

@class Artwork, SaleArtwork, ARArtworkActionsView, ArtsyEcho;

@protocol ARArtworkActionsViewDelegate <NSObject>
- (void)didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView;
@end

@protocol ARArtworkActionsViewButtonDelegate <NSObject>
- (void)tappedContactGallery;
- (void)tappedAuctionInfo;
- (void)tappedConditionsOfSale;
- (void)tappedBidButton:(UIButton *)button saleID:(NSString *)saleID;
- (void)tappedLiveSaleButton:(UIButton *)button;
- (void)tappedBuyersPremium:(UIButton *)button;
- (void)tappedBuyButton;
- (void)tappedMakeOfferButton;
- (void)tappedMoreInfo;
@end


@interface ARArtworkActionsView : ORStackView

- (instancetype)initWithArtwork:(Artwork *)artwork echo:(ArtsyEcho *)echo;

- (void)updateUIForSaleArtwork:(SaleArtwork *)saleArtwork;
- (void)showSpinner;

@property (nonatomic, assign) BOOL enabled;
@property (nonatomic, strong, readonly) ArtsyEcho *echo;
@property (nonatomic, weak) id<ARArtworkActionsViewDelegate, ARArtworkActionsViewButtonDelegate> delegate;

@end
