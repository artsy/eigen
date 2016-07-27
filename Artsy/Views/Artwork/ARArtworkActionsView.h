// Shows contact buttons, or buy buttons, or edition prices, etc

#import <ORStackView/ORStackView.h>

@class Artwork, ARArtworkActionsView;

@protocol ARArtworkActionsViewDelegate <NSObject>
- (void)didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView;
@end

@protocol ARArtworkActionsViewButtonDelegate <NSObject>
- (void)tappedContactGallery;
- (void)tappedAuctionInfo;
- (void)tappedConditionsOfSale;
- (void)tappedBidButton:(UIButton *)button;
- (void)tappedLiveSaleButton:(UIButton *)button;
- (void)tappedBuyersPremium:(UIButton *)button;
- (void)tappedBuyButton;
- (void)tappedMoreInfo;
@end


@interface ARArtworkActionsView : ORStackView
- (instancetype)initWithArtwork:(Artwork *)artwork;
@property (nonatomic, assign) BOOL enabled;
@property (nonatomic, weak) id<ARArtworkActionsViewDelegate, ARArtworkActionsViewButtonDelegate> delegate;
@end
