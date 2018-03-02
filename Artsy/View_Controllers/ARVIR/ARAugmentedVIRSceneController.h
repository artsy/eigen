@import ARKit;
@class ARAugmentedRealityConfig;

@protocol ARVIRInteractive
- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture;

- (void)placeArtwork;
- (void)restartArtwork;
@end

@interface ARAugmentedVIRSceneController : NSObject <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate>

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(SCNView *)scene API_AVAILABLE(ios(11.0));

@end
