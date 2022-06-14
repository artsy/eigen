@import UIKit;
@class ARAugmentedRealityConfig;

/** What callbacks from user actions should the host VC pass to the interaction controller */
@protocol ARVIRInteractive
- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture;

- (void)placeWall;
- (void)placeArtwork;
- (void)restart;
@end

/** Callbacks for UI changes */
@protocol ARVIRDelegate
- (void)hasRegisteredPlanes;
- (void)isShowingGhostWall:(BOOL)showing;
- (void)isShowingGhostWork:(BOOL)showing;
- (void)hasPlacedArtwork;
- (void)hasPlacedWall;
@end

/**
 A view controller which handles interacting with an VIRInteractionController to
 present a view in room experience.
 */
@interface ARAugmentedFloorBasedVIRViewController : UIViewController <ARVIRDelegate>

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config API_AVAILABLE(ios(11.3));

@property (readonly, nonatomic) ARAugmentedRealityConfig *config;

// Used to exit AR
- (void)exitARContext;

// Time spent in AR, in seconds
- (NSTimeInterval)timeInAR;
@end
