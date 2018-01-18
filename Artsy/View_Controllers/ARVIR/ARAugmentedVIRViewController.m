@import ARKit;
@import SceneKit;

#import "ARFonts.h"
#import "ARSpinner.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/FLKAutoLayout.h>
#import "UIView+HitTestExpansion.h"

#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRViewController.h"


typedef void (^OnboardingStepBlock)(void);

NS_ENUM(NSUInteger, OnboardingStep) {
    OnboardingStepDetectingPlanes,
    OnboardingStepFinishedDetectingPlanes,
    OnboardingStepPlacePhoneOnWall,
    OnboardingStepWallDetected,
    OnboardingStepViewing
};


@interface ARAugmentedVIRViewController () <ARSCNViewDelegate>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong, readonly) ARSCNView *sceneView;

@property (nonatomic, strong, nullable) SCNNode *artwork;
@property (nonatomic, strong, nullable) SCNNode *plane;

@property (nonatomic, strong, nullable) UIView *bgView;
@property (nonatomic, strong, nullable) UILabel *userMessagesLabel;

@property (nonatomic, strong, nullable) UIButton *button;
@property (nonatomic, strong, nullable) ARSpinner *spinner;
@property (nonatomic, strong, nullable) UILabel *textLabel;

@property (nonatomic, copy) NSDictionary<NSNumber *, OnboardingStepBlock> *steps;
@property (nonatomic, assign) NSInteger currentStep;

@property (nonatomic, strong, readonly) ARAugmentedRealityConfig *config;

@property (nonatomic, strong) SCNMaterial *blackMaterial;
@property (nonatomic, strong) SCNMaterial *imageMaterial;
@property (nonatomic, assign) simd_float4x4 placedCameraPosition;

@end

