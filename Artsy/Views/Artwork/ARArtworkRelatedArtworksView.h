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
- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view didAddSection:(UIView *)section;
@optional

- (Fair *)fair;
@end


@interface ARArtworkRelatedArtworksView : ORTagBasedAutoStackView <ARArtworkMasonryLayoutProvider>

@property (nonatomic, weak) ARArtworkViewController<ARArtworkRelatedArtworksViewParentViewController> *parentViewController;

- (void)cancelRequests;

- (void)updateWithArtwork:(Artwork *)artwork;
- (void)updateWithArtwork:(Artwork *)artwork withCompletion:(void (^)(void))completion;

@end
