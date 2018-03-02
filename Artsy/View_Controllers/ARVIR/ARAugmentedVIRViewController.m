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

API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRViewController () <ARSCNViewDelegate, ARSessionDelegate>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong, readonly) ARSCNView *sceneView;

@property (nonatomic, strong) id <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate> visualsDelegate;

@property (nonatomic, strong, nullable) UIButton *button;
@property (nonatomic, strong, nullable) UILabel *textLabel;

@property (nonatomic, strong, readonly) ARAugmentedRealityConfig *config;

@end

@implementation ARAugmentedVIRViewController

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config
{
    self = [super init];
    if (!self) return nil;

    _config = config;

    if (@available(iOS 11.0, *)) {
        _sceneView = [[ARSCNView alloc] init];
        _visualsDelegate = [[ARAugmentedVIRSceneController alloc] initWithSession:_sceneView.session config:config scene:_sceneView];
    }

    return self;
}

- (void)viewDidLoad {
    if (@available(iOS 11.0, *)) {

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

        if (@available(iOS 11.0, *)) {
            self.sceneView.debugOptions = ARSCNDebugOptionShowWorldOrigin | ARSCNDebugOptionShowFeaturePoints;
        }

        self.sceneView.scene = scene;
        self.sceneView.session.delegate = self;

        UIGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(buttonTapped:)];
        [self.sceneView addGestureRecognizer:tapGesture];

        UIGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panMoved:)];
        [self.sceneView addGestureRecognizer:panGesture];


        // Button
        UIButton *backButton = [[ARMenuButton alloc] init];
        [backButton ar_extendHitTestSizeByWidth:10 andHeight:10];
        [backButton setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
        backButton.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
        backButton.translatesAutoresizingMaskIntoConstraints = false;

        [backButton addTarget:self action:@selector(showNextStep) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:backButton];

        [self.view addConstraints: @[
            [backButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:20],
            [backButton.leftAnchor constraintEqualToAnchor:self.view.leftAnchor constant: 20.0],
            [backButton.heightAnchor constraintEqualToConstant:50.0],
            [backButton.widthAnchor constraintGreaterThanOrEqualToConstant:50.0]
        ]];
        self.button = backButton;

        // Text label
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
        label.textColor = UIColor.whiteColor;
        label.font = [UIFont displaySansSerifFontWithSize:14];
        label.translatesAutoresizingMaskIntoConstraints = false;
        label.numberOfLines = 0;
        label.lineBreakMode = NSLineBreakByWordWrapping;

        [self.view addSubview:label];

        [self.view addConstraints: @[
            [label.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:12.0],
            [label.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant: -40.0],
            [label.trailingAnchor constraintEqualToAnchor:backButton.leadingAnchor constant: 12.0]
        ]];
        self.textLabel = label;
    }
}

- (IBAction)buttonTapped:(UITapGestureRecognizer *)gesture
{
    [self.visualsDelegate tappedOnScreen:gesture];
}

- (IBAction)panMoved:(UIPanGestureRecognizer *)gesture
{
    [self.visualsDelegate pannedOnScreen:gesture];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    // Create a session configuration
    if (@available(iOS 11.3, *)) {
        ARWorldTrackingConfiguration *configuration = [ARWorldTrackingConfiguration new];

        // While Xcode 10.3 is in beta, we won't be shipping builds with it
        #if __IPHONE_OS_VERSION_MAX_ALLOWED >= 1130000
        configuration.planeDetection = ARPlaneDetectionVertical;
        #endif

        // Run the view's session
        [self.sceneView.session runWithConfiguration:configuration];
    }
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    
    // Pause the view's session
    [self.sceneView.session pause];
}

#pragma mark - ARSCNViewDelegate

- (void)session:(ARSession *)session cameraDidChangeTrackingState:(ARCamera *)camera  API_AVAILABLE(ios(11.0))
{
    switch (camera.trackingState) {
        case ARTrackingStateNotAvailable:
        case ARTrackingStateLimited:
            break;
        case ARTrackingStateNormal:
            break;
    }
}
- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    [self.visualsDelegate renderer:renderer didUpdateNode:node forAnchor:anchor];
}

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    [self.visualsDelegate renderer:renderer didAddNode:node forAnchor:anchor];
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.0))
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

NS_ASSUME_NONNULL_END
@end


