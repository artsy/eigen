@import ARKit;
@import SceneKit;

// This needs to be a top level UIViewController
// which will have safeAreaInsets that reflect the phone

#import "ARMenuAwareViewController.h"
#import "ARDispatchManager.h"
#import "ARFonts.h"
#import "ARAppConstants.h"
#import "ARDefaults.h"
#import "ARButtonSubclasses.h"
#import "AREmission.h"
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/FLKAutoLayout.h>
#import "ARSpinner.h"
#import "UIView+ARSpinner.h"

#import "ARAugmentedRealityConfig.h"
#import "ARAnalyticsConstants.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARVIRHorizontalPlaneInteractionController.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARInformationView.h"
#import <ARKit/ARKit.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface _ARWhiteFlatButton : ARWhiteFlatButton
@end
@implementation _ARWhiteFlatButton
- (void)setHighlighted:(BOOL)highlighted;
{
    // no-op
}
@end

@interface _ARClearFlatButton : ARClearFlatButton
@end
@implementation _ARClearFlatButton
- (void)setHighlighted:(BOOL)highlighted;
{
    // no-op
}
@end

@interface ARAugmentedFloorBasedVIRViewController () <ARSCNViewDelegate, ARSessionDelegate, ARVIRDelegate, ARMenuAwareViewController>

@property (nonatomic, strong) ARSCNView *sceneView;
@property (nonatomic, strong) ARInformationView *informationView;
@property (nonatomic, strong) NSLayoutConstraint *informationViewBottomConstraint;
@property (nonatomic, strong) ARClearFlatButton *resetARButton;

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
    _sceneView = [[ARSCNView alloc] init];
    _interactionController = [[ARVIRHorizontalPlaneInteractionController alloc] initWithSession:_sceneView.session config:config scene:_sceneView delegate:self];

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
#if TARGET_OS_SIMULATOR
        ar_dispatch_after(3, ^{
            [self hasRegisteredPlanes];
        });
#endif
    };

    // A temporary state when we've found the floor, but are waiting to show the tick first
    InformationalViewState *registeredPlanes = [[InformationalViewState alloc] init];
    registeredPlanes.animate = NO;
    registeredPlanes.xOutOfYMessage = @"Step 1 of 3";
    registeredPlanes.bodyString = @"";
    UIImageView *tick = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"ARVIRTick"]];
    tick.contentMode = UIViewContentModeCenter;
    registeredPlanes.contents = tick;
    registeredPlanes.onStart = ^(UIView *customView) {
        ar_dispatch_after(2, ^{
            [self.informationView next];
        });
    };

    InformationalViewState *positionWallMarker = [[InformationalViewState alloc] init];
    positionWallMarker.xOutOfYMessage = @"Step 2 of 3";
    positionWallMarker.bodyString = @"Position the marker where the floor meets the wall and tap to set.";
    ARWhiteFlatButton *setMarkerButton = [[_ARWhiteFlatButton alloc] init];
    [setMarkerButton constrainHeight:@"50"];
    [setMarkerButton setTitle:@"Set Marker" forState:UIControlStateNormal];
#if TARGET_OS_SIMULATOR
    [setMarkerButton addTarget:self.informationView action:@selector(next) forControlEvents:UIControlEventTouchUpInside];
#else
    [setMarkerButton addTarget:self.interactionController action:@selector(placeWall) forControlEvents:UIControlEventTouchUpInside];
#endif
    positionWallMarker.contents = setMarkerButton;

    InformationalViewState *positionArtworkMarker = [[InformationalViewState alloc] init];
    positionArtworkMarker.xOutOfYMessage = @"Step 3 of 3";
    positionArtworkMarker.bodyString = @"Position the work on the wall and tap to place.";

    ARWhiteFlatButton *placeArtworkButton = [[_ARWhiteFlatButton alloc] init];
    [placeArtworkButton setTitle:@"Place Work" forState:UIControlStateNormal];
    [placeArtworkButton constrainHeight:@"50"];
#if TARGET_OS_SIMULATOR
    [placeArtworkButton addTarget:self.informationView action:@selector(next) forControlEvents:UIControlEventTouchUpInside];
