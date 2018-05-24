@import OpenGLES;
@import ARKit;

#import "ARDefaults.h"
#import "SCNArtworkNode.h"
#import "ARAugmentedRealityConfig.h"
#import "ARVIRVerticalWallInteractionController.h"

API_AVAILABLE(ios(11.0))
@interface ARVIRVerticalWallInteractionController()
@property (nonatomic, weak) ARSession *session;
@property (nonatomic, weak) ARSCNView *sceneView;
@property (nonatomic, weak) id <ARVIRDelegate> delegate;
@property (nonatomic, strong) ARAugmentedRealityConfig *config;
@property (nonatomic, strong) NSArray<SCNNode *> *detectedPlanes;
@property (nonatomic, strong) NSArray<SCNNode *> *invisibleWalls;
@property (nonatomic, strong) SCNNode *ghostWork;
@property (nonatomic, strong) SCNNode *artwork;
@property (nonatomic, assign) BOOL hasSentRegisteredCallback;
@property (nonatomic, assign) CGPoint pointOnScreenForArtworkProjection;
@end

NSInteger wallHeightMeters = 5;

@implementation ARVIRVerticalWallInteractionController

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(ARSCNView *)scene delegate:(id <ARVIRDelegate>)delegate
{
    self = [super init];
    _session = session;
    _sceneView = scene;
    _config = config;
    _invisibleWalls = @[];
    _detectedPlanes = @[];
    _delegate = delegate;
    CGRect bounds = [UIScreen mainScreen].bounds;
    _pointOnScreenForArtworkProjection = CGPointMake(bounds.size.width/2, bounds.size.height/2);
    return self;
}

- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
{
    if (gesture.numberOfTouches) {
        self.pointOnScreenForArtworkProjection = [gesture locationOfTouch:0 inView:gesture.view];
    }
}

- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture
{
    // NOOP
}

- (void)placeArtwork
{
    if (@available(iOS 11.0, *)) {
        NSDictionary *options = @{
            SCNHitTestIgnoreHiddenNodesKey: @NO,
            SCNHitTestFirstFoundOnlyKey: @YES,
            SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
        };

        NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForArtworkProjection options: options];
        for (SCNHitTestResult *result in results) {

            // Raycast the current artwork on to the invisible wall, and make the ghost invisible
            if ([self.invisibleWalls containsObject:result.node] || [self.detectedPlanes containsObject:result.node] ) {
                [[NSUserDefaults standardUserDefaults] setBool:YES forKey:ARAugmentedRealityHasSuccessfullyRan];

                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.position = result.localCoordinates;
                [result.node addChildNode:artwork];

                self.artwork = artwork;
                self.ghostWork.opacity = 0;

                [self.delegate hasPlacedArtwork];
                return;
            }
        }
    }
}

- (void)restart
{
    [self.ghostWork removeFromParentNode];
    self.ghostWork = nil;

    [self.artwork removeFromParentNode];
    self.artwork = nil;
}

- (void)placeWall
{

}


- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.0));
{
    // Bail early if we don't have walls to fire at, or have an artwork already up
    if (!self.invisibleWalls.count || self.artwork) {
        return;
    }

    NSDictionary *options = @{
        SCNHitTestIgnoreHiddenNodesKey: @NO,
        SCNHitTestFirstFoundOnlyKey: @YES,
        SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
    };

    NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForArtworkProjection options: options];
    for (SCNHitTestResult *result in results) {
        if ([self.invisibleWalls containsObject:result.node]) {
            // Create a ghost work if we don't have one already
            if (!self.ghostWork) {
                SCNArtworkNode *ghostBox = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *ghostWork = [SCNNode nodeWithGeometry:ghostBox];
                ghostWork.opacity = 0.55;

                [result.node addChildNode:ghostWork];
                self.ghostWork = ghostWork;
            }

            SCNTransaction.animationDuration = 0.1;
            self.ghostWork.position = result.localCoordinates;
            [self.delegate isShowingGhostWork:YES];
            return;
        }
    }

    if (self.ghostWork) {
        [self.delegate isShowingGhostWork:NO];
        [self.ghostWork removeFromParentNode];
        self.ghostWork = nil;
    }
}

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    // Used to update and re-align vertical planes as ARKit sends new updates for the positioning
    if (!anchor) { return; }
    if (![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }

    // Animate instead of jumping positions
    SCNTransaction.animationDuration = 0.1;
    ARPlaneAnchor *planeAnchor = (id)anchor;

    for (SCNNode *planeNode in node.childNodes) {
        SCNPlane *plane = (id)planeNode.geometry;

        if ([self.detectedPlanes containsObject:planeNode]) {
            plane.width = planeAnchor.extent.x;
            plane.height = planeAnchor.extent.z;
            planeNode.position = SCNVector3FromFloat3(planeAnchor.center);
        }

        if ([self.invisibleWalls containsObject:planeNode]) {
            planeNode.position = SCNVector3FromFloat3(planeAnchor.center);
        }
    }
}

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0));
{
    // Only handle adding plane nodes
    if (!anchor) { return; }
    if (![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }

    // Send a callback that we're in a state to attach works
    if (!self.hasSentRegisteredCallback) {
        [self.delegate hasRegisteredPlanes];
        self.hasSentRegisteredCallback = YES;
    }

    // Create an anchor node, which can get moved around as we become more sure of where the
    // plane actually is.
    ARPlaneAnchor *planeAnchor = (id)anchor;
    if (planeAnchor.alignment == ARPlaneAnchorAlignmentHorizontal) {
        return;
    }

    SCNNode *planeNode = [self whiteBoxForPlaneAnchor:planeAnchor];
    [node addChildNode:planeNode];

    SCNNode *wallNode = [self invisibleWallNodeForPlaneAnchor:planeAnchor];
    [node addChildNode:wallNode];

    self.invisibleWalls = [self.invisibleWalls arrayByAddingObject:wallNode];
    self.detectedPlanes = [self.detectedPlanes arrayByAddingObject:planeNode];
}

- (SCNNode *)whiteBoxForPlaneAnchor:(ARPlaneAnchor *)planeAnchor API_AVAILABLE(ios(11.0))
{
    SCNPlane *plane = [SCNPlane planeWithWidth:planeAnchor.extent.x height:planeAnchor.extent.z];
    UIColor *planeColor = self.config.debugMode ? [[UIColor whiteColor] colorWithAlphaComponent:0.3] : [UIColor clearColor];
    plane.firstMaterial.diffuse.contents = planeColor;

    SCNNode *planeNode = [SCNNode nodeWithGeometry:plane];
    planeNode.position = SCNVector3Make(planeAnchor.center.x, planeAnchor.center.y, planeAnchor.center.z);
    planeNode.name = @"Detected Area";

    planeNode.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
    return planeNode;
}

- (SCNNode *)invisibleWallNodeForPlaneAnchor:(ARPlaneAnchor *)planeAnchor API_AVAILABLE(ios(11.0))
{
    SCNPlane *hiddenPlane = [SCNPlane planeWithWidth:32 height:wallHeightMeters];

    UIColor *planeColor = self.config.debugMode ? [UIColor colorWithRed:0.410 green:0.000 blue:0.775 alpha:0.50] : [UIColor clearColor];

    hiddenPlane.materials.firstObject.diffuse.contents = planeColor;

    SCNNode *hittablePlane = [SCNNode nodeWithGeometry:hiddenPlane];

    SCNVector3 wallCenter = SCNVector3FromFloat3(planeAnchor.center);
    // As we're creating a wall, we want it to be raised higher than it would be lower.
    // E.g. a wall goes more "up" than "down" from the planes y center point
    wallCenter.y -= wallHeightMeters * 0.8;
    // The plane will always be a *tiny* bit infront of the wall, so offset a bit
    wallCenter.x -= 0.1;
    hittablePlane.position = wallCenter;
    hittablePlane.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);

    return hittablePlane;
}

@end
