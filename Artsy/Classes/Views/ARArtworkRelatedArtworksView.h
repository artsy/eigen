#import "ARArtworkMasonryModule.h"
#import "ARArtworkViewController.h"

typedef NS_ENUM(NSInteger, ARRelatedArtworksSubviewOrder) {
    ARRelatedArtworksSameShow = 1,
    ARRelatedArtworksSameFair,
    ARRelatedArtworksSameAuction,
    ARRelatedArtworksArtistArtworks,
    ARRelatedArtworks,
};

@class ARArtworkRelatedArtworksView;

@protocol ARArtworkRelatedArtworksViewParentViewController <NSObject>

@required
- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view shouldShowViewController:(UIViewController *)viewController;
- (void)didUpdateRelatedArtworksView:(ARArtworkRelatedArtworksView *)relatedArtworksView;
@optional

- (Fair *)fair;
@end

@interface ARArtworkRelatedArtworksView : ORTagBasedAutoStackView <ARArtworkMasonryLayoutProvider>

@property (nonatomic, weak) ARArtworkViewController<ARArtworkRelatedArtworksViewParentViewController> *parentViewController;

- (instancetype)initWithArtwork:(Artwork *)artwork;

// Use this when showing an artwork in the context of a fair.
- (void)addSectionsForFair:(Fair *)fair;

// Use this when showing an artwork in the context of a show.
- (void)addSectionsForShow:(PartnerShow *)show;

// Use this when showing an artwork in the context of an auction.
- (void)addSectionsForAuction:(Sale *)auction;

// In all other cases, this should be used to simply show related artworks.
- (void)addSectionWithRelatedArtworks;

// TODO Cancel requests really needed? If so, add cancelling back to -[ARArtworkViewController viewDidDisappear:]
// - (void)cancel;

@end
