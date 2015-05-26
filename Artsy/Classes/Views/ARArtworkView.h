#import <ORStackView/ORStackScrollView.h>
#import "ARArtworkMetadataView.h"
#import "ARArtworkRelatedArtworksView.h"
#import "ARArtworkBlurbView.h"
#import "ARArtworkViewController.h"

NS_ENUM(NSInteger, ARArtworkViewIndex){
    ARArtworkBanner = 1,
    ARArtworkUnpublishedWarning,
    ARArtworkPreview,
    ARArtworkBlurb,
    ARArtworkSpinner,
    ARArtworkAuctionButton,
    ARArtworkRelatedArtworks,
    ARArtworkRelatedPosts,
    ARArtworkGobbler
};

@interface ARArtworkView : ORStackScrollView

@property (nonatomic, strong) ARArtworkMetadataView *metadataView;
@property (nonatomic, strong) ARArtworkRelatedArtworksView *relatedArtworksView;
@property (nonatomic, strong) ORStackView *postsView;
@property (nonatomic, strong) ARArtworkBlurbView *artworkBlurbView;
@property (nonatomic, weak) ARArtworkViewController *parentViewController;

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair andParentViewController:(ARArtworkViewController *)parentViewController;

@property (nonatomic, strong, readonly) Artwork *artwork;

@end
