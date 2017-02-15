#import "ARSignUpSplashViewController.h"

#import "ARAppConstants.h"
#import "ARAppDelegate.h"
#import "ARCrossfadingImageView.h"
#import "ARFonts.h"
#import "ARUserManager.h"
#import "UIView+HitTestExpansion.h"
#import "ArtsyAPI+Private.h"
#import "ARDispatchManager.h"
#import "ARTermsAndConditionsView.h"

#import "Artsy-Swift.h"

@import Artsy_UILabels;
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARSignUpSplashTextViewController : UIViewController
@property (nonatomic, readwrite) NSInteger index;
@property (nonatomic, strong, readwrite) NSString *text;
- (instancetype)initWithText:(NSString *)text andIndex:(NSInteger)index;
@end


@interface ARSignUpSplashViewController ()

@property (nonatomic) NSArray *pages;
@property (nonatomic) ARCrossfadingImageView *imageView;
@property (nonatomic) ARWhiteFlatButton *getStartedButton;
@property (nonatomic) ARClearFlatButton *logInButton;
@property (nonatomic) ARSignUpSplashTextViewController *textViewController;
@property (nonatomic, strong, readwrite) UIActivityIndicatorView *spinnerView;
@property (nonatomic, strong, readwrite) UIImageView *logoView;
@end


@implementation ARSignUpSplashViewController

- (NSDictionary *)pageWithImageName:(NSString *)imageName bodyCopy:(NSString *)copy
{
    return @{
        @"image" : [UIImage imageNamed:imageName],
        @"copy" : copy
    };
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _pages = @[
            [self pageWithImageName:@"onboard_1.jpg"
                           bodyCopy:@"Collect art from premier galleries and auction houses from around the world."],
        ];
    }

    return self;
}


- (void)viewWillAppear:(BOOL)animated
{
    self.view.alpha = 0;
    [UIView animateWithDuration:ARAnimationDuration animations:^{
        self.view.alpha = 1;
    }];

    [super viewWillAppear:animated];

    [self showBackgroundViews];
    [self setupControls];
}

- (void)viewDidAppear:(BOOL)animated
{
    [[ARUserManager sharedManager] tryLoginWithSharedWebCredentials:^(NSError *error) {
        ar_dispatch_main_queue(^{
            if (error) {
                [UIView animateWithDuration:ARAnimationDuration animations:^{
                    [self.spinnerView removeFromSuperview];
                    self.spinnerView = nil;
                    [self showControls];
                }];
            } else {
                [self loggedInWithSharedCredentials];
                [self.delegate dismissOnboardingWithVoidAnimation:YES];
            }
        });
    }];

    [super viewDidAppear:animated];
}

- (void)loggedInWithSharedCredentials
{
    // This is also a method for ARAppDelegate+Analytics to hook into.
    [self showControls];
}

- (void)showBackgroundViews
{
    self.imageView = [[ARCrossfadingImageView alloc] init];
    self.imageView.shouldLoopImages = YES;
    [self.view addSubview:self.imageView];
    [self.imageView alignToView:self.view];
    self.imageView.userInteractionEnabled = YES;


    NSString *imageName = NSStringWithFormat(@"full_logo_white_%@", self.useLargeLayout ? @"medium" : @"small");
    self.logoView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    self.logoView.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:self.logoView];
    [self.logoView alignCenterXWithView:self.view predicate:@"0"];
    [self.logoView alignCenterYWithView:self.view predicate:self.useLargeLayout ? @"-224" : @"-153"];

    self.spinnerView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [self.view addSubview:self.spinnerView];
    [self.spinnerView alignToView:self.view];
    [self.spinnerView startAnimating];

    NSArray *images = [self.pages map:^id(NSDictionary *object) {
        return [object objectForKey:@"image"];
    }];

    self.imageView.images = images;
}

