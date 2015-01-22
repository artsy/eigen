#import "ARArtworkMasonryModule.h"
#import "ARArtworkViewController.h"
@class ARArtworkRelatedArtworksView;

@protocol ARArtworkRelatedArtworksViewParentViewController <NSObject>

@required
- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view shouldShowViewController:(UIViewController *)viewController;
- (void)didUpdateRelatedArtworksView:(ARArtworkRelatedArtworksView *)relatedArtworksView;
@optional

- (Fair *)fair;
@end

@interface ARArtworkRelatedArtworksView : ORStackView <ARArtworkMasonryLayoutProvider>

@property (nonatomic, weak) ARArtworkViewController<ARArtworkRelatedArtworksViewParentViewController> *parentViewController;

- (void)updateWithArtwork:(Artwork *)artwork;
- (void)cancel;

@end