#else
    [placeArtworkButton addTarget:self.interactionController action:@selector(placeArtwork) forControlEvents:UIControlEventTouchUpInside];
#endif
    positionArtworkMarker.contents = placeArtworkButton;

    InformationalViewState *congratsArtworkMarker = [[InformationalViewState alloc] init];
    congratsArtworkMarker.xOutOfYMessage = @" ";
    congratsArtworkMarker.bodyString = @"The work has been placed. Walk around the work to view it in your space.";

    ARClearFlatButton *doneArtworkButton = [[_ARClearFlatButton alloc] init];
    [doneArtworkButton setTitle:@"Done" forState:UIControlStateNormal];
    [doneArtworkButton constrainHeight:@"50"];
    [doneArtworkButton addTarget:self action:@selector(dismissInformationalViewAnimated) forControlEvents:UIControlEventTouchUpInside];
    congratsArtworkMarker.contents = doneArtworkButton;

    return @[start, registeredPlanes, positionWallMarker, positionArtworkMarker, congratsArtworkMarker];
}

- (void)viewDidLoad
{
    _dateOpenedAR = [NSDate date];

#if TARGET_OS_SIMULATOR
    self.view.backgroundColor = UIColor.artsyPurpleLight;
    _sceneView.backgroundColor = UIColor.artsyPurpleLight;
#else
    self.view.backgroundColor = UIColor.blackColor;
    _sceneView.backgroundColor = UIColor.blackColor;
#endif

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

    // Back button in the top left
    ARClearFlatButton *backButton = [[ARClearFlatButton alloc] init];
    [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateNormal];
    [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateHighlighted];
    [backButton setBackgroundColor:[UIColor clearColor] forState:UIControlStateHighlighted];
    [backButton setImage:[UIImage imageNamed:@"ARVIRBack"] forState:UIControlStateNormal];
    backButton.translatesAutoresizingMaskIntoConstraints = false;
    [backButton addTarget:self action:@selector(exitARContext) forControlEvents:UIControlEventTouchUpInside];
    backButton.imageEdgeInsets = UIEdgeInsetsMake(-10, -10, -10, -10);

    self.backButton = backButton;
    [self.view addSubview:backButton];

    backButton.layer.masksToBounds = NO;
    backButton.layer.shadowColor = [UIColor blackColor].CGColor;
    backButton.layer.shadowOffset = CGSizeMake(0, 0);
    backButton.layer.shadowOpacity = 0.4;



    ARClearFlatButton *resetARButton = [[_ARClearFlatButton alloc] init];
    [resetARButton setTitle:@"Reset" forState:UIControlStateNormal];
    [resetARButton addTarget:self action:@selector(resetAR) forControlEvents:UIControlEventTouchUpInside];
    resetARButton.translatesAutoresizingMaskIntoConstraints = false;
    resetARButton.alpha = 0;
    [self.view addSubview:resetARButton];
    self.resetARButton = resetARButton;

    [self.view addConstraints: @[
        [backButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:10],
        [backButton.leftAnchor constraintEqualToAnchor:self.view.leftAnchor constant: 4.0],
        [backButton.heightAnchor constraintEqualToConstant:50.0],
        [backButton.widthAnchor constraintEqualToConstant:50.0],

        [resetARButton.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor constant:0],
        [resetARButton.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor constant:-40],
        [resetARButton.widthAnchor constraintEqualToConstant:92.0],
    ]];

    // Create and show the informational interface
    ARInformationView *informationView = [[ARInformationView alloc] init];
    [informationView setupWithStates:[self viewStatesForInformationView:informationView]];
    informationView.alpha = 0;
    [self.view addSubview:informationView];
    [informationView alignLeading:@"0" trailing:@"0" toView:self.view];
    [informationView constrainHeight:@"221"];
    self.informationViewBottomConstraint = [informationView alignBottomEdgeWithView:self.view predicate:@"0"];
    self.informationViewBottomConstraint.constant = 40;
    self.informationView = informationView;

    // Makes it so that the screen doesn't dim
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
}

