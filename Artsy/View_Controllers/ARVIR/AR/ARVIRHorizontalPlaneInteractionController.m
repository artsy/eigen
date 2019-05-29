@import OpenGLES;
@import ARKit;
@import SceneKit;

#import "ARDefaults.h"
#import "ARAppConstants.h"
#import "ARSCNWallNode.h"
#import "SCNArtworkNode.h"
#import "ARAugmentedRealityConfig.h"
#import "ARVIRHorizontalPlaneInteractionController.h"
#import "ARDispatchManager.h"

typedef NS_ENUM(NSInteger, ARHorizontalVIRMode) {
    ARHorizontalVIRModeLaunching,
    ARHorizontalVIRModeDetectedFloor,
    ARHorizontalVIRModeDetectedFloorPostTransition,
    ARHorizontalVIRModeCreatedWall,
    ARHorizontalVIRModePlacedOnWall
};

API_AVAILABLE(ios(11.0))
@interface ARVIRHorizontalPlaneInteractionController()
@property (nonatomic, weak) ARSession *session;
@property (nonatomic, weak) ARSCNView *sceneView;
@property (nonatomic, weak) id <ARVIRDelegate> delegate;
@property (nonatomic, strong) ARAugmentedRealityConfig *config;

@property (nonatomic, assign) ARHorizontalVIRMode state;
@property (nonatomic, strong) SCNNode *pointCloudNode;

@property (nonatomic, strong) NSArray<SCNNode *> *detectedPlanes;
@property (nonatomic, strong) NSArray<SCNNode *> *invisibleFloors;

// The clipped line of the wall while you are setting up
@property (nonatomic, strong) SCNNode *ghostWallLine;
// So we can animate it out on the first time
@property (nonatomic, assign) BOOL hasShownGhostWallLineOnce;

// The full version of the wall which you fire an artwork at
@property (nonatomic, strong) SCNNode *wall;

// The final version of the artwork shown on a wall
@property (nonatomic, strong) SCNNode *artwork;
// The WIP version of the artwork placed on the `wall` abovea
@property (nonatomic, strong) SCNNode *ghostArtwork;

@property (nonatomic, assign) CGPoint pointOnScreenForArtworkProjection;
@property (nonatomic, assign) CGPoint pointOnScreenForWallProjection;

@end

NSInteger attempt = 0;

@implementation ARVIRHorizontalPlaneInteractionController

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(ARSCNView *)scene delegate:(id <ARVIRDelegate>)delegate
{
    if ((self = [super init])) {
        _session = session;
        _sceneView = scene;
        _config = config;
        _delegate = delegate;
        [self restart];
    }
    return self;
}

- (void)restart API_AVAILABLE(ios(11.0));
{
    self.hasShownGhostWallLineOnce = NO;
    self.state = ARHorizontalVIRModeLaunching;

    CGRect bounds = [UIScreen mainScreen].bounds;
    self.pointOnScreenForWallProjection = CGPointMake(bounds.size.width/2, bounds.size.height/2);
    // Use a subset of the screen for centering, the 221 comes from the height of the UI in the ARAugmentedVIRVC
    self.pointOnScreenForArtworkProjection = CGPointMake(bounds.size.width/2, (bounds.size.height - 221) /2 );

    self.detectedPlanes = @[];
    self.invisibleFloors = @[];

    [self.pointCloudNode removeFromParentNode];
    self.pointCloudNode = nil;

    [self.ghostWallLine removeFromParentNode];
    self.ghostWallLine = nil;

    [self.wall removeFromParentNode];
    self.wall = nil;

    [self.artwork removeFromParentNode];
    self.artwork = nil;

    [self.ghostArtwork removeFromParentNode];
    self.ghostArtwork = nil;

    [self.session runWithConfiguration:self.session.configuration
                               options:ARSessionRunOptionResetTracking | ARSessionRunOptionRemoveExistingAnchors];
}

- (void)setState:(ARHorizontalVIRMode)state
{
    _state = state;

    // Also handle vibrations on state changes
    switch (state) {
        case ARHorizontalVIRModeLaunching:
            break;
        case ARHorizontalVIRModeDetectedFloor: {
            [self.delegate hasRegisteredPlanes];
            [self vibrate:UIImpactFeedbackStyleHeavy];
            ar_dispatch_after(2, ^{
                  self.state = ARHorizontalVIRModeDetectedFloorPostTransition;
            });
            break;
        }
        case ARHorizontalVIRModeDetectedFloorPostTransition:
            [self fadeOutPointCloud];
            break;
        case ARHorizontalVIRModeCreatedWall:
            [self.delegate hasPlacedWall];
            [self vibrate:UIImpactFeedbackStyleHeavy];
            break;
        case ARHorizontalVIRModePlacedOnWall:
            [self.delegate hasPlacedArtwork];
            [self vibrate:UIImpactFeedbackStyleHeavy];
            break;
    }
}

