#import "ARSignupViewController.h"
#import "AROnboardingNavBarView.h"
#import "ARTermsAndConditionsView.h"


@interface ARSignupViewController () <UIAlertViewDelegate, UITextViewDelegate>
@property (nonatomic) AROnboardingNavBarView *navbar;
@property (nonatomic) ARWhiteFlatButton *email;
@property (nonatomic) ARWhiteFlatButton *twitter;
@property (nonatomic) ARWhiteFlatButton *facebook;
@property (nonatomic) UIImageView *backgroundView;
@end

@implementation ARSignupViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.navbar = [[AROnboardingNavBarView alloc] init];
    [self.view addSubview:self.navbar];
    [self.navbar.title setText:@"Sign Up"];
    [self.navbar.back addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];

    self.facebook = [[ARWhiteFlatButton alloc] init];
    [self.facebook setTitle:@"Connect with Facebook" forState:UIControlStateNormal];
    [self.facebook addTarget:self action:@selector(fb:) forControlEvents:UIControlEventTouchUpInside];

    self.twitter = [[ARWhiteFlatButton alloc] init];
    [self.twitter setTitle:@"Connect with Twitter" forState:UIControlStateNormal];
    [self.twitter addTarget:self action:@selector(twitter:) forControlEvents:UIControlEventTouchUpInside];

    self.email = [[ARWhiteFlatButton alloc] init];
    [self.email setTitle:@"Sign up with email" forState:UIControlStateNormal];
    [self.email addTarget:self action:@selector(email:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:self.email];

    ARTermsAndConditionsView *label = [[ARTermsAndConditionsView alloc] init];
    [label constrainWidth:@"280"];

    [@[self.facebook, self.twitter, self.email, label] each:^(UIView *view) {
        [self.view addSubview:view];
        [view alignCenterXWithView:self.view predicate:nil];
    }];

    [self.twitter constrainTopSpaceToView:self.facebook predicate:@"10"];
    [self.email constrainTopSpaceToView:self.twitter predicate:@"10"];
    [label constrainTopSpaceToView:self.email predicate:@"10"];

    if ([UIDevice isPad]) {
        [self.twitter alignCenterYWithView:self.view predicate:@"0"];
    } else {
        [label alignBottomEdgeWithView:self.view predicate:@"<=-56"];
    }
}

- (void)openTerms
{
    [self.delegate showTermsAndConditions];
}

- (void)openPrivacy
{
    [self.delegate showPrivacyPolicy];
}

- (void)fb:(id)sender
{
    [self.delegate signUpWithFacebook];
}

- (void)twitter:(id)sender
{
    [self.delegate signUpWithTwitter];
}

- (void)email:(id)sender
{
    [self.delegate signUpWithEmail];
}

- (void)back:(id)sender
{
    [self.delegate popViewControllerAnimated:YES];
}

@end
