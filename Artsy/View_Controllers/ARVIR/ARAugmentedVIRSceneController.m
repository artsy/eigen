@import OpenGLES;
@import ARKit;

#import "SCNArtworkNode.h"
#import "ARAugmentedVIRSceneController.h"

API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRSceneController()
@property (nonatomic, weak) ARSession *session;
@property (nonatomic, weak) ARSCNView *sceneView;
@property (nonatomic, strong) ARAugmentedRealityConfig *config;
@property (nonatomic, strong) NSArray<SCNNode *> *detectedPlanes;
@property (nonatomic, strong) NSArray<SCNNode *> *invisibleWalls;
@property (nonatomic, strong) SCNNode *ghostWork;
@end

NSInteger wallHeight = 5;

@implementation ARAugmentedVIRSceneController

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(ARSCNView *)scene
{
    self = [super init];
    _session = session;
    _sceneView = scene;
    _config = config;
    _invisibleWalls = @[];
    _detectedPlanes = @[];
    return self;
}

- (void)pannedOnScreen:(UIPanGestureRecognizer *)gesture;
{
 // TODO
}

- (void)tappedOnScreen:(UITapGestureRecognizer *)gesture
{
    if (![gesture.view isKindOfClass:SCNView.class]) {
        NSLog(@"Tap wasn't on a SCNView");
        return;
    }

    if (@available(iOS 11.0, *)) {
        ARSCNView *sceneView = (id)gesture.view;

        CGPoint point = [gesture locationOfTouch:0 inView:sceneView];

        NSDictionary *options = @{
            SCNHitTestIgnoreHiddenNodesKey: @NO,
            SCNHitTestFirstFoundOnlyKey: @YES,
            SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
        };

        NSArray <SCNHitTestResult *> *results = [sceneView hitTest:point options: options];
        for (SCNHitTestResult *result in results) {

            if ([self.invisibleWalls containsObject:result.node] || [self.detectedPlanes containsObject:result.node] ) {

                SCNBox *box = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *artwork = [SCNNode nodeWithGeometry:box];
                artwork.position = result.localCoordinates;
                [result.node addChildNode:artwork];
                self.ghostWork.opacity = 0;

                return;
            } else {
                NSLog(@"Childs %@", result.node.childNodes);
            }
        }
    }
}

- (void)placeArtwork {

}


- (void)restartArtwork {

}


- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.0));
{
    if (!self.invisibleWalls.count) {
        return;
    }

    NSDictionary *options = @{
        SCNHitTestIgnoreHiddenNodesKey: @NO,
        SCNHitTestFirstFoundOnlyKey: @YES,
        SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAll)
    };

    NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:self.sceneView.center options: options];
    for (SCNHitTestResult *result in results) {
        if ([self.invisibleWalls containsObject:result.node]) {
            if (!self.ghostWork) {
                SCNArtworkNode *ghostBox = [SCNArtworkNode nodeWithConfig:self.config];
                SCNNode *ghostWork = [SCNNode nodeWithGeometry:ghostBox];
                ghostWork.opacity = 0.5;

                [result.node addChildNode:ghostWork];
                self.ghostWork = ghostWork;
            }

            self.ghostWork.position = result.localCoordinates;
            return;
        }
    }

    if (self.ghostWork) {
        [self.ghostWork removeFromParentNode];
        self.ghostWork = nil;
    }
}

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    // Used to update and re-align vertical planes as ARKit sends new updates for the positioning
    if(!anchor) { return; }
    if(![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }

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
    if(!anchor) { return; }
    if(![anchor isKindOfClass:ARPlaneAnchor.class]) { return; }


    // Create an anchor node, which can get moved around as we become more sure of where the
    // plane actually is.
    ARPlaneAnchor *planeAnchor = (id)anchor;

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
    plane.firstMaterial.diffuse.contents = [[UIColor whiteColor] colorWithAlphaComponent:0.3];

    SCNNode *planeNode = [SCNNode nodeWithGeometry:plane];
    planeNode.position = SCNVector3Make(planeAnchor.center.x, planeAnchor.center.y, planeAnchor.center.z);  //
    planeNode.name = @"Detected Area";

    planeNode.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);
    return planeNode;
}

- (SCNNode *)invisibleWallNodeForPlaneAnchor:(ARPlaneAnchor *)planeAnchor API_AVAILABLE(ios(11.0))
{
    SCNPlane *infinitePlane = [SCNPlane planeWithWidth:32 height:wallHeight];
    infinitePlane.materials.firstObject.diffuse.contents = [UIColor clearColor];

    SCNNode *hittablePlane = [SCNNode nodeWithGeometry:infinitePlane];

    SCNVector3 wallCenter = SCNVector3FromFloat3(planeAnchor.center);
    wallCenter.y -= wallHeight * 0.8;
    wallCenter.x -= 0.1;
    hittablePlane.position = wallCenter;
    hittablePlane.eulerAngles = SCNVector3Make(-M_PI_2, 0, 0);

    return hittablePlane;
}

@end
