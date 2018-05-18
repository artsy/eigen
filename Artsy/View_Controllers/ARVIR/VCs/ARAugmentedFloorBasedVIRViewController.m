@import ARKit;
@import SceneKit;

// This needs to be a top level UIViewController
// which will have safeAreaInsets that reflect the phone
#import "ARTopMenuViewController.h"

#import "ARMenuAwareViewController.h"
#import "ARDispatchManager.h"
#import "ARFonts.h"
#import "ARAppConstants.h"
#import "ARDefaults.h"
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/FLKAutoLayout.h>
#import <Extraction/ARSpinner.h>

#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARVIRHorizontalPlaneInteractionController.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedVIRModalView.h"
#import "ARInformationView.h"

API_AVAILABLE(ios(11.0))
@interface ARAugmentedFloorBasedVIRViewController () <ARSCNViewDelegate, ARSessionDelegate, ARVIRDelegate, ARMenuAwareViewController, VIRModalDelegate>
NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, strong) ARSCNView *sceneView;
@property (nonatomic, strong) ARInformationView *informationView;
@property (nonatomic, strong) NSLayoutConstraint *informationViewBottomConstraint;

@property (nonatomic, strong) id <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate> interactionController;

@property (nonatomic, weak, nullable) UIButton *backButton;
@property (nonatomic, strong, nullable) NSDate *dateOpenedAR;

// Used to determine whether to delay loading the floor detection
@property (nonatomic, assign) BOOL hasLoaded;

@end

@implementation ARAugmentedFloorBasedVIRViewController

- (instancetype)initWithConfig:(ARAugmentedRealityConfig *)config
{
    self = [super init];
    if (!self) return nil;

    _config = config;

    if (@available(iOS 11.0, *)) {
        _sceneView = [[ARSCNView alloc] init];

        _interactionController = [[ARVIRHorizontalPlaneInteractionController alloc] initWithSession:_sceneView.session config:config scene:_sceneView delegate:self];
    }

    return self;
}

- (NSArray <InformationalViewState *> *)viewStatesForInformationView:(ARInformationView *)view
{
    InformationalViewState *start = [[InformationalViewState alloc] init];
    start.xOutOfYMessage = @"Step 1 of 3";
    start.bodyString = @"Aim at the floor and slowly move your phone in a circular motion.";
    ARSpinner *spinner = [[ARSpinner alloc] init];
    spinner.spinnerColor = [UIColor whiteColor];
    [spinner constrainHeight:@"40"];
    start.contents = spinner;
    start.onStart = ^(UIView *customView) {
        [spinner startAnimating];
    };

    InformationalViewState *positionWallMarker = [[InformationalViewState alloc] init];
    positionWallMarker.xOutOfYMessage = @"Step 2 of 3";
    positionWallMarker.bodyString = @"Position the marker where the floor meets the wall and tap to set.";
    ARWhiteFlatButton *setMarkerButton = [[ARWhiteFlatButton alloc] init];
    [setMarkerButton setTitle:@"Set Marker" forState:UIControlStateNormal];
    [setMarkerButton addTarget:self.interactionController action:@selector(placeWall) forControlEvents:UIControlEventTouchUpInside];
    positionWallMarker.contents = setMarkerButton;

    InformationalViewState *positionArtworkMarker = [[InformationalViewState alloc] init];
    positionArtworkMarker.xOutOfYMessage = @"Step 3 of 3";
    positionArtworkMarker.bodyString = @"Position the work on the wall and tap to place.";

    ARWhiteFlatButton *placeArtworkButton = [[ARWhiteFlatButton alloc] init];
    [placeArtworkButton setTitle:@"Place Work" forState:UIControlStateNormal];
    [placeArtworkButton addTarget:self.interactionController action:@selector(placeArtwork) forControlEvents:UIControlEventTouchUpInside];
    positionArtworkMarker.contents = placeArtworkButton;

    InformationalViewState *congratsArtworkMarker = [[InformationalViewState alloc] init];
    congratsArtworkMarker.xOutOfYMessage = @" ";
    congratsArtworkMarker.bodyString = @"OK – the work has been placed. Walk around the work to view it in your space.";

    ARClearFlatButton *doneArtworkButton = [[ARClearFlatButton alloc] init];
    [doneArtworkButton setTitle:@"Done" forState:UIControlStateNormal];
    [doneArtworkButton addTarget:self action:@selector(dismissInformationalViewAnimated) forControlEvents:UIControlEventTouchUpInside];
    congratsArtworkMarker.contents = doneArtworkButton;

    return @[start, positionWallMarker, positionArtworkMarker, congratsArtworkMarker];
}

