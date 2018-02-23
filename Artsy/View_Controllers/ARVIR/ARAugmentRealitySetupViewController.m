@import AVKit;
@import Artsy_UIButtons;
@import Artsy_UILabels;
@import FLKAutoLayout;

#import "UIViewController+SimpleChildren.h"
#import "ARAugmentRealitySetupViewController.h"

@interface ARAugmentRealitySetupViewController ()
@property (nonatomic, copy) NSURL *movieURL;
@end

@implementation ARAugmentRealitySetupViewController

- (instancetype)initWithMovieURL:(NSURL *)movieURL
{
    self = [super init];
    _movieURL = movieURL;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    AVPlayerViewController *playVC = [[AVPlayerViewController alloc] init];
    playVC.player = [[AVPlayer alloc] initWithURL: self.movieURL];
    playVC.showsPlaybackControls = NO;
    [self ar_addAlignedModernChildViewController:playVC];

    UIView *overlay = [[UIView alloc] init];
    [self.view addSubview:overlay];
    [overlay alignToView:self.view];

    ARButton *allowAccessButton = [[ARClearFlatButton alloc] init];
    [allowAccessButton setTitle:@"Allow Camera Access" forState:UIControlStateNormal];
    [overlay addSubview:allowAccessButton];

    UILabel *subtitle = [[ARSerifLabel alloc] init];
    subtitle.backgroundColor = [UIColor clearColor];
    subtitle.textColor = [UIColor whiteColor];
    subtitle.text = @"To view works in your room using Augmented Reality, we're going to need access to your camera.";
    subtitle.textAlignment = NSTextAlignmentCenter;
    [overlay addSubview:subtitle];

    UILabel *title = [[ARSansSerifLabel alloc] init];
    title.backgroundColor = [UIColor clearColor];
    title.textColor = [UIColor whiteColor];
    title.text = @"IN ROOM AR VIEWER";
    title.numberOfLines = 1;
    [overlay addSubview:title];

    ARButton *backButton = [[ARClearFlatButton alloc] init];
    [backButton setTitle:@"< No thanks, back to artwork" forState:UIControlStateNormal];
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


@end
