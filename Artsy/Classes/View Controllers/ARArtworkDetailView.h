/**
    The ARArtworkDetailView is a view for showing artwork metadata
    such such as artist name, artwork name, description, materials,
    size, price and partner.

    Has no intrinsic height as it will generate it based off the content at runtime.
 */

@class ARArtworkDetailView;

@protocol ARArtworkDetailViewDelegate <NSObject>
- (void)artworkDetailView:(ARArtworkDetailView *)detailView shouldPresentViewController:(UIViewController *)viewController;
- (void)didUpdateArtworkDetailView:(ARArtworkDetailView *)detailView;
@end

@interface ARArtworkDetailView : ORTagBasedAutoStackView
@property (nonatomic, weak) id<ARArtworkDetailViewDelegate> delegate;
@property(readonly, nonatomic, strong) Artwork *artwork;
@property(readonly, nonatomic, strong) Fair *fair;
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;
- (void)updateWithFair:(Fair *)fair;
- (void)updateWithArtwork:(Artwork *)artwork;
@end