@implementation ARAugmentedVIRViewController

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config  {
    self = [super init];
    if (!self) return nil;

    _config = config;
    _sceneView = [[ARSCNView alloc] init];

    self.steps = @{
       @(OnboardingStepDetectingPlanes) : ^{
            self.textLabel.hidden = NO;
            self.textLabel.text = @"Slowly pan the room with your phone";

            self.button.hidden = YES;
           [self.spinner fadeInAnimated:YES];
        },
        @(OnboardingStepFinishedDetectingPlanes) : ^{
            self.textLabel.hidden = NO;
            self.textLabel.text = @"Slowly pan the room with your phone";

            self.button.hidden = NO;
            [self.spinner fadeInAnimated:YES];
            [self.button setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
        },
        @(OnboardingStepPlacePhoneOnWall): ^{
            self.textLabel.hidden = NO;
            self.textLabel.text = @"Place your phone on the wall where you want to see the work";

            [self.spinner startAnimating];
            self.button.hidden = YES;
        },
        @(OnboardingStepWallDetected): ^{
            self.textLabel.hidden = NO;
            self.textLabel.text = @"Place your phone on the wall where you want to see the work";

            self.button.hidden = NO;
            [self.spinner fadeOutAnimated:YES];
            [self.button setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
        },
        @(OnboardingStepViewing): ^{
            [self placeArt];
            self.textLabel.hidden = YES;

            self.placedCameraPosition = self.sceneView.session.currentFrame.camera.transform;
            self.blackMaterial.transparency = 0.5;
            self.imageMaterial.transparency = 0.5;

            self.button.hidden = NO;
            [self.spinner fadeOutAnimated:YES];
            [self.button setImage:[UIImage imageNamed:@"reset"] forState:UIControlStateNormal];
        }
    };

    return self;
}

- (void)viewDidLoad {
    self.view.backgroundColor = UIColor.whiteColor;
    [super viewDidLoad];

    self.sceneView.frame = self.view.frame;
    [self.view addSubview:self.sceneView];

    // Set the view's delegate
    self.sceneView.delegate = self;
    
    // Show statistics such as fps and timing information
    self.sceneView.showsStatistics = YES;
    
    // Create a new scene
    SCNScene *scene = [[SCNScene alloc] init];
    self.sceneView.debugOptions = ARSCNDebugOptionShowWorldOrigin | ARSCNDebugOptionShowFeaturePoints;

    self.sceneView.scene = scene;

    // Art materials
    SCNMaterial *blackMaterial = [SCNMaterial material];
    blackMaterial.diffuse.contents = [UIColor blackColor];
    blackMaterial.locksAmbientWithDiffuse = YES;
    self.blackMaterial = blackMaterial;

    SCNMaterial *imageMaterial = [[SCNMaterial alloc] init];
    imageMaterial.diffuse.contents = self.config.image;
    imageMaterial.locksAmbientWithDiffuse = YES;
    self.imageMaterial = imageMaterial;

    // Button
    UIButton *button = [[ARMenuButton alloc] init];
    [button ar_extendHitTestSizeByWidth:10 andHeight:10];
    [button setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
    button.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
    button.translatesAutoresizingMaskIntoConstraints = false;
    // Rotate the back button 180' to make it a forwards button
    button.transform = CGAffineTransformMakeRotation(M_PI);

    [button addTarget:self action:@selector(showNextStep) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];

    [self.view addConstraints: @[
        [button.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
        [button.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant: -30.0],
        [button.heightAnchor constraintEqualToConstant:50.0],
        [button.widthAnchor constraintGreaterThanOrEqualToConstant:50.0]
    ]];
    self.button = button;

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    spinner.translatesAutoresizingMaskIntoConstraints = false;
    spinner.spinnerColor = [UIColor whiteColor];

    [self.view addSubview:spinner];
    [self.view addConstraints: @[
        [spinner.centerXAnchor constraintEqualToAnchor:button.centerXAnchor],
        [spinner.centerYAnchor constraintEqualToAnchor:button.centerYAnchor]
    ]];

    self.spinner = spinner;

    // Text label
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
    label.textColor = UIColor.whiteColor;
    label.font = [UIFont serifFontWithSize:24.0];
    label.translatesAutoresizingMaskIntoConstraints = false;
    label.numberOfLines = 0;
    label.lineBreakMode = NSLineBreakByWordWrapping;

    [self.view addSubview:label];

    [self.view addConstraints: @[
        [label.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:12.0],
        [label.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant: -20.0],
        [label.trailingAnchor constraintEqualToAnchor:button.leadingAnchor constant: 12.0]
    ]];
    self.textLabel = label;

    [self showCurrentStep];
}

- (void)showNextStep {
    self.currentStep += 1;
    if (self.currentStep > OnboardingStepViewing) {
        [self reset];
        self.currentStep = OnboardingStepPlacePhoneOnWall;
    }

    [self showCurrentStep];
}

- (void)showCurrentStep {
    self.steps[@(self.currentStep)]();
}

- (void)placeArt {

    CGFloat width = [[[[NSMeasurement alloc] initWithDoubleValue:self.config.size.width
                                                            unit:NSUnitLength.inches]
                      measurementByConvertingToUnit:NSUnitLength.meters]
                     doubleValue];
    
    CGFloat height = [[[[NSMeasurement alloc] initWithDoubleValue:self.config.size.height
                                                             unit:NSUnitLength.inches]
                       measurementByConvertingToUnit:NSUnitLength.meters]
                      doubleValue];

    CGFloat length = [[[[NSMeasurement alloc] initWithDoubleValue:self.config.depth
                                                             unit:NSUnitLength.inches]
                       measurementByConvertingToUnit:NSUnitLength.meters]
                      doubleValue];

    SCNBox *box = [SCNBox boxWithWidth:width height:height length:length chamferRadius:0];

    // TODO: It seems ARKit glitches out and is inconsistent about which face is the front/back.
    // For now, simply showing the image on both sides gets the job done.
    box.materials =  @[self.imageMaterial, self.blackMaterial, self.imageMaterial, self.blackMaterial, self.blackMaterial, self.blackMaterial];

    simd_float4x4 newLocationSimD = self.sceneView.session.currentFrame.camera.transform;
    SCNVector3 newLocation = SCNVector3Make(newLocationSimD.columns[3].x, newLocationSimD.columns[3].y, newLocationSimD.columns[3].z - 0.1);

    self.artwork = [SCNNode nodeWithGeometry:box];
    self.artwork.position = newLocation;
    [self.sceneView.scene.rootNode addChildNode:self.artwork];

    // To properly move the art in the real world, we project a vertical plane we can hitTest against later
    // TODO: I wonder if we can generate this automatically later, rather than having a hidden object in our 3D scene

    // There doesn't appear to be a way to flat-out create an infinite plane.
    // 1000x1000 meters seems like a sensible upper bound that doesn't destroy performance
    SCNPlane *infinitePlane = [SCNPlane planeWithWidth:1000 height:1000];
    self.plane = [SCNNode nodeWithGeometry:infinitePlane];
    self.plane.position = newLocation;
    self.plane.hidden = true;

    [self.sceneView.scene.rootNode addChildNode: self.plane];
}

- (void)reset {
    [self.artwork removeFromParentNode];
    self.artwork = nil;

    [self.plane removeFromParentNode];
    self.plane = nil;

    self.currentStep = OnboardingStepPlacePhoneOnWall;
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    // Create a session configuration
    ARWorldTrackingConfiguration *configuration = [ARWorldTrackingConfiguration new];

    // Run the view's session
    [self.sceneView.session runWithConfiguration:configuration];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    
    // Pause the view's session
    [self.sceneView.session pause];
}

#pragma mark - ARSCNViewDelegate

- (void)session:(ARSession *)session cameraDidChangeTrackingState:(ARCamera *)camera {
    switch (camera.trackingState) {
        case ARTrackingStateNotAvailable:
        case ARTrackingStateLimited:
            if (self.currentStep == OnboardingStepPlacePhoneOnWall) {
                [self showNextStep];
            }
            break;
        case ARTrackingStateNormal:
            if (self.currentStep == OnboardingStepDetectingPlanes) {
                [self showNextStep];
            }
            break;
    }
}

- (void)renderer:(id<SCNSceneRenderer>)renderer didRenderScene:(SCNScene *)scene atTime:(NSTimeInterval)time {
    // If the user is sufficiently far away from the semi-transparent art, fade it in
    if (self.currentStep == OnboardingStepViewing) {
        CGFloat minDistance = 0.2;
        if (ABS(self.placedCameraPosition.columns[3].z - self.sceneView.session.currentFrame.camera.transform.columns[3].z) >= minDistance) {
            // If this gets any more complicated, it might want to become a state transition instead of inline logic (e.g. OnboardingStepPlaced -> OnboardingStepViewing)
            self.blackMaterial.transparency = 1.0;
            self.imageMaterial.transparency = 1.0;
        }
    }
}

- (void)session:(ARSession *)session didFailWithError:(NSError *)error {
    // Present an error message to the user
    
}

- (void)sessionWasInterrupted:(ARSession *)session {
    // Inform the user that the session has been interrupted, for example, by presenting an overlay
    
}

- (void)sessionInterruptionEnded:(ARSession *)session {
    // Reset tracking and/or remove existing anchors if consistent tracking is required
}

- (BOOL)hidesToolbarMenu
{
    return YES;
}

- (BOOL)hidesBackButton
{
    return YES;
}

- (BOOL)hidesBottomBarWhenPushed
{
    return YES;
}


#pragma mark - Touches
/**
 * The current implementation of moving art:
 * When you touch the screen, we check if your point hits the invisible plane
 * that we project out from the art's position (representing the wall, roughly).
 * If yes, immediately move the artwork there.
 */
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(nullable UIEvent *)event {
    if (touches.count != 1) { return; } // TODO
    if (!self.artwork) { return; }

    UITouch *touch = [touches anyObject];
    CGPoint point = [touch locationInView:self.sceneView];

    NSDictionary *options = @{
      SCNHitTestIgnoreHiddenNodesKey: @NO,
      SCNHitTestFirstFoundOnlyKey: @YES,
      SCNHitTestOptionSearchMode: @(SCNHitTestSearchModeAny)
    };

    NSArray <SCNHitTestResult *> *results = [self.sceneView hitTest:point options: options];
    for (SCNHitTestResult *result in results) {
        if ([@[self.plane, self.artwork] containsObject:result.node]) {
            self.artwork.position = result.worldCoordinates;
        }
    }
}

NS_ASSUME_NONNULL_END
@end


