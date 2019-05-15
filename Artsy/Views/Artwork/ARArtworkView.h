#import <ORStackView/ORStackScrollView.h>
#import "ARArtworkMetadataView.h"
#import "ARArtworkRelatedArtworksView.h"
#import "ARArtworkBlurbView.h"
#import "ARLegacyArtworkViewController.h"

typedef NS_ENUM(NSInteger, ARArtworkViewIndex) {
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

@class ArtsyEcho;

@interface ARArtworkView : ORStackScrollView

@property (nonatomic, strong) ARArtworkMetadataView *metadataView;
@property (nonatomic, strong) ARArtworkRelatedArtworksView *relatedArtworksView;
@property (nonatomic, strong) ORStackView *postsView;
@property (nonatomic, strong) ARArtworkBlurbView *artworkBlurbView;
@property (nonatomic, weak) ARLegacyArtworkViewController *parentViewController;

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair echo:(ArtsyEcho *)echo andParentViewController:(ARLegacyArtworkViewController *)parentViewController;

@property (nonatomic, strong, readonly) Artwork *artwork;
@property (nonatomic, strong, readonly) ArtsyEcho *echo;

@end
