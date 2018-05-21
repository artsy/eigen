@class ARAugmentedRealityConfig;
@import ARKit;

/** What callbacks from user actions should the host VC pass to the interaction controller */
@protocol ARVIRInteractive
- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture;

- (void)placeArtwork;
- (void)restart;
@end

/** Callbacks for UI changes */
@protocol ARVIRDelegate
- (void)hasRegisteredPlanes;
- (void)isShowingGhostWork:(BOOL)showing;
- (void)hasPlacedArtwork;
@end

/**
 When building out the AR interactions we went through _many_ interactions. So this class
 represents the actual work in AR, it's expected to become the ARSCNView's delegate, and have a
 set of ARSessionDelegates called to it.

 This class should handle all SceneKit and ARKit object rendering, and attaching. From there
 it will send messages back when important user actions via the ARVIRDelegate.

 The abstraction is being that when making new interactions you can just copy & paste this file, rename it,
 and assign the new object in the ARViewController.
 */
@interface ARVIRVerticalWallInteractionController : NSObject <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate>

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(SCNView *)scene delegate:(id <ARVIRDelegate>)delegate API_AVAILABLE(ios(11.0));

@end
