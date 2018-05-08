@import OpenGLES;
@import ARKit;

#import "ARDefaults.h"
#import "ARSCNWallNode.h"
#import "SCNArtworkNode.h"
#import "ARAugmentedRealityConfig.h"
#import "ARVIRHorizontalPlaneInteractionController.h"

API_AVAILABLE(ios(11.0))
@interface ARVIRHorizontalPlaneInteractionController()
@property (nonatomic, weak) ARSession *session;
@property (nonatomic, weak) ARSCNView *sceneView;
@property (nonatomic, weak) id <ARVIRDelegate> delegate;
@property (nonatomic, strong) ARAugmentedRealityConfig *config;
@property (nonatomic, strong) NSArray<SCNNode *> *detectedPlanes;
@property (nonatomic, strong) NSArray<SCNNode *> *invisibleFloors;

// The clipped version of the wall while you are setting up
@property (nonatomic, strong) SCNNode *ghostWall;
// The full version of the wall which you fire an artwork at
@property (nonatomic, strong) SCNNode *wall;

// The final version of the artwork shown on a wall
@property (nonatomic, strong) SCNNode *artwork;
// The WIP version of the artwork placed on the `wall` above
@property (nonatomic, strong) SCNNode *ghostArtwork;


@property (nonatomic, assign) BOOL hasSentRegisteredCallback;
@property (nonatomic, assign) CGPoint pointOnScreenForArtworkProjection;
@end

@implementation ARVIRHorizontalPlaneInteractionController

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(ARSCNView *)scene delegate:(id <ARVIRDelegate>)delegate
{
    self = [super init];
    _session = session;
    _sceneView = scene;
    _config = config;

    _invisibleFloors = @[];
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

            // When you want to place down an Artwork
            if ([result.node isEqual:self.wall]) {
                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.position = result.localCoordinates;
                // Pitch, Yaw, Roll
                artwork.eulerAngles = SCNVector3Make(0, 0, M_PI);

                [result.node addChildNode:artwork];

                self.artwork = artwork;
                [self.ghostWall removeFromParentNode];
                return;
            }

            // When you want to place the invisible wall, based on the current ghostWall
            if (!self.wall && [self.invisibleFloors containsObject:result.node]) {
                ARSCNWallNode *wall = [ARSCNWallNode fullWallNode];
                SCNNode *userWall = [SCNNode nodeWithGeometry:wall];
                userWall.position = SCNVector3Make(
                  self.ghostWall.position.x,
                  self.ghostWall.position.y,
                  self.ghostWall.position.z + wall.height/2
                );

                userWall.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
                [result.node addChildNode: userWall];
                [self.ghostWall removeFromParentNode];

                self.wall = userWall;
                self.ghostWall = nil;

                // While the positioning of some of this is still unpredictable, I'd like to keep my
                // notes and other attempts around while I figure out some of the details

                // Try clone the node

//                SCNNode *wall = [self.ghostWall clone];
//                wall.constraints = @[];
//                [wall lookAt:self.sceneView.pointOfView.worldPosition];
//                [result.node.parentNode addChildNode:wall];
//
//                SCNNode *staticCameraReference = [self.sceneView.pointOfView copy];
//                [self.sceneView.pointOfView.parentNode addChildNode:staticCameraReference];

                // Pitch, Yaw, Roll
//
//                SCNLookAtConstraint *lookAtCamera = [SCNLookAtConstraint lookAtConstraintWithTarget:staticCameraReference];
//                lookAtCamera.gimbalLockEnabled = YES;
//                userWall.constraints = @[lookAtCamera];
//

                // When adding as a child node and setting the same as the ghost

//                [result.node addChildNode: userWall];
//                userWall.position = self.ghostWall.position;


//                userWall.transform = self.ghostWall.transform;
//                userWall.orientation = self.ghostWall.orientation;
//                userWall.eulerAngles = self.ghostWall.eulerAngles;
//                userWall.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
//
//
//                userWall.position = SCNVector3Make(
//                 self.ghostWall.position.x,
//                 self.ghostWall.position.y + wall.height,
//                 self.ghostWall.position.z
//               );
//
//                permenentWall.worldTransform = self.ghostWall.worldTransform;
//                [userWall lookAt:self.sceneView.pointOfView.worldPosition];
//                userWall.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
//
//                permenentWall.eulerAngles = self.ghostWall.eulerAngles;
//                permenentWall.rotation = self.ghostWall.world;
//
//                [self.sceneView.scene.rootNode addChildNode:userWall];
            }
        }
    }
}

