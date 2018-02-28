@import ARKit;
@import SceneKit;

#import "ARFonts.h"
#import "ARSpinner.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/FLKAutoLayout.h>
#import "UIView+HitTestExpansion.h"

#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRViewController.h"
#import "ARAugmentedVIRSceneController.h"

typedef void (^OnboardingStepBlock)(void);

NS_ENUM(NSUInteger, OnboardingStep) {
    OnboardingStepDetectingPlanes,
    OnboardingStepFinishedDetectingPlanes,
    OnboardingStepPlacePhoneOnWall,
    OnboardingStepWallDetected,
    OnboardingStepViewing
};


API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRViewController () <ARSCNViewDelegate>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong, readonly) ARSCNView *sceneView;

@property (nonatomic, strong) id <ARSCNViewDelegate, ARVIRInteractive, ARSessionObserver> visualsDelegate;


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

    if (@available(iOS 11.0, *)) {
        _sceneView = [[ARSCNView alloc] init];
        _visualsDelegate = [[ARAugmentedVIRSceneController alloc] initWithSession:_sceneView.session config:config scene:_sceneView];
    }

    self.steps = @{
       @(OnboardingStepDetectingPlanes) : ^{
            self.textLabel.hidden = NO;
            self.textLabel.text = @"Aim at an object on the wall and move your phone in a circle.";

            self.button.hidden = YES;
            [self.spinner fadeInAnimated:YES];
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
        [label.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant: -40.0],
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

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor
{
    [self.visualsDelegate renderer:renderer didUpdateNode:node forAnchor:anchor];
}

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor;
{
    [self.visualsDelegate renderer:renderer didAddNode:node forAnchor:anchor];
}

- (void)renderer:(id<SCNSceneRenderer>)renderer willRenderScene:(SCNScene *)scene atTime:(NSTimeInterval)time
{
    [self.visualsDelegate renderer:renderer willRenderScene:scene atTime:time];
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame;
{
    [self.visualsDelegate session:session didUpdateFrame:frame];
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


