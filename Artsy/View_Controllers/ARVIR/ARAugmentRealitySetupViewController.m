@import AVKit;
@import Artsy_UIButtons;
@import Artsy_UILabels;
@import FLKAutoLayout;
@import UIView_BooleanAnimations;

#import "ARDefaults.h"
#import "ARAugmentedRealityConfig.h"
#import "UIViewController+SimpleChildren.h"
#import "ARAugmentRealitySetupViewController.h"
#import "ARAugmentedVIRViewController.h"

@interface ARAugmentRealitySetupViewController ()
@property (nonatomic, copy) NSURL *movieURL;
@property (nonatomic, strong) NSUserDefaults *defaults;
@property (nonatomic, strong) ARAugmentedRealityConfig *config;

@property (nonatomic, weak) UILabel *subtitleLabel;
@property (nonatomic, weak) UIButton *button;

@property (nonatomic, assign) BOOL hasSentToSettings;
@end

NSString *const needsAccessButtonTitle = @"Allow camera access";
NSString *const needsAccessSubtitle = @"To view works in your room using augmented reality, we’ll need access to your camera.";

NSString *const hasDeniedAccessButtonTitle = @"Update Camera Access";
NSString *const hasDeniedAccessSubtitle = @"To view works in your room using augmented reality, we’ll need access to your camera. \n\nPlease update camera access permissions in the iOS settings.";

@implementation ARAugmentRealitySetupViewController

- (instancetype)initWithMovieURL:(NSURL *)movieURL config:(ARAugmentedRealityConfig *)config
{
    self = [super init];
    _movieURL = movieURL;
    _config = config;
    _defaults = [NSUserDefaults standardUserDefaults];
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    BOOL firstTime = ![self.defaults boolForKey:ARAugmentedRealityHasSeenSetup];
    BOOL hasGivenAccess = [self.defaults boolForKey:ARAugmentedRealityCameraAccessGiven];

    NSString *buttonTitle = firstTime && !hasGivenAccess ? needsAccessButtonTitle : hasDeniedAccessButtonTitle ;
    NSString *subtitleText = firstTime && !hasGivenAccess ? needsAccessSubtitle: hasDeniedAccessSubtitle;
    SEL nextButtonSelector = hasGivenAccess ? @selector(sendToSettings) : @selector(next);

    AVPlayerViewController *playVC = [[AVPlayerViewController alloc] init];
    playVC.player = [[AVPlayer alloc] initWithURL: self.movieURL];
    playVC.showsPlaybackControls = NO;
    [self ar_addAlignedModernChildViewController:playVC];

    UIView *overlay = [[UIView alloc] init];
    [self.view addSubview:overlay];
    [overlay alignToView:self.view];

    ARButton *allowAccessButton = [[ARClearFlatButton alloc] init];
    [allowAccessButton setTitle:buttonTitle forState:UIControlStateNormal];
    [allowAccessButton addTarget:self action:nextButtonSelector forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:allowAccessButton];
    self.button = allowAccessButton;

    UILabel *subtitle = [[ARSerifLabel alloc] init];
    subtitle.backgroundColor = [UIColor clearColor];
    subtitle.textColor = [UIColor whiteColor];
    subtitle.text = subtitleText;
    subtitle.textAlignment = NSTextAlignmentCenter;
    [overlay addSubview:subtitle];
    self.subtitleLabel = subtitle;

    UILabel *title = [[ARSansSerifLabel alloc] init];
    title.backgroundColor = [UIColor clearColor];
    title.textColor = [UIColor whiteColor];
    title.text = @"IN ROOM AR VIEWER";
    title.numberOfLines = 1;
    [overlay addSubview:title];

    UIButton *backButton = [self.class createBackButton];
    [backButton setTitle:@"Back to artwork" forState:UIControlStateNormal];
    [backButton addTarget:self action:@selector(back) forControlEvents:UIControlEventTouchUpInside];
    [overlay addSubview:backButton];

    // Align the button to the exact center of the view
    [allowAccessButton alignCenterWithView:overlay];

    // Push up subtitle from the button
    [subtitle constrainBottomSpaceToView:allowAccessButton predicate:@"-30"];
    [subtitle alignCenterXWithView:allowAccessButton predicate:@"0"];
    [subtitle constrainWidth:@"240"];

    // Push up title from the subtitle
    [title constrainBottomSpaceToView:subtitle predicate:@"-20"];
    [title alignCenterXWithView:subtitle predicate:@"0"];

    // Align the back button to the bottom
    [backButton alignCenterXWithView:overlay predicate:@"0"];

    if (@available(iOS 11.0, *)) {
        [NSLayoutConstraint activateConstraints:@[
            [backButton.bottomAnchor constraintEqualToSystemSpacingBelowAnchor:overlay.safeAreaLayoutGuide.bottomAnchor multiplier:0]
        ]];
    } else {
        [backButton constrainBottomSpaceToView:self.flk_bottomLayoutGuide predicate:@"-20"];
    }
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.defaults setBool:YES forKey:ARAugmentedRealityHasSeenSetup];

    // Re-run the validation steps when they've come back from settings
    if (self.hasSentToSettings) {
        [self next];
    }
}

- (void)back
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)sendToSettings
{
    self.hasSentToSettings = YES;
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

- (void)next
{
    [self.class validateAVAccess:self.defaults callback:^(bool allowedAccess) {
        if (allowedAccess) {
            ARAugmentedVIRViewController *vc = [[ARAugmentedVIRViewController alloc] initWithConfig:self.config];
            [self.navigationController pushViewController:vc animated:YES];
        } else {
            [self requestDenied];
        }
    }];
}

- (void)requestDenied
{
    self.subtitleLabel.text = hasDeniedAccessSubtitle;
    [self.button setTitle:hasDeniedAccessButtonTitle forState:UIControlStateNormal];
    [self.button removeTarget:self action:@selector(next) forControlEvents:UIControlEventTouchUpInside];
    [self.button addTarget:self action:@selector(sendToSettings) forControlEvents:UIControlEventTouchUpInside];
}

+ (BOOL)canOpenARView
{
    if (@available(iOS 11.0, *)) {
        return YES;
    } else {
        return NO;
    }
}

+ (BOOL)canSkipARSetup:(NSUserDefaults *)defaults
{
    BOOL access = [defaults boolForKey:ARAugmentedRealityCameraAccessGiven];
    BOOL used = [defaults boolForKey:ARAugmentedRealityHasSuccessfullyRan];
    return access && used;
}

+ (void)validateAVAccess:(NSUserDefaults *)defaults callback:(void (^)(bool allowedAccess))closure
{
    if ([defaults boolForKey:ARAugmentedRealityCameraAccessGiven]) {
        return closure(YES);
    }

    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [defaults setBool:granted forKey:ARAugmentedRealityCameraAccessGiven];
            closure(granted);
        });
    }];
}

+ (UIButton *)createBackButton
{
    ARFlatButton *backButton = [[ARClearFlatButton alloc] init];
    [backButton setImage:[UIImage imageNamed:@"Chevron_White_Left"] forState:UIControlStateNormal];
    [backButton setImageEdgeInsets:UIEdgeInsetsMake(0, -25, 0, 10)];
    [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateNormal];
    [backButton setBorderColor:[UIColor clearColor] forState:UIControlStateHighlighted];
    [backButton setBackgroundColor:[UIColor clearColor] forState:UIControlStateHighlighted];
    [backButton setTitleColor:[[UIColor whiteColor] colorWithAlphaComponent:0.5] forState:UIControlStateHighlighted];
    return backButton;
}

@end
