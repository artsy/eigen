#import "ARArtworkMasonryModule.h"
#import "ARArtworkViewController.h"

typedef NS_ENUM(NSInteger, ARRelatedArtworksSubviewOrder) {
    ARRelatedArtworksSameShow = 1,
    ARRelatedArtworksSameFair,
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
- (void)updateWithArtwork:(Artwork *)artwork;
- (void)cancel;

- (void)addSectionsForFair:(Fair *)fair;
- (void)addSectionsForShow:(PartnerShow *)show;

@end
