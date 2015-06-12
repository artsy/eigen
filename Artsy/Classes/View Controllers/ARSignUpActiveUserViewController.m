#import "ARSignUpActiveUserViewController.h"
#import "AROnboardingNavBarView.h"

@interface ARSignUpActiveUserViewController ()
@property (nonatomic, strong) AROnboardingNavBarView *navView;
@property (nonatomic, strong) NSString *message;
@end

@implementation ARSignUpActiveUserViewController

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

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

        case ARTrialContextArtworkOrder:
            message = @"Sign up for a free account\nto buy works.";
            break;
            
        case ARTrialContextFairGuide:
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

    AROnboardingNavBarView *navView = [[AROnboardingNavBarView alloc] init];
    [self.view addSubview:navView];
    self.navView = navView;

    [navView.title setText:@""];

    [navView.back setImage:[UIImage imageNamed:@"CloseButtonLarge"] forState:UIControlStateNormal];
    [navView.back setImage:[UIImage imageNamed:@"CloseButtonLargeHighlignted"] forState:UIControlStateHighlighted];
    [navView.back addTarget:self action:@selector(goBackToApp:) forControlEvents:UIControlEventTouchUpInside];

    [navView.forward setTitle:@"LOG IN" forState:UIControlStateNormal];
    [navView.forward addTarget:self action:@selector(goToLogin:) forControlEvents:UIControlEventTouchUpInside];
    [navView.forward setEnabled:YES animated:NO];

    self.bodyCopyLabel.font = [UIFont serifFontWithSize:22];
    self.bodyCopyLabel.backgroundColor = [UIColor clearColor];
    self.bodyCopyLabel.opaque = NO;
    self.bodyCopyLabel.lineHeight = 6;
    self.bodyCopyLabel.text = self.message;

    [super viewDidLoad];
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

- (IBAction)connectWithTwitter:(id)sender
{
    [self.delegate signUpWithTwitter];
}

- (IBAction)signUpWithEmail:(id)sender
{
    [self.delegate signUpWithEmail];
}

- (void)goToLogin:(id)sender
{
    [self.delegate logInWithEmail:nil];
}

- (void)goBackToApp:(id)sender
{
    [UIView animateIf:YES duration:ARAnimationQuickDuration :^{
        self.topView.alpha = 0;
        self.bottomView.alpha = 0;
    }];
    [self.delegate dismissOnboardingWithVoidAnimation:NO didCancel:YES];

}

@end
