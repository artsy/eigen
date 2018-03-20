@import ARKit;
@import SceneKit;

#import "ARMenuAwareViewController.h"
#import "ARDispatchManager.h"
#import "ARFonts.h"
#import "ARAppConstants.h"
#import "ARDefaults.h"
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRViewController.h"
#import "ARAugmentedVIRInteractionController.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedVIRModalView.h"

API_AVAILABLE(ios(11.0))
@interface ARAugmentedVIRViewController () <ARSCNViewDelegate, ARSessionDelegate, ARVIRDelegate, ARMenuAwareViewController, VIRModalDelegate>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong) ARSCNView *sceneView;

@property (nonatomic, strong) id <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate> interactionController;

@property (nonatomic, weak, nullable) UIImageView *phoneImage;
@property (nonatomic, weak, nullable) UIButton *backButton;
@property (nonatomic, weak, nullable) UIButton *resetButton;
@property (nonatomic, weak, nullable) UIButton *placeArtworkButton;
@property (nonatomic, weak, nullable) UILabel *textLabel;
@property (nonatomic, strong, nullable) NSDate *dateOpenedAR;


@end

@implementation ARAugmentedVIRViewController

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config
{
    self = [super init];
    if (!self) return nil;

    _config = config;

    if (@available(iOS 11.0, *)) {
        _sceneView = [[ARSCNView alloc] init];
        _interactionController = [[ARAugmentedVIRInteractionController alloc] initWithSession:_sceneView.session config:config scene:_sceneView delegate:self];
    }

    return self;
}

- (void)viewDidLoad {
    if (@available(iOS 11.0, *)) {
        _dateOpenedAR = [NSDate date];

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
        [backButton addTarget:self action:@selector(exitARContext) forControlEvents:UIControlEventTouchUpInside];
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

        // A phone image which rotates to indicate how to calibrate
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

        // Text label for messaging
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

        ARWhiteFlatButton *placeArtworkButton = [[ARWhiteFlatButton alloc] initWithFrame:CGRectMake(0, 0, 144, 44)];
        [placeArtworkButton setTitle:@"Tap to Place" forState:UIControlStateNormal];
        [placeArtworkButton addTarget:self action:@selector(placeArtwork) forControlEvents:UIControlEventTouchUpInside];

        [self.view addSubview:placeArtworkButton];

        [placeArtworkButton alignCenterXWithView:self.view predicate:@"0"];
        [placeArtworkButton constrainHeight:@"44"];
        [placeArtworkButton constrainWidth:@"140"];
        [placeArtworkButton alignBottomEdgeWithView:self.view predicate:@"-140"];

        self.textLabel = label;
        self.backButton = backButton;
        self.resetButton = resetButton;
        self.phoneImage = phoneImage;
        self.placeArtworkButton = placeArtworkButton;

        [self initialState];

        if (ARPerformWorkAsynchronously) {
            [self animateImageView];
        }
    }
}

// What to show when we first

NSString *ARInitialARVIRSubtitle =  @"Aim at an object on your wall and move your phone in a circle.";
NSString *ARFinalARVIRSubtitle =   @"Keep your phone pointed at the work and walk around the room.";

- (void)initialState
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = YES;
        self.phoneImage.hidden = NO;
        self.placeArtworkButton.hidden = YES;

        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setBool:YES forKey:ARAugmentedRealityHasSeenSetup];

        BOOL firstTime = [defaults boolForKey:ARAugmentedRealityHasSuccessfullyRan];
        self.textLabel.text = firstTime ? ARInitialARVIRSubtitle : @"";

        if (ARPerformWorkAsynchronously) {
            [self startTimerForModal];
        }
    });
}

// Wait 30 seconds from starting AR, then show a timeout modal if a wall hasn't been found.

- (void)startTimerForModal
{
    CGFloat wallTimeoutWarning = ARPerformWorkAsynchronously ? 15 : 0;
    [self performSelector:@selector(showModalForError) withObject:nil afterDelay:wallTimeoutWarning];
}

- (void)startTimerFadingOutFinalText
{
    CGFloat fadeTimeoutWarning = ARPerformWorkAsynchronously ? 7 : 0;
    [self performSelector:@selector(fadeOutFinalText) withObject:nil afterDelay:fadeTimeoutWarning];
}

