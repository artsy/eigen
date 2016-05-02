#import "ARSignUpActiveUserViewController.h"

#import "ARFonts.h"
#import "AROnboardingNavBarView.h"
#import "ARUserManager.h"
#import "ARAppConstants.h"
#import "ARDispatchManager.h"

#import "UIDevice-Hardware.h"

@import Artsy_UILabels;
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARSignUpActiveUserViewController ()
@property (nonatomic, strong) AROnboardingNavBarView *navView;
@property (nonatomic, strong) NSString *message;
@property (nonatomic, strong, readwrite) UIActivityIndicatorView *spinnerView;
@end


@implementation ARSignUpActiveUserViewController

- (void)setTrialContext:(enum ARTrialContext)context
{
    _trialContext = context;
    NSString *message = nil;
    switch (context) {
        case ARTrialContextFavoriteArtist:
            message = @"Sign up for a free account\nto save artists and get\npersonal recommendations.";
            break;

        case ARTrialContextFavoriteProfile:
            message = @"Sign up for a free account\nto save partners and get\npersonal recommendations.";
            break;

        case ARTrialContextFavoriteGene:
        case ARTrialContextFavoriteArtwork:
            message = @"Sign up for a free account\nto save works and get\npersonal recommendations.";
            break;

        case ARTrialContextShowingFavorites:
            message = @"Sign up for a free account to save works, artists and categories to your favorites.";
            break;

        case ARTrialContextPeriodical:
            message = @"Sign up for a free account to save works and artists and get personal recommendations.";
            break;

        case ARTrialContextRepresentativeInquiry:
            message = @"Sign up for a free account and an Artsy specialist will be glad to help you.";
            break;

        case ARTrialContextContactGallery:
            message = @"Sign up for a free account\nto inquire about works.";
            break;

        case ARTrialContextAuctionBid:
            message = @"Sign up for a free account\nto bid on works.";
            break;

        case ARTrialContextAuctionRegistration:
            message = @"Sign up to bid in leading auctions from around the world.";
            break;

        case ARTrialContextArtworkOrder:
            message = @"Sign up for a free account\nto buy works.";
            break;

        case ARTrialContextFairGuide:
        case ARTrialContextNotifications:
            message = @"Sign up for a free account\nto get personal recommendations.";
            break;

        case ARTrialContextNotTrial:
            message = @"";
            break;
    }
    self.message = message;
}

- (void)viewDidLoad
{
    self.view.backgroundColor = [UIColor clearColor];

    self.bodyCopyLabel.hidden = YES;
    self.bottomView.hidden = YES;

    self.spinnerView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [self.view addSubview:self.spinnerView];
    [self.spinnerView alignToView:self.view];
    [self.spinnerView startAnimating];

    [super viewDidLoad];
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
    // This is a dummy method for ARAppDelegat+Analytics to hook into.
}

- (void)showControls;
{
    AROnboardingNavBarView *navView = [[AROnboardingNavBarView alloc] init];
    [self.view addSubview:navView];
    self.navView = navView;

    [navView.title setText:@""];

    [self.navView.back setImage:[UIImage imageNamed:@"CloseButtonLarge"] forState:UIControlStateNormal];
    [self.navView.back setImage:[UIImage imageNamed:@"CloseButtonLargeHighlignted"] forState:UIControlStateHighlighted];
    [self.navView.back addTarget:self action:@selector(goBackToApp:) forControlEvents:UIControlEventTouchUpInside];

    [self.navView.forward setTitle:@"LOG IN" forState:UIControlStateNormal];
    [self.navView.forward addTarget:self action:@selector(goToLogin:) forControlEvents:UIControlEventTouchUpInside];
    [self.navView.forward setEnabled:YES animated:NO];

    self.bodyCopyLabel.font = [UIFont serifFontWithSize:22];
    self.bodyCopyLabel.backgroundColor = [UIColor clearColor];
    self.bodyCopyLabel.opaque = NO;
    self.bodyCopyLabel.lineHeight = 6;
    self.bodyCopyLabel.text = self.message;

    self.bodyCopyLabel.hidden = NO;
    self.bottomView.hidden = NO;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)openTerms
{
    [self.delegate showTermsAndConditions];
}

- (void)openPrivacy
{
    [self.delegate showPrivacyPolicy];
}

- (IBAction)connectWithFacebook:(id)sender
{
    [self.delegate signUpWithFacebook];
}

- (IBAction)signUpWithEmail:(id)sender
{
    [self.delegate signUp];
}

- (void)goToLogin:(id)sender
{
    [self.delegate logInWithEmail:nil];
}

- (void)goBackToApp:(id)sender
{
    [UIView animateIf:YES duration:ARAnimationQuickDuration:^{
        self.topView.alpha = 0;
        self.bottomView.alpha = 0;
    }];
    [self.delegate dismissOnboardingWithVoidAnimation:NO didCancel:YES];
}

@end
