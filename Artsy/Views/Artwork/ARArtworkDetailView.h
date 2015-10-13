/**
    The ARArtworkDetailView is a view for showing artwork metadata
    such such as artist name, artwork name, description, materials,
    size, price and partner.

    Has no intrinsic height as it will generate it based off the content at runtime.
 */

@class Artwork, ARArtworkDetailView, Fair, SaleArtwork;

@protocol ARArtworkDetailViewDelegate <NSObject>
- (void)artworkDetailView:(ARArtworkDetailView *)detailView shouldPresentViewController:(UIViewController *)viewController;
- (void)didUpdateArtworkDetailView:(ARArtworkDetailView *)detailView;
@end

@protocol ARArtworkDetailViewButtonDelegate <NSObject>
- (void)tappedOpenArtworkArtist;
- (void)tappedOpenFair;
- (void)tappedOpenArtworkPartner;
@end


@interface ARArtworkDetailView : ORTagBasedAutoStackView
@property (nonatomic, weak) id<ARArtworkDetailViewDelegate, ARArtworkDetailViewButtonDelegate> delegate;
@property (readonly, nonatomic, strong) Artwork *artwork;
@property (readonly, nonatomic, strong) Fair *fair;
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;

/// Update the view with fair details
- (void)updateWithFair:(Fair *)fair;

/// Update the view with Artwork Details
- (void)updateWithArtwork:(Artwork *)artwork;

/// Update the view with aSale Artwork
- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork;
@end