- (void)presentInformationalInterface:(BOOL)animated
{
    UIView *informational = self.informationView;
    if (informational.alpha > 0) {
        return;
    }
    [UIView animateIf:animated
             duration:ARAnimationDuration
              options:UIViewAnimationOptionCurveEaseOut
                     :^{
        // Animate it in
        self.informationViewBottomConstraint.constant = 0;
        informational.alpha = 1;
        self.resetARButton.alpha = 0;

        [informational setNeedsUpdateConstraints];
        [self.view layoutIfNeeded];
        [informational layoutIfNeeded];
    }];
}

- (void)dismissInformationalViewAnimated
{
    [self dismissInformationalView:YES];
}

- (void)dismissInformationalView:(BOOL)animated
{
    UIView *informational = self.informationView;
    [UIView animateIf:animated
             duration:ARAnimationQuickDuration
              options:UIViewAnimationOptionCurveEaseOut
                     :^{
        // Animate it out
        self.informationViewBottomConstraint.constant = 40;
        informational.alpha = 0;
        self.resetARButton.alpha = 1;

        [informational setNeedsUpdateConstraints];
        [self.view layoutIfNeeded];
        [informational layoutIfNeeded];
    }];
}

// so show a tick to indicate it's worked, then move on

- (void)hasRegisteredPlanes
{
    [[AREmission sharedInstance] sendEvent:@"success" traits:@{
        @"action_name" : @"arDetectedPlanes",
        @"owner_type" : @"artwork",
        @"owner_id" : self.config.artworkID ?: @"unknown",
        @"owner_slug": self.config.artworkSlug ?: @"unknown",
    }];
    ar_dispatch_main_queue(^{
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
    [[AREmission sharedInstance] sendEvent:@"success" traits:@{
        @"action_name" : @"arPlacedArtwork",
        @"owner_type" : @"artwork",
        @"owner_id" : self.config.artworkID ?: @"unknown",
        @"owner_slug": self.config.artworkSlug ?: @"unknown",
    }];

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
    [[AREmission sharedInstance] sendEvent:@"ar_view_in_room_time" traits:@{
        @"length" : @([self timeInAR])
    }];
    // Ensure we jump past the SetupVC
    UIViewController *presentingVC = [self presentingViewController];
    if ([presentingVC isKindOfClass:ARAugmentedVIRSetupViewController.class]) {
        presentingVC = [presentingVC presentingViewController];
    }

    [presentingVC dismissViewControllerAnimated:self completion:nil];
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
    [self.informationView reset];
    [self presentInformationalInterface:YES];
}

// This is a NOOP with the current interaction controller, but can be used with different a one

- (IBAction)screenTapped:(UITapGestureRecognizer *)gesture
{
    [self.interactionController tappedOnScreen:gesture];

    if ([self.informationView isAtLastState]) {
        [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
            self.backButton.alpha = self.backButton.alpha == 1 ? 0 : 1;
            self.resetARButton.alpha = self.resetARButton.alpha == 1 ? 0 : 1;
        }];
    }
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

- (void)viewDidAppear:(BOOL)animated;
{
    [super viewDidAppear:animated];

    [[AREmission sharedInstance] sendScreenEvent:@"AR View in Room" traits:@{}];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
       [self presentInformationalInterface:animated];
    });
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

- (void)session:(ARSession *)session cameraDidChangeTrackingState:(ARCamera *)camera
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

- (void)renderer:(id<SCNSceneRenderer>)renderer didUpdateNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor
{
    [self.interactionController renderer:renderer didUpdateNode:node forAnchor:anchor];
}

// Delegate calls passed through to the interaction controller

- (void)renderer:(id <SCNSceneRenderer>)renderer didAddNode:(SCNNode *)node forAnchor:(ARAnchor *)anchor
{
    [self.interactionController renderer:renderer didAddNode:node forAnchor:anchor];
}

// Delegate calls passed through to the interaction controller

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame
{
    [self.interactionController session:session didUpdateFrame:frame];
}

- (BOOL)hidesBackButton
{
    return YES;
}

- (BOOL)hidesBottomBarWhenPushed
{
    return YES;
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (BOOL)shouldAutorotate;
{
    return [[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return self.shouldAutorotate ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

@end