- (void)vibrate:(UIImpactFeedbackStyle)style
{
    ar_dispatch_main_queue(^{
        if (@available(iOS 10.0, *)) {
            UIImpactFeedbackGenerator *impact = [[UIImpactFeedbackGenerator alloc] initWithStyle:style];
            [impact prepare];
            [impact impactOccurred];
        }
    });
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
    attempt++;
    NSLog(@"Attempt: %@", @(attempt));
}


- (void)placeWall
{
    if (@available(iOS 11.3, *)) {
        NSDictionary *options = @{
            SCNHitTestIgnoreHiddenNodesKey: @NO,
            SCNHitTestFirstFoundOnlyKey: @YES,
            SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
        };

        NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForWallProjection options:options];
        for (SCNHitTestResult *result in results) {

            // When you want to place the invisible wall, based on the current ghostWall
            if (!self.wall && [self.invisibleFloors containsObject:result.node]) {

                ARSCNWallNode *wall = [ARSCNWallNode fullWallNode];
                SCNNode *userWall = [SCNNode nodeWithGeometry:wall];
                [result.node addChildNode:userWall];

                userWall.position = result.localCoordinates;
                userWall.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);

                SCNVector3 userPosition = self.sceneView.pointOfView.position;
                SCNVector3 bottomPosition = SCNVector3Make(userPosition.x, result.worldCoordinates.y, userPosition.z);
                [userWall lookAt:bottomPosition];

                userWall.position = SCNVector3Make(userWall.position.x, userWall.position.y, userWall.position.z + [ARSCNWallNode wallHeight] / 2);

                self.wall = userWall;

                self.state = ARHorizontalVIRModeCreatedWall;
                return;
            }
        }
    }
}


- (void)placeArtwork
{
    if (@available(iOS 11.3, *)) {
        NSDictionary *options = @{
            SCNHitTestIgnoreHiddenNodesKey: @NO,
            SCNHitTestFirstFoundOnlyKey: @YES,
            SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
        };

        NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForArtworkProjection options: options];
        for (SCNHitTestResult *result in results) {

            // When you want to place down an Artwork
            if ([result.node isEqual:self.wall]) {
                SCNBox *shadowBox = [SCNArtworkNode shadowNodeWithConfig:self.config];
                SCNNode *shadow = [SCNNode nodeWithGeometry:shadowBox];
                // Offset the shadow back a bit (behind the work)
                // and down a bit to imply a higher light source
                shadow.position =  SCNVector3Make(result.localCoordinates.x, result.localCoordinates.y, result.localCoordinates.z + shadowBox.length / 2);
                shadow.opacity = 0.4;
                shadow.eulerAngles = SCNVector3Make(0, 0, -M_PI);
                [result.node addChildNode:shadow];

                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.position = result.localCoordinates;
                artwork.eulerAngles = SCNVector3Make(0, 0, -M_PI);
                [result.node addChildNode:artwork];

                self.artwork = artwork;
                [self.ghostWallLine removeFromParentNode];
                [self.ghostArtwork removeFromParentNode];

                self.state = ARHorizontalVIRModePlacedOnWall;
                return;
            }
        }
    }
}

- (void)fadeOutPointCloud
{
    SCNAction *fade = [SCNAction fadeOutWithDuration: ARAnimationDuration * 2];
    [self.pointCloudNode runAction:fade completionHandler:^{
        ar_dispatch_main_queue(^{
            if (self.pointCloudNode) {
                [self.pointCloudNode removeFromParentNode];
                self.pointCloudNode = nil;
            }
        });
    }];
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.3));
{
    switch (self.state) {
        case ARHorizontalVIRModeLaunching:
        case ARHorizontalVIRModeDetectedFloor: {
            [self renderWhileFindingFloor:frame];
            break;
        }

        case ARHorizontalVIRModeDetectedFloorPostTransition: {
            [self renderWhenPlacingWall:frame];
            break;
        }

        case ARHorizontalVIRModeCreatedWall: {
            [self renderWhenPlacingArtwork:frame];
            break;
        }

        case ARHorizontalVIRModePlacedOnWall: break;
    }
}

- (void)renderWhileFindingFloor:(ARFrame *)frame API_AVAILABLE(ios(11.0));
{
    NSInteger pointCount = frame.rawFeaturePoints.count;
    if (pointCount) {
        // We want a root node to work in, it's going to hold the all of the represented spheres
        // that come together to make the point cloud
        if (!self.pointCloudNode) {
            self.pointCloudNode = [SCNNode node];
            [self.sceneView.scene.rootNode addChildNode:self.pointCloudNode];
        }

        // It's going to need some colour
        SCNMaterial *whiteMaterial = [SCNMaterial material];
        whiteMaterial.diffuse.contents = [UIColor whiteColor];
        whiteMaterial.locksAmbientWithDiffuse = YES;

        // Remove the old point clouds (this happens per-frame
        for (SCNNode *child in self.pointCloudNode.childNodes) {
            [child removeFromParentNode];
        }

        // Use the frames point cloud to create a set of SCNSpheres
        // which live at the feature point in the AR world
        for (NSInteger i = 0; i < pointCount; i++) {
            vector_float3 point = frame.rawFeaturePoints.points[i];
            SCNVector3 vector = SCNVector3Make(point[0], point[1], point[2]);

            SCNSphere *pointSphere = [SCNSphere sphereWithRadius:0.004];
            pointSphere.materials = @[whiteMaterial];

            SCNNode *pointNode = [SCNNode nodeWithGeometry:pointSphere];
            pointNode.position = vector;

            [self.pointCloudNode addChildNode:pointNode];
        }
    }
}

