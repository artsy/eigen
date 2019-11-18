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

#import <Artsy+UILabels/Artsy+UILabels.h>
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARSignUpSplashTextViewController : UIViewController
@property (nonatomic, readwrite) NSInteger index;
@property (nonatomic, strong, readwrite) NSString *text;
- (instancetype)initWithText:(NSString *)text andIndex:(NSInteger)index;
@end


@interface ARSignUpSplashViewController ()

@property (nonatomic, strong, readwrite) NSArray *pages;
@property (nonatomic, strong, readwrite) ARCrossfadingImageView *imageView;
@property (nonatomic, strong, readwrite) ARBlackFlatButton *getStartedButton;
@property (nonatomic, strong, readwrite) ARSerifLineHeightLabel *descriptionLabel;
@property (nonatomic, strong, readwrite) UIActivityIndicatorView *spinnerView;
@property (nonatomic, strong, readwrite) UIImageView *logoView;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *spaceLogoToTop;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *spaceDescription;

@end


@implementation ARSignUpSplashViewController

- (NSDictionary *)pageWithImageName:(NSString *)imageName bodyCopy:(NSString *)copy
{
    NSString *path = [[NSBundle mainBundle] pathForResource:imageName ofType:@"jpg"];
    UIImage *image = [UIImage imageWithContentsOfFile:path];
    if (image) {
        return @{
            @"image" : image,
            @"copy" : copy
        };
    } else {
        return @{};
    }
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _pages = @[
            [self pageWithImageName:@"onboard_1@2x"
                           bodyCopy:@"Buy art from premier galleries and auction houses from around the world"],
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
    void(^removeSpinners)(void) = ^ {
        if (!self.spinnerView) {
            return;
        }
        [UIView animateWithDuration:ARAnimationDuration animations:^{
            [self.spinnerView removeFromSuperview];
            self.spinnerView = nil;
            [self showControls];
        }];
    };

    // Always remove the spinners after 5 seconds.
    // If you're choosing a a login, this would remove the
    // spinners in the BG.
    ar_dispatch_after(5, ^{
        removeSpinners();
    });

    [[ARUserManager sharedManager] tryLoginWithSharedWebCredentials:^(NSError *error) {
        ar_dispatch_main_queue(^{
            if (error) {
                // If it fails then remove the spinners
                removeSpinners();
            } else {
                // Successfully logged in
                [self loggedInWithSharedCredentials];
                [self.delegate dismissOnboardingWithVoidAnimation:YES];
            }
        });
    }];

    [super viewDidAppear:animated];
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"

// Yes, this is deprecated, but it's the most straightforward way to change 2 values for iPad landscape
- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self finaliseValuesForiPadWithInterfaceOrientation:toInterfaceOrientation];
}

#pragma clang diagnostic pop

- (void)finaliseValuesForiPadWithInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if (self.spaceLogoToTop) {
        if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
            self.spaceLogoToTop.constant = self.useLargeLayout ? 100 : 70;
            self.spaceDescription.constant = self.useLargeLayout ? -90 : -25;
        } else {
            self.spaceLogoToTop.constant = self.useLargeLayout ? 260 : 70;
            self.spaceDescription.constant = self.useLargeLayout ? -190 : -25;
        }
    }
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


    NSString *imageColor = ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad) ? @"white" : @"black";
    NSString *imageName = NSStringWithFormat(@"full_logo_%@_%@", imageColor, self.useLargeLayout ? @"medium" : @"small");
    self.logoView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    self.logoView.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:self.logoView];
    [self.logoView alignCenterXWithView:self.view predicate:@"0"];
    self.spaceLogoToTop = [self.logoView alignTopEdgeWithView:self.view predicate:self.useLargeLayout ? @"260" : @"70"];

    self.spinnerView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [self.view addSubview:self.spinnerView];

    if ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone) {
        // The new image on iPhone has artwork in the center that makes it hard to see the activity indicator
        // Hence it's now in the lower half and black for better contrast on the white image background
        self.spinnerView.color = [UIColor blackColor];
        [self.spinnerView constrainHeightToView:self.view predicate:@"*.5"];
        [self.spinnerView constrainWidthToView:self.view predicate:@"0"];
        [self.spinnerView alignBottom:@"0" trailing:@"0" toView:self.view];
    } else {
        // Business as usual
        [self.spinnerView alignToView:self.view];
    }
    
    [self.spinnerView startAnimating];

    NSArray *images = [self.pages map:^id(NSDictionary *object) {
        return [object objectForKey:@"image"];
    }];

    self.imageView.images = images;
}