- (void)viewDidLoad
{
    if (@available(iOS 11.0, *)) {
        _dateOpenedAR = [NSDate date];

        self.view.backgroundColor = UIColor.blackColor;
        _sceneView.backgroundColor = UIColor.blackColor;

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

        backButton.layer.masksToBounds = NO;
        backButton.layer.shadowColor = [UIColor blackColor].CGColor;
        backButton.layer.shadowOffset = CGSizeMake(0, 0);
        backButton.layer.shadowOpacity = 0.4;

        // A beta button in the top right
        UIImageView *betaImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"ARVIRBeta"]];
        betaImage.translatesAutoresizingMaskIntoConstraints = false;
        [self.view addSubview:betaImage];

        // Any changes to this will need to be reflected in ARAugmentedVIRModalView also
        BOOL isEdgeToEdgePhone = !UIEdgeInsetsEqualToEdgeInsets( [ARTopMenuViewController sharedController].view.safeAreaInsets, UIEdgeInsetsZero);
        CGFloat backTopMargin = isEdgeToEdgePhone ? -17 : 9;

        [self.view addConstraints: @[
            [backButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:backTopMargin],
            [backButton.rightAnchor constraintEqualToAnchor:self.view.rightAnchor constant: -20.0],
            [backButton.heightAnchor constraintEqualToConstant:50.0],
            [backButton.widthAnchor constraintEqualToConstant:50.0],

            [betaImage.centerYAnchor constraintEqualToAnchor:backButton.centerYAnchor constant:0],
            [betaImage.leftAnchor constraintEqualToAnchor:self.view.leftAnchor constant: 20]
        ]];

        // Makes it so that the screen doesn't dim
        [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    }
}

- (void)presentInformationalInterface:(BOOL)animated
{
    ARInformationView *informationView = [[ARInformationView alloc] init];
    [informationView setupWithStates:[self viewStatesForInformationView:informationView]];

    [self.view addSubview:informationView];
    [informationView alignLeading:@"0" trailing:@"0" toView:self.view];
    [informationView constrainHeight:@"180"];

    self.informationViewBottomConstraint = [informationView alignBottomEdgeWithView:self.view predicate:@"0"];
    self.informationView = informationView;
}

- (void)dismissInformationalViewAnimated
{
    [self dismissInformationalView:YES];
}

- (void)dismissInformationalView:(BOOL)animated
{
    UIView *informational = self.informationView;
    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        // Animate it out
        self.informationViewBottomConstraint.constant = 40;
        informational.alpha = 0;

        [informational setNeedsUpdateConstraints];
        [self.view layoutIfNeeded];
        [informational layoutIfNeeded];
    } completion:^(BOOL finished) {
        [informational removeFromSuperview];
    }];
}

- (void)initialState
{
    ar_dispatch_main_queue(^{
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setBool:YES forKey:ARAugmentedRealityHasSeenSetup];

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

// Pop up an error message

- (void)showModalForError
{
    NSString *errorMessageFloor = @"We’re having trouble finding your floor. Make sure the room is well-lit, or try focusing on a different part of the floor.";

    ARAugmentedVIRModalView *modal = [[ARAugmentedVIRModalView alloc] initWithTitle:errorMessageFloor delegate:self];
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
        // TODO, show tick, then hit next
        [self.informationView next];
    });
}

// Toggle the enabled on the place button based on whether the
// ghost artwork is showing or not

- (void)isShowingGhostWork:(BOOL)showing
{
    ar_dispatch_main_queue(^{
        UIButton *buttonForPlace = (UIButton *)self.informationView.currentState.contents;
        [buttonForPlace setEnabled:showing];
    });
}

- (void)isShowingGhostWall:(BOOL)showing
{
    ar_dispatch_main_queue(^{
        UIButton *buttonForPlace = (UIButton *)self.informationView.currentState.contents;
        [buttonForPlace setEnabled:showing];
    });
}

// Once we known we've placed an artwork, update the UI

- (void)hasPlacedArtwork
{
    ar_dispatch_main_queue(^{
        [self.informationView next];
    });
}

// Once we known we've placed an artwork, update the UI

- (void)hasPlacedWall
{
    ar_dispatch_main_queue(^{
        [self.informationView next];
    });
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
    // Makes it so that the screen can dim again
    [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
}

- (NSTimeInterval)timeInAR
{
    return  [self.dateOpenedAR timeIntervalSinceNow] * -1;
}

// When a user requests to reset, update the UI to the beginnning

- (void)resetAR
{

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

        if (self.hasLoaded) {
            configuration.planeDetection = ARPlaneDetectionHorizontal;
            [self.sceneView.session runWithConfiguration:configuration];

            // Reset the delegate
            [self.interactionController restart];
        } else {
            self.hasLoaded = YES;

            // On the 1st time the app launches
            // Start the AR session, without looking for floors, to delay
            // floor detection by 1s to give someone time to read the docs.
            [self.sceneView.session runWithConfiguration:configuration];
            ar_dispatch_after(1, ^{
                configuration.planeDetection = ARPlaneDetectionHorizontal;
                [self.sceneView.session runWithConfiguration:configuration];
            });
        }
    }

    // Create the informational view and animate it into view
    if (!self.informationView) {
        [self presentInformationalInterface:animated];
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

- (BOOL)prefersStatusBarHidden
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