- (void)renderWhenPlacingWall:(ARFrame *)frame API_AVAILABLE(ios(11.0));
{
    NSDictionary *options = @{
        SCNHitTestIgnoreHiddenNodesKey: @NO,
        SCNHitTestFirstFoundOnlyKey: @YES,
        SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll),
        SCNHitTestBackFaceCullingKey: @NO
    };

    NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.pointOnScreenForWallProjection options: options];
    for (SCNHitTestResult *result in results) {

        if ([self.invisibleFloors containsObject:result.node]) {
            // Create a ghost wall if we don't have one already
            if (!self.ghostWallLine) {
                ARSCNWallNode *ghostBox = [ARSCNWallNode shortWallNode];

                SCNNode *ghostWall = [SCNNode nodeWithGeometry:ghostBox];
                ghostWall.opacity = 0.80;

                [result.node addChildNode:ghostWall];

                SCNLookAtConstraint *lookAtCamera = [SCNLookAtConstraint lookAtConstraintWithTarget:self.sceneView.pointOfView];
                lookAtCamera.gimbalLockEnabled = YES;
                ghostWall.constraints = @[lookAtCamera];

                self.ghostWallLine = ghostWall;

                // Handle a one-off animation
                if(!self.hasShownGhostWallLineOnce) {
                    self.hasShownGhostWallLineOnce = true;

                    ghostBox.width = 0.01;

                    CABasicAnimation *animation = [CABasicAnimation animationWithKeyPath:@"width"];
                    animation.fromValue = @0.01;
                    animation.toValue = @(10);
                    animation.duration = 5;
                    animation.autoreverses = NO;
                    animation.repeatCount = 0;
                    [ghostBox addAnimation:animation forKey:@"width"];

                    ghostBox.width = 10;
                }
            }

            SCNTransaction.animationDuration = 0.04;
            self.ghostWallLine.position = result.localCoordinates;
            [self.delegate isShowingGhostWall:YES];
            return;
        }
    }

    if (self.ghostWallLine) {
        [self.delegate isShowingGhostWall:NO];
        [self.ghostWallLine removeFromParentNode];
        self.ghostWallLine = nil;
    }
}


- (void)renderWhenPlacingArtwork:(ARFrame *)frame API_AVAILABLE(ios(11.3));
{
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
                // Artwork + Outline live inside this node
                SCNNode *rootNode = [SCNNode node];
                rootNode.position = result.localCoordinates;
                rootNode.eulerAngles = SCNVector3Make(0, 0, -M_PI);

                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.opacity = 0.5;

                SCNNode *outline = [SCNArtworkNode ghostOutlineNodeWithConfig:self.config];

                [rootNode addChildNode:outline];
                [rootNode addChildNode:artwork];
                [result.node addChildNode:rootNode];

                self.ghostArtwork = rootNode;
            }

            self.ghostArtwork.position = result.localCoordinates;
            [self.delegate isShowingGhostWork:YES];
            return;
        }
    }

    if (self.ghostArtwork) {
        [self.delegate isShowingGhostWork:NO];
        [self.ghostArtwork removeFromParentNode];
        self.ghostArtwork = nil;
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

    if (self.state == ARHorizontalVIRModeLaunching) {
        self.state = ARHorizontalVIRModeDetectedFloor;
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

    SCNNode *wallNode = [self invisibleWallNodeForPlaneAnchor:planeAnchor];
    [node addChildNode:wallNode];

    self.invisibleFloors = [self.invisibleFloors arrayByAddingObject:wallNode];
}

- (SCNNode *)invisibleWallNodeForPlaneAnchor:(ARPlaneAnchor *)planeAnchor API_AVAILABLE(ios(11.0))
{
    SCNPlane *hiddenPlane = [SCNPlane planeWithWidth:64 height:64];

    UIColor *planeColor = self.config.debugMode ? [UIColor colorWithRed:0.410 green:0.000 blue:0.775 alpha:0.50] : [UIColor clearColor];
    hiddenPlane.materials.firstObject.diffuse.contents = planeColor;

    SCNNode *hittablePlane = [SCNNode nodeWithGeometry:hiddenPlane];
    SCNVector3 wallCenter = SCNVector3FromFloat3(planeAnchor.center);

    hittablePlane.position = wallCenter;
    hittablePlane.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);

    return hittablePlane;
}

@end