- (void)restart
{
    [self.ghostWall removeFromParentNode];
    self.ghostWall = nil;

    [self.wall removeFromParentNode];
    self.wall = nil;

    [self.artwork removeFromParentNode];
    self.artwork = nil;
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.0));
{
    // Bail early if we don't have walls to fire at, or have an artwork already up
    if (!self.invisibleFloors.count || self.artwork) {
        return;
    }

    NSDictionary *options = @{
        SCNHitTestIgnoreHiddenNodesKey: @NO,
        SCNHitTestFirstFoundOnlyKey: @YES,
        SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll),
        SCNHitTestBackFaceCullingKey: @NO
    };

    NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForArtworkProjection options: options];
    for (SCNHitTestResult *result in results) {
        
        if ([self.wall isEqual:result.node]) {
            // Create a ghost artwork
            if (!self.ghostArtwork) {
                // TODO add white lines around the artwork

                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.position = result.localCoordinates;
                // Pitch, Yaw, Roll
                artwork.eulerAngles = SCNVector3Make(0, 0, M_PI);
                artwork.opacity = 0.5;

                [result.node addChildNode:artwork];
                self.ghostArtwork = artwork;
            }
            self.ghostArtwork.position = result.localCoordinates;
            return;
        }

        if ([self.invisibleFloors containsObject:result.node]) {
            // Create a ghost wall if we don't have one already
            if (!self.ghostWall) {
                ARSCNWallNode *ghostBox = [ARSCNWallNode shortWallNode];
                SCNNode *ghostWall = [SCNNode nodeWithGeometry:ghostBox];
                ghostWall.opacity = 0.80;

                [result.node addChildNode:ghostWall];

                SCNLookAtConstraint *lookAtCamera = [SCNLookAtConstraint lookAtConstraintWithTarget:self.sceneView.pointOfView];
                lookAtCamera.gimbalLockEnabled = YES;
                ghostWall.constraints = @[lookAtCamera];

                self.ghostWall = ghostWall;
            }

            SCNTransaction.animationDuration = 0.1;
            self.ghostWall.position = result.localCoordinates;
            [self.delegate isShowingGhostWork:YES];
            return;
        }
    }

    if (self.ghostWall) {
        [self.delegate isShowingGhostWork:NO];
        [self.ghostWall removeFromParentNode];
        self.ghostWall = nil;
    }
}

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    // Used to update and re-align vertical planes as ARKit sends new updates for the positioning
    if (!anchor) { return; }
    if (![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }

    // We can get some really gnarly jumps of world positioniing  with this version of ARVIR, I had initially
    // assumed this could be fixed

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

        if ([self.invisibleFloors containsObject:planeNode]) {
            planeNode.position = SCNVector3FromFloat3(planeAnchor.center);
        }
    }
}

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0));
{
    // Only handle adding plane nodes
    if (!anchor) { return; }
    if (![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }
    if (self.invisibleFloors.count) { return; }

    NSLog(@"HILLLO");

    // Send a callback that we're in a state to attach works
    if (!self.hasSentRegisteredCallback) {
        [self.delegate hasRegisteredPlanes];
        self.hasSentRegisteredCallback = YES;
    }

    // Create an anchor node, which can get moved around as we become more sure of where the
    // plane actually is.
    ARPlaneAnchor *planeAnchor = (id)anchor;
    if (@available(iOS 11.3, *)) {
        if (planeAnchor.alignment == ARPlaneAnchorAlignmentVertical) {
            return;
        }
    } else {
        // Fallback on earlier versions
    }

    SCNNode *planeNode = [self whiteBoxForPlaneAnchor:planeAnchor];
    [node addChildNode:planeNode];

    SCNNode *wallNode = [self invisibleWallNodeForPlaneAnchor:planeAnchor];
    [node addChildNode:wallNode];

    self.invisibleFloors = [self.invisibleFloors arrayByAddingObject:wallNode];
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

//    planeNode.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
    return planeNode;
}

- (SCNNode *)invisibleWallNodeForPlaneAnchor:(ARPlaneAnchor *)planeAnchor API_AVAILABLE(ios(11.0))
{
    SCNPlane *hiddenPlane = [SCNPlane planeWithWidth:64 height:64];

    UIColor *planeColor = self.config.debugMode ? [UIColor colorWithRed:0.410 green:0.000 blue:0.775 alpha:0.50] : [UIColor clearColor];

    hiddenPlane.materials.firstObject.diffuse.contents = planeColor;

    SCNNode *hittablePlane = [SCNNode nodeWithGeometry:hiddenPlane];

    SCNVector3 wallCenter = SCNVector3FromFloat3(planeAnchor.center);
    // As we're creating a wall, we want it to be raised higher than it would be lower.
    // E.g. a wall goes more "up" than "down" from the planes y center point
//    wallCenter.y -= 5 * 0.8;
    // The plane will always be a *tiny* bit infront of the wall, so offset a bit
//    wallCenter.x -= 0.1;
    hittablePlane.position = wallCenter;
    hittablePlane.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);

    return hittablePlane;
}

@end