- (void)setupControls;
{
    self.textViewController = [self viewControllerForIndex:0];
    [self addChildViewController:self.textViewController];
    [self.view addSubview:self.textViewController.view];

    [self.textViewController.view constrainTopSpaceToView:self.logoView predicate:self.useLargeLayout ? @"140" : @"160"];
    [self.textViewController.view alignCenterXWithView:self.view predicate:@"0"];

    self.getStartedButton = [[ARWhiteFlatButton alloc] init];
    [self.view addSubview:self.getStartedButton];
    [self.getStartedButton setTitle:@"GET STARTED" forState:UIControlStateNormal];
    [self.getStartedButton addTarget:self action:@selector(startOnboarding:) forControlEvents:UIControlEventTouchUpInside];


    [self.getStartedButton constrainTopSpaceToView:self.textViewController.view predicate:self.useLargeLayout ? @"<=260" : @"<=100"];

    [self.getStartedButton alignCenterXWithView:self.view predicate:@"0"];
    [self.getStartedButton constrainWidth:self.useLargeLayout ? @"340" : @"300"];

    ARTermsAndConditionsView *label = [[ARTermsAndConditionsView alloc] init];
    [label constrainWidth:@"280"];
    [self.view addSubview:label];
    [label alignCenterXWithView:self.view predicate:@"0"];
    [label constrainTopSpaceToView:self.getStartedButton predicate:@"70"];
    [label alignBottomEdgeWithView:self.view predicate:self.useLargeLayout ? @"-60" : @"-20"];

    [self hideControls];
}

- (void)hideControls
{
    self.textViewController.view.layer.opacity = 0;
    self.logInButton.layer.opacity = 0;
    self.getStartedButton.layer.opacity = 0;
}

- (void)showControls
{
    [UIView animateIf:YES duration:2.3 delay:0.3 options:UIViewAnimationOptionCurveEaseInOut:^{
        self.textViewController.view.layer.opacity = 1;
        self.logInButton.layer.opacity = 1;
        self.getStartedButton.layer.opacity = 1;
    } completion:nil];
}


#pragma Property overrides

- (void)setFormEnabled:(BOOL)enabled
{
    self.getStartedButton.enabled = enabled;
    self.logInButton.enabled = enabled;
}

- (void)setBackgroundImage:(UIImage *)backgroundImage
{
    self.imageView.image = nil;
}

- (UIImage *)backgroundImage
{
    return self.imageView.images[self.imageView.currentIndex];
}

- (ARSignUpSplashTextViewController *)viewControllerForIndex:(NSInteger)index
{
    return [[ARSignUpSplashTextViewController alloc] initWithText:self.pages[0][@"copy"] andIndex:index];
}


#pragma mark Actions

- (void)startOnboarding:(id)sender
{
    [self.delegate splashDone:self];
}

- (void)logIn:(id)sender
{
    [self.delegate splashDone:self];
}

- (void)enableForm
{
    [self setFormEnabled:YES animated:YES];
}

- (void)openTerms
{
    [self.onboardingViewController showTermsAndConditions];
}

- (void)openPrivacy
{
    [self.onboardingViewController showPrivacyPolicy];
}

#pragma mark View setup

- (void)setFormEnabled:(BOOL)enabled animated:(BOOL)animated
{
    [UIView animateIf:animated duration:0.15:^{
        for (UIView *view in @[self.logInButton, self.getStartedButton]) {
            view.userInteractionEnabled = enabled;
            view.alpha = enabled ? 1 : 0.3;
        }
    }];
}

@end


@implementation ARSignUpSplashTextViewController
- (instancetype)initWithText:(NSString *)text andIndex:(NSInteger)index
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _text = text;
    _index = index;
    return self;
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [super traitCollectionDidChange:previousTraitCollection];

    [self setupViews];
}

- (void)setupViews
{
    UILabel *copyLabel = [self labelForCopy];
    copyLabel.text = self.text;


    [self.view addSubview:copyLabel];
    [copyLabel constrainWidth:self.useLargeLayout ? @"500" : @"280" height:self.useLargeLayout ? @"160" : @"120"];
    [copyLabel alignCenterXWithView:self.view predicate:@"0"];
    [copyLabel alignCenterYWithView:self.view predicate:self.useLargeLayout ? @"40" : @"-60"];
}

- (UILabel *)labelForCopy
{
    ARSerifLineHeightLabel *copyLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    copyLabel.backgroundColor = [UIColor clearColor];
    copyLabel.opaque = NO;
    copyLabel.font = [UIFont serifFontWithSize:self.useLargeLayout ? 38 : 26];
    copyLabel.textColor = [UIColor whiteColor];
    copyLabel.textAlignment = NSTextAlignmentCenter;
    copyLabel.numberOfLines = 0;
    copyLabel.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    return copyLabel;
}

@end