- (void)setupControls;
{
    self.getStartedButton = [[ARBlackFlatButton alloc] init];
    [self.getStartedButton setTitle:@"GET STARTED" forState:UIControlStateNormal];
    [self.getStartedButton addTarget:self action:@selector(startOnboarding:) forControlEvents:UIControlEventTouchUpInside];

    // using device here rather than large layout, because it's about the color on the background image
    // because the bgimage is loaded with ~ipad / ~iphone, the colouring is device rather than layout specific
    if ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad) {
        [self.getStartedButton setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [self.getStartedButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [self.getStartedButton setBackgroundColor:[UIColor blackColor] forState:UIControlStateHighlighted];
        [self.getStartedButton setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    }
    
    self.descriptionLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    self.descriptionLabel.backgroundColor = [UIColor clearColor];
    self.descriptionLabel.opaque = NO;
    self.descriptionLabel.font = [UIFont serifFontWithSize:self.useLargeLayout ? 38 : 22];
    self.descriptionLabel.textColor = ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad) ? [UIColor whiteColor] : [UIColor blackColor];
    self.descriptionLabel.textAlignment = NSTextAlignmentCenter;
    self.descriptionLabel.numberOfLines = 0;
    self.descriptionLabel.text = self.pages[0][@"copy"];
    
    ARTermsAndConditionsView *label = [[ARTermsAndConditionsView alloc] init];
    label.hidden = YES;
    
    [self.view addSubview:self.descriptionLabel];
    [self.view addSubview:self.getStartedButton];
    [self.view addSubview:label];

    [self.descriptionLabel constrainWidth:self.useLargeLayout ? @"500" : @"280" height:self.useLargeLayout ? @"160" : @"120"];
    [self.descriptionLabel alignCenterXWithView:self.view predicate:@"0"];
    self.spaceDescription = [self.descriptionLabel constrainBottomSpaceToView:self.getStartedButton predicate:self.useLargeLayout ? @"-190" : @"-25"];
    
    [self.getStartedButton alignBottomEdgeWithView:label predicate:self.useLargeLayout ? @"-170" : @"-80"];
    [self.getStartedButton alignCenterXWithView:self.view predicate:@"0"];
    [self.getStartedButton constrainWidth:self.useLargeLayout ? @"340" : @"300" height:@"50"];
    
    [label constrainWidth:@"280" height:@"40"];
    [label alignCenterXWithView:self.view predicate:@"0"];

    CGFloat constant = self.useLargeLayout ? -55 : -10;
    [NSLayoutConstraint activateConstraints:@[
          [label.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:constant]
    ]];

    [self hideControls];
    [self finaliseValuesForiPadWithInterfaceOrientation:UIApplication.sharedApplication.statusBarOrientation];
}

- (void)hideControls
{
    self.descriptionLabel.layer.opacity = 0;
    self.getStartedButton.layer.opacity = 0;
}

- (void)showControls
{
    [UIView animateIf:YES duration:2.3 delay:0.3 options:UIViewAnimationOptionCurveEaseInOut:^{
        self.descriptionLabel.layer.opacity = 1;
        self.getStartedButton.layer.opacity = 1;
    } completion:nil];
}


#pragma Property overrides

- (void)setFormEnabled:(BOOL)enabled
{
    self.getStartedButton.enabled = enabled;
}

- (void)setBackgroundImage:(UIImage *)backgroundImage
{
    self.imageView.image = nil;
}

- (UIImage *)backgroundImage
{
    return self.imageView.images[self.imageView.currentIndex];
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
        for (UIView *view in @[self.getStartedButton]) {
            view.userInteractionEnabled = enabled;
            view.alpha = enabled ? 1 : 0.3;
        }
    }];
}

@end
