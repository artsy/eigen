@import ARKit;
@import SceneKit;

#import "ARMenuAwareViewController.h"
#import "ARDispatchManager.h"
#import "ARFonts.h"
#import "ARAppConstants.h"
#import "ARSpinner.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRViewController.h"
#import "ARAugmentedVIRInteractionController.h"
#import "ARAugmentedVIRSetupViewController.h"

API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRViewController () <ARSCNViewDelegate, ARSessionDelegate, ARVIRDelegate, ARMenuAwareViewController>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong) ARSCNView *sceneView;

@property (nonatomic, strong) id <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate> visualsDelegate;

@property (nonatomic, weak, nullable) UIImageView *phoneImage;
@property (nonatomic, weak, nullable) UIButton *backButton;
@property (nonatomic, weak, nullable) UIButton *resetButton;
@property (nonatomic, weak, nullable) UILabel *textLabel;

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
        _visualsDelegate = [[ARAugmentedVIRInteractionController alloc] initWithSession:_sceneView.session config:config scene:_sceneView delegate:self];
    }

    return self;
}

- (void)viewDidLoad {
    if (@available(iOS 11.0, *)) {

        self.view.backgroundColor = UIColor.whiteColor;
        [super viewDidLoad];

        [self.view addSubview:self.sceneView];
        [self.sceneView alignToView:self.view];

        // Create a new scene
        SCNScene *scene = [[SCNScene alloc] init];

        // Debugging options
        if (self.config.debugMode) {
          self.sceneView.debugOptions = ARSCNDebugOptionShowWorldOrigin | ARSCNDebugOptionShowFeaturePoints;
          self.sceneView.showsStatistics = YES;
        }

        // Set the view's delegate
        self.sceneView.delegate = self;
        self.sceneView.scene = scene;
        self.sceneView.session.delegate = self;

        UIGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(screenTapped:)];
        [self.sceneView addGestureRecognizer:tapGesture];

        UIGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panMoved:)];
        [self.sceneView addGestureRecognizer:panGesture];

        // Exit
        ARClearFlatButton *backButton = [[ARClearFlatButton alloc] init];
        [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateNormal];
        [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateHighlighted];
        [backButton setBackgroundColor:[UIColor clearColor] forState:UIControlStateHighlighted];
        [backButton setImage:[UIImage imageNamed:@"ARVIRBack"] forState:UIControlStateNormal];
        backButton.translatesAutoresizingMaskIntoConstraints = false;
        [backButton addTarget:self action:@selector(back) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:backButton];

        // Reset
        ARClearFlatButton *resetButton = [[ARClearFlatButton alloc] init];
        [resetButton setImage:[UIImage imageNamed:@"ARVIRRefresh"] forState:UIControlStateNormal];
        resetButton.translatesAutoresizingMaskIntoConstraints = false;
        [resetButton addTarget:self action:@selector(resetAR) forControlEvents:UIControlEventTouchUpInside];
        [resetButton setBorderColor:[UIColor clearColor] forState:UIControlStateNormal];
        [resetButton setBorderColor:[UIColor clearColor] forState:UIControlStateHighlighted];
        [resetButton setBackgroundColor:[UIColor clearColor] forState:UIControlStateHighlighted];
        [self.view addSubview:resetButton];

        // Show
        UIImageView *phoneImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"ARVIRPhone"]];
        phoneImage.translatesAutoresizingMaskIntoConstraints = false;
        [self.view addSubview:phoneImage];

        [self.view addConstraints: @[
            [backButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:20],
            [backButton.leftAnchor constraintEqualToAnchor:self.view.leftAnchor constant: 20.0],
            [backButton.heightAnchor constraintEqualToConstant:50.0],
            [backButton.widthAnchor constraintEqualToConstant:50.0],

            [resetButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:20],
            [resetButton.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor constant:0],
            [resetButton.heightAnchor constraintEqualToConstant:50.0],
            [resetButton.widthAnchor constraintEqualToConstant:50.0],

            [phoneImage.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
            [phoneImage.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor]
        ]];

        // Text label
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
        label.textColor = UIColor.whiteColor;
        label.font = [UIFont displaySansSerifFontWithSize:16];
        label.translatesAutoresizingMaskIntoConstraints = false;
        label.numberOfLines = 0;
        label.lineBreakMode = NSLineBreakByWordWrapping;
        label.textAlignment = NSTextAlignmentCenter;

        label.layer.shadowColor = [UIColor blackColor].CGColor;
        label.layer.shadowOffset = CGSizeMake(0.0, 0.0);
        label.layer.shadowRadius = 3.0;
        label.layer.shadowOpacity = 0.5;
        label.layer.masksToBounds = NO;
        label.layer.shouldRasterize = YES;

        [self.view addSubview:label];

        [self.view addConstraints: @[
            [label.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:50.0],
            [label.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant: -140.0],
            [label.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant: -50.0]
        ]];

        self.textLabel = label;
        self.backButton = backButton;
        self.resetButton = resetButton;
        self.phoneImage = phoneImage;

        [self initialState];

        if (ARPerformWorkAsynchronously) {
            [self animateImageView];
        }
    }
}

- (void)initialState
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = YES;
        self.phoneImage.hidden = NO;
        self.textLabel.text = @"Aim at an object on your wall and move your phone in a circle.";
    });
}

- (void)hasRegisteredPlanes
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = NO;
        self.phoneImage.hidden = YES;
        self.textLabel.text = @"Tap the screen to place the work.";
    });
}

- (void)hasPlacedArtwork
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = NO;
        self.phoneImage.hidden = YES;
        self.textLabel.text = @"";
    });
}

// Rotate the imageview around in a circle
- (void)animateImageView
{
    UIBezierPath *circlePath = [UIBezierPath bezierPathWithArcCenter:self.view.center radius:10 startAngle:0 endAngle:M_PI * 2 clockwise:YES];
    CAKeyframeAnimation *animation = [CAKeyframeAnimation animationWithKeyPath:@"position"];

    animation.path = circlePath.CGPath;
    animation.duration = 1.3;
    animation.repeatCount = HUGE;

    [self.phoneImage.layer addAnimation:animation forKey:@"orbit"];
}

- (void)back
{
    // Ensure we jump past the SetupVC
    NSArray *vcs = self.navigationController.viewControllers;
    for (UIViewController *controller in vcs.reverseObjectEnumerator) {
        if(![controller isKindOfClass:ARAugmentedVIRSetupViewController.class] && ![controller isKindOfClass:self.class]) {
            [self.navigationController popToViewController:controller animated:YES];
            return;
        }
    }

    // I can't think of an edge case for this, but better to be comprehensive
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)resetAR
{
    [self initialState];
    [self.visualsDelegate restart];
}

- (IBAction)screenTapped:(UITapGestureRecognizer *)gesture
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

        // While Xcode 10.3 is in beta, we won't be shipping CI builds with it
//        configuration.planeDetection = ARPlaneDetectionVertical;
        configuration.planeDetection = 2;

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

- (BOOL)hidesStatusBarBackground
{
    return YES;
}

- (BOOL)shouldAutorotate;
{
    return UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return self.shouldAutorotate ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

NS_ASSUME_NONNULL_END

@end