- (void)fadeOutFinalText
{
    if ([self.textLabel.text isEqualToString:ARFinalARVIRSubtitle]) {
        CGFloat fadeTime = ARPerformWorkAsynchronously ? 0.3 : 0;

        [UIView animateWithDuration:fadeTime animations:^{
            self.textLabel.alpha = 0;

        } completion:^(BOOL finished) {
            self.textLabel.text = @"";
            self.textLabel.alpha = 1;
        }];
    }
}

// Pop up an error message

- (void)showModalForError
{
    NSString *errorMessage = @"We’re having trouble finding your wall. Make sure the room is well-lit or try focusing on a different object on the wall.";
    ARAugmentedVIRModalView *modal = [[ARAugmentedVIRModalView alloc] initWithTitle:errorMessage delegate:self];
    [self.view addSubview:modal];
    [modal alignToView:self.view];
}

// Re-create the AR session, and start again

- (void)hitTryAgainFromModal:(ARAugmentedVIRModalView *)modal
{
    [modal removeFromSuperview];
    [self viewWillAppear:YES];
}

// Let's you exit easily if you're not having a good time

- (void)hitBackFromModal:(ARAugmentedVIRModalView *)modal
{
    [self exitARContext];
}

// Offer the ability to place an artwork

- (void)hasRegisteredPlanes
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = YES;
        self.phoneImage.hidden = YES;
        self.placeArtworkButton.hidden = YES;

        [self.class cancelPreviousPerformRequestsWithTarget:self selector:@selector(showModalForError) object:nil];
    });
}

// Toggle the enabled on the place button based on whether the
// ghost artwork is showing or not

- (void)isShowingGhostWork:(BOOL)showing
{
    ar_dispatch_main_queue(^{
        self.placeArtworkButton.hidden = NO;
        self.placeArtworkButton.enabled = showing;
        self.textLabel.text = @"";
    });
}

// Request to place an artwork with the interaction controller

- (void)placeArtwork
{
    [self.interactionController placeArtwork];
    self.placeArtworkButton.hidden = YES;
}

// Once we known we've placed an artwork, update the UI

- (void)hasPlacedArtwork
{
    ar_dispatch_main_queue(^{
        self.resetButton.hidden = NO;
        self.phoneImage.hidden = YES;
        self.textLabel.text = ARFinalARVIRSubtitle;

        if (ARPerformWorkAsynchronously) {
            [self startTimerFadingOutFinalText];
        }
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

// Pop back, and potentially skip the AR Setup VC if it's there

- (void)exitARContext
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

- (NSTimeInterval)timeInAR
{
    return  [self.dateOpenedAR timeIntervalSinceNow] * -1;
}

// When a user requests to reset, update the UI to the beginnning

- (void)resetAR
{
    [self hasRegisteredPlanes];

    [self.interactionController restart];
}

// This is a NOOP with the current interaction controller, but can be used with different a one

- (IBAction)screenTapped:(UITapGestureRecognizer *)gesture
{
    [self.interactionController tappedOnScreen:gesture];
}

// Used to let the interaction controller potentially move the artwork around

- (IBAction)panMoved:(UIPanGestureRecognizer *)gesture
{
//     [self.interactionController pannedOnScreen:gesture];
}

// When you leave and come back to this VC, ARKit cannot correctly keep track of the world, need to reset

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    // Create a session configuration
    if (@available(iOS 11.3, *)) {
        ARWorldTrackingConfiguration *configuration = [ARWorldTrackingConfiguration new];

        // While Xcode 10.3 is in beta, we won't be shipping CI builds with it
//        configuration.planeDetection = ARPlaneDetectionVertical;
        configuration.planeDetection = 2;

        // Run the view's session
        [self.sceneView.session runWithConfiguration:configuration];

        // Reset the delegate
        [self.interactionController restart];
    }
}

// If we can't show the screen, pause AR

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    // Pause the view's session
    [self.sceneView.session pause];
}

#pragma mark - ARSCNViewDelegate

// Currently unused, might be useful for either debugging, or showing the state of "connection" for AR to the world.

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

// Delegate calls passed through to the interaction controller

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    [self.interactionController renderer:renderer didUpdateNode:node forAnchor:anchor];
}

// Delegate calls passed through to the interaction controller

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor API_AVAILABLE(ios(11.0))
{
    [self.interactionController renderer:renderer didAddNode:node forAnchor:anchor];
}

// Delegate calls passed through to the interaction controller

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame API_AVAILABLE(ios(11.0))
{
    [self.interactionController session:session didUpdateFrame:frame];
}

// Eigen specific callbacks

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


