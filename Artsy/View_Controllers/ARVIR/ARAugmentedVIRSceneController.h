@import ARKit;
@class ARAugmentedRealityConfig;

@protocol ARVIRInteractive
- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture;

- (void)restart;
@end

@protocol ARVIRDelegate
- (void)hasRegisteredPlanes;
- (void)hasPlacedArtwork;
@end

/// Controls
@interface ARAugmentedVIRSceneController : NSObject <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate>

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(SCNView *)scene delegate:(id <ARVIRDelegate>)delegate API_AVAILABLE(ios(11.0));

@end
