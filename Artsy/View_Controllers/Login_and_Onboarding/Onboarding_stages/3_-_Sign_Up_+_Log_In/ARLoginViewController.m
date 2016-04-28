#import "ARLoginViewController.h"

#import "ARLoginFieldsView.h"
#import "ARLoginButtonsView.h"
#import "Artsy+UILabels.h"

#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROnboardingNavBarView.h"
#import "ARAuthProviders.h"
#import "UIViewController+FullScreenLoading.h"
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "UIView+HitTestExpansion.h"
#import "ARTheme.h"
#import "ARNetworkErrorManager.h"
#import "ARDispatchManager.h"
#import "ARDeveloperOptions.h"
#import "ARLogger.h"

#import "UIDevice-Hardware.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <ORStackView/ORStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

#define SPINNER_TAG 0x555


@interface ARLoginViewController () <UITextFieldDelegate>

@property (nonatomic, strong) ARLoginFieldsView *textFieldsView;
@property (nonatomic, strong) ARLoginButtonsView *buttonsView;
@property (nonatomic, strong) ARSerifLineHeightLabel *titleLabel;

@property (nonatomic, strong) AROnboardingNavBarView *navView;
@property (nonatomic, strong) UIButton *testBotButton;
@property (nonatomic, strong) ARUppercaseButton *loginButton;
@property (nonatomic, strong) NSString *email;

@property (nonatomic, strong) ORStackView *containerView;
@property (nonatomic, strong) ARTextFieldWithPlaceholder *emailTextField;
@property (nonatomic, strong) ARSecureTextFieldWithPlaceholder *passwordTextField;
@property (nonatomic, strong) UIButton *forgotPasswordButton;
@property (nonatomic, strong) ARWhiteFlatButton *facebookLoginButton;
@property (nonatomic, strong) ARWhiteFlatButton *twitterLoginButton;

@property (nonatomic, strong) NSLayoutConstraint *keyboardConstraint;
@end


@implementation ARLoginViewController

- (instancetype)initWithEmail:(NSString *)email
{
    self = [super init];
    if (self) {
        _email = email;
    }
    return self;
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [self showViews];
}

- (void)showViews
{
    self.view.backgroundColor = [UIColor whiteColor];

    self.titleLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:1.4];
    self.titleLabel.text = @"Log in to your Artsy account";
    self.titleLabel.font = [UIFont serifFontWithSize:24.0];

    [self.view addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self.view predicate:@"*.9"];
    [self.titleLabel alignCenterXWithView:self.view predicate:@"0"];
    [self.titleLabel alignTopEdgeWithView:self.view predicate:@"20"];
    [self.titleLabel constrainHeight:@"80"];

    self.textFieldsView = [[ARLoginFieldsView alloc] init];
    [self.view addSubview:self.textFieldsView];

    [self.textFieldsView constrainWidthToView:self.view predicate:@"*.9"];
    [self.textFieldsView alignCenterXWithView:self.view predicate:@"0"];
    [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:@"20"];
    [self.textFieldsView constrainHeight:@">=108"];
    [self.textFieldsView setupForLogin];

    self.buttonsView = [[ARLoginButtonsView alloc] init];
    [self.view addSubview:self.buttonsView];
    [self.buttonsView constrainWidthToView:self.view predicate:@"*.9"];
    [self.buttonsView alignCenterXWithView:self.view predicate:@"0"];
    [self.buttonsView constrainTopSpaceToView:self.textFieldsView predicate:@"40"];
    [self.buttonsView constrainHeight:@"200"];
    [self.buttonsView setupForLogin];
}

//- (void)viewDidLoad
//{
//    self.view.backgroundColor = [UIColor clearColor];
//    UITapGestureRecognizer *keyboardCancelTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideKeyboard)];
//    [self.view addGestureRecognizer:keyboardCancelTap];
//
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
//
//    self.navView = [self createNav];
//    self.loginButton = self.navView.forward;
//    [self.view addSubview:self.navView];
//
//    self.containerView = [[ORStackView alloc] init];
//    [self.view addSubview:self.containerView];
//    [self.containerView alignCenterXWithView:self.view predicate:@"0"];
//    [self.containerView constrainWidth:@"280"];
//
//    self.emailTextField = [[ARTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
//    self.emailTextField.placeholder = @"Email";
//    self.emailTextField.delegate = self;
//    self.emailTextField.returnKeyType = UIReturnKeyNext;
//    self.emailTextField.keyboardType = UIKeyboardTypeEmailAddress;
//    self.emailTextField.autocorrectionType = UITextAutocorrectionTypeNo;
//    self.emailTextField.autocapitalizationType = UITextAutocapitalizationTypeNone;
//    self.emailTextField.keyboardAppearance = UIKeyboardAppearanceDark;
//
//    [self.containerView addSubview:self.emailTextField withTopMargin:@"0" sideMargin:nil];
//
//    self.passwordTextField = [[ARSecureTextFieldWithPlaceholder alloc] init];
//    self.passwordTextField.delegate = self;
//    self.passwordTextField.returnKeyType = UIReturnKeyDone;
//    self.passwordTextField.placeholder = @"Password";
//    [self.containerView addSubview:self.passwordTextField withTopMargin:@"10" sideMargin:nil];
//
//    if (self.email) {
//        self.emailTextField.text = self.email;
//        [self.passwordTextField becomeFirstResponder];
//    }
//
//    for (UITextField *textField in @[ self.emailTextField, self.passwordTextField ]) {
//        if ([textField respondsToSelector:@selector(setAutocorrectionType:)]) {
//            textField.autocorrectionType = UITextAutocorrectionTypeNo;
//        }
//        textField.clearButtonMode = UITextFieldViewModeWhileEditing;
//        textField.textColor = [UIColor whiteColor];
//        textField.keyboardAppearance = UIKeyboardAppearanceDark;
//        textField.keyboardType = UIKeyboardTypeEmailAddress;
//        textField.contentVerticalAlignment = UIControlContentVerticalAlignmentCenter;
//        [textField ar_extendHitTestSizeByWidth:0 andHeight:10];
//    }
//
//    self.forgotPasswordButton = [[UIButton alloc] initWithFrame:CGRectZero];
//    [self.forgotPasswordButton setTitle:@"FORGOT PASSWORD?" forState:UIControlStateNormal];
//    [self.containerView addSubview:self.forgotPasswordButton withTopMargin:@"10"];
//    [self.forgotPasswordButton alignTrailingEdgeWithView:self.containerView predicate:@"-15"];
//    [self.forgotPasswordButton addTarget:self action:@selector(forgotPassword:) forControlEvents:UIControlEventTouchUpInside];
//    self.forgotPasswordButton.titleLabel.font = [UIFont sansSerifFontWithSize:10];
//
//    self.facebookLoginButton = [[ARWhiteFlatButton alloc] initWithFrame:CGRectZero];
//    [self.facebookLoginButton setTitle:@"Connect With Facebook" forState:UIControlStateNormal];
//    [self.containerView addSubview:self.facebookLoginButton withTopMargin:@"29" sideMargin:nil];
//    [self.facebookLoginButton addTarget:self action:@selector(fb:) forControlEvents:UIControlEventTouchUpInside];
//
//
//    self.twitterLoginButton = [[ARWhiteFlatButton alloc] initWithFrame:CGRectZero];
//    [self.twitterLoginButton setTitle:@"Connect With Twitter" forState:UIControlStateNormal];
//    [self.containerView addSubview:self.twitterLoginButton withTopMargin:@"10" sideMargin:nil];
//    [self.twitterLoginButton addTarget:self action:@selector(twitter:) forControlEvents:UIControlEventTouchUpInside];
//
//    if ([UIDevice isPad]) {
//        [self.emailTextField becomeFirstResponder];
//        [self.containerView alignCenterYWithView:self.view predicate:@"0@750"];
//        self.keyboardConstraint = [self.containerView alignBottomEdgeWithView:self.view predicate:@"<=0@1000"];
//    } else {
//        [self.containerView alignBottomEdgeWithView:self.view predicate:@"<=-56"];
//        //        [self.containerView alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:self.navView predicate:@">=0"];
//        //        [self.containerView setContentHuggingPriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisVertical];
//        self.keyboardConstraint = [self.forgotPasswordButton alignBottomEdgeWithView:self.view predicate:@"<=0@1000"];
//    }
//
//    [super viewDidLoad];
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(didBecomeActive)
//                                                 name:UIApplicationDidBecomeActiveNotification
//                                               object:nil];
//}
//
//- (void)dealloc
//{
//    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
//}
//
//- (void)didBecomeActive
//{
//    // If you've cancelled a twitter request we're currently showing the loader
//    // add a delay so the user gets that they were doing something as they were leaving.
//    ar_dispatch_after(0.3, ^{
//        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//    });
//}
//
//- (void)hideKeyboard
//{
//    [self.view endEditing:YES];
//}
//
//- (AROnboardingNavBarView *)createNav
//{
//    AROnboardingNavBarView *navView = [[AROnboardingNavBarView alloc] init];
//    [navView.title setText:@"Welcome Back"];
//
//    [navView.back setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
//    [navView.back setImage:[UIImage imageNamed:@"BackArrow_Highlighted"] forState:UIControlStateHighlighted];
//    [navView.back addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
//
//    [navView.forward setTitle:@"LOG IN" forState:UIControlStateNormal];
//    [navView.forward addTarget:self action:@selector(login:) forControlEvents:UIControlEventTouchUpInside];
//    return navView;
//}
//
//- (void)twitter:(id)sender
//{
//    [self hideKeyboard];
//    __weak typeof(self) wself = self;
//
//    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
//
//    [ARAuthProviders getReverseAuthTokenForTwitter:^(NSString *token, NSString *secret) {
//        [[ARUserManager sharedManager] loginWithTwitterToken:token
//            secret:secret
//            successWithCredentials:nil
//            gotUser:^(User *currentUser) {
//                __strong typeof (wself) sself = wself;
//                [sself loggedInWithType:ARLoginViewControllerLoginTypeTwitter user:currentUser];
//            } authenticationFailure:^(NSError *error) {
//                __strong typeof (wself) sself = wself;
//                [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//                [sself twitterError];
//
//            } networkFailure:^(NSError *error) {
//                __strong typeof (wself) sself = wself;
//                [sself failedToLoginToTwitter:error];
//            }];
//
//    } failure:^(NSError *error) {
//             __strong typeof (wself) sself = wself;
//             [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//             [sself twitterError];
//    }];
//}
//
//- (void)loggedInWithType:(ARLoginViewControllerLoginType)type user:(User *)currentUser
//{
//    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//    [self loggedInWithUser:currentUser];
//}
//
//- (void)failedToLoginToTwitter:(NSError *)error
//{
//    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//    [self networkFailure:error];
//}
//
//- (void)fb:(id)sender
//{
//    [self hideKeyboard];
//    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
//
//    __weak typeof(self) wself = self;
//    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
//        [[ARUserManager sharedManager] loginWithFacebookToken:token
//           successWithCredentials:nil gotUser:^(User *currentUser) {
//               __strong typeof (wself) sself = wself;
//                [sself loggedInWithType:ARLoginViewControllerLoginTypeFacebook user:currentUser];
//           } authenticationFailure:^(NSError *error) {
//               __strong typeof (wself) sself = wself;
//
//               [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//
//               NSString * reason = error.userInfo[@"com.facebook.sdk:ErrorLoginFailedReason"];
//               if (![reason isEqualToString:@"com.facebook.sdk:UserLoginCancelled"]) {
//                   [sself fbError];
//               } else if ([error.userInfo[@"AFNetworkingOperationFailingURLResponseErrorKey"] statusCode] == 401) {
//                   // This case handles a 401 from Artsy's server, which means the Facebook account is not associated with a user.
//                   [sself fbNoUser];
//               }
//
//           } networkFailure:^(NSError *error) {
//               __strong typeof (wself) sself = wself;
//               [sself failedToLoginToFacebook:error];
//           }];
//    } failure:^(NSError *error) {
//        __strong typeof (wself) sself = wself;
//
//        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//        [sself fbError];
//    }];
//}
//
//- (void)failedToLoginToFacebook:(NSError *)error;
//{
//    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
//    [self networkFailure:error];
//}
//
//- (void)fbError
//{
//    [UIAlertView showWithTitle:@"Couldn’t get Facebook credentials"
//                       message:@"Couldn’t get Facebook credentials. If you continue having trouble, please email Artsy support at support@artsy.net"
//             cancelButtonTitle:@"OK"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}
//
//- (void)fbNoUser
//{
//    [UIAlertView showWithTitle:@"Account not found"
//                       message:@"We couldn't find an Artsy account associated with your Facebook profile. You can link your Facebook account in your settings on artsy.net. If you continue having trouble, please email Artsy support at support@artsy.net"
//             cancelButtonTitle:@"OK"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}
//
//- (void)twitterError
//{
//    [UIAlertView showWithTitle:@"Couldn’t get Twitter credentials"
//                       message:@"Couldn’t get Twitter credentials. Please link a Twitter account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
//             cancelButtonTitle:@"OK"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}
//
//- (void)keyboardWillShow:(NSNotification *)notification
//{
//    CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
//    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
//
//    self.keyboardConstraint.constant = -keyboardSize.height - ([UIDevice isPad] ? 20 : 10);
//    [UIView animateIf:YES duration:duration:^{
//        [self.view layoutIfNeeded];
//    }];
//}
//
//- (void)keyboardWillHide:(NSNotification *)notification
//{
//    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];
//
//    self.keyboardConstraint.constant = 0;
//    [UIView animateIf:YES duration:duration:^{
//        [self.view layoutIfNeeded];
//    }];
//}
//
//- (void)viewWillAppear:(BOOL)animated
//{
//    [self.emailTextField addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
//    [self.passwordTextField addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
//
//    self.testBotButton.titleLabel.font = [ARTheme defaultTheme].fonts[@"ButtonFont"];
//    self.loginButton.titleLabel.font = [ARTheme defaultTheme].fonts[@"ButtonFont"];
//
//    [super viewWillAppear:animated];
//}
//
//- (void)viewDidAppear:(BOOL)animated
//{
//#if (AR_SHOW_ALL_DEBUG)
//    [self showAutoLoginButtons];
//    [self setupDefaultUsernameAndPassword];
//    [self textFieldDidChange:nil];
//#endif
//
//    [super viewDidAppear:animated];
//}
//
//- (void)autoLogIn:(id)sender
//{
//// this won't leak passwords into the build unless you've
//// somehow got a simulator only build, which is only
//// really possible if you grab a dev's laptop
//
//// ... in which case you've got the source, so who'd bother running strings?
//
//#if (AR_SHOW_ALL_DEBUG)
//    NSString *username, *password;
//
//    username = @"energytestbot@artsymail.com";
//    password = @"wy-rhu-hoki-tha-whil";
//
//    self.emailTextField.text = username;
//    self.passwordTextField.text = password;
//
//    [self login:nil];
//#endif
//}
//
//- (void)showAutoLoginButtons
//{
//    self.testBotButton.hidden = NO;
//    self.testBotButton.enabled = YES;
//}
//
//- (void)login:(id)sender
//{
//    if ([self validates]) {
//        [self loginWithUsername:_emailTextField.text andPassword:_passwordTextField.text];
//    }
//}
//
//- (void)forgotPassword:(id)sender
//{
//    UIAlertView *alert = [[UIAlertView alloc]
//            initWithTitle:@"Forgot Password"
//                  message:@"Please enter your email address and we’ll send you a reset link."
//                 delegate:nil
//        cancelButtonTitle:@"Cancel"
//        otherButtonTitles:@"Send Link", nil];
//    alert.alertViewStyle = UIAlertViewStylePlainTextInput;
//    [[alert textFieldAtIndex:0] setKeyboardAppearance:UIKeyboardAppearanceDark];
//    alert.tapBlock = ^(UIAlertView *alertView, NSInteger buttonIndex) {
//        if (buttonIndex == alertView.firstOtherButtonIndex) {
//            NSString *email = [[alertView textFieldAtIndex:0] text];
//            if (!email.length || ![email containsString:@"@"]) {
//                [self passwordResetError:@"Please check your email address"];
//            } else {
//                [self showSpinner];
//                [self sendPasswordResetEmail:email];
//            }
//        }
//    };
//    [self hideKeyboard];
//    [alert show];
//}
//
//- (void)sendPasswordResetEmail:(NSString *)email
//{
//    [[ARUserManager sharedManager] sendPasswordResetForEmail:email success:^{
//        [self passwordResetSent];
//        ARActionLog(@"Sent password reset request for %@", email);
//    } failure:^(NSError *error) {
//        ARErrorLog(@"Password reset failed for %@. Error: %@", email, error.localizedDescription);
//        [self passwordResetError:@"Couldn’t send reset password link. Please try again, or contact support@artsy.net"];
//    }];
//}
//
//- (BOOL)validates
//{
//    return self.emailTextField.text.length && self.passwordTextField.text.length;
//}
//
//- (void)loginWithUsername:(NSString *)username andPassword:(NSString *)password
//{
//    if ([username isEqualToString:@"orta"]) {
//        username = @"orta.therox@gmail.com";
//    }
//
//    self.loginButton.alpha = 0.5;
//
//    __weak typeof(self) wself = self;
//    [[ARUserManager sharedManager] loginWithUsername:username
//        password:password
//        successWithCredentials:nil
//        gotUser:^(User *currentUser) {
//        __strong typeof (wself) sself = wself;
//        [sself loggedInWithType:ARLoginViewControllerLoginTypeEmail user:currentUser];
//        }
//
//        authenticationFailure:^(NSError *error) {
//        __strong typeof (wself) sself = wself;
//        [sself authenticationFailure];
//        }
//
//        networkFailure:^(NSError *error) {
//        __strong typeof (wself) sself = wself;
//        [sself networkFailure:error];
//        }];
//}
//
//- (void)authenticationFailure
//{
//    [self resetForm];
//    [self presentErrorMessage:@"Please check your email and password"];
//}
//
//- (void)networkFailure:(NSError *)error
//{
//    [ARNetworkErrorManager presentActiveError:error withMessage:@"Sign in failed."];
//    self.loginButton.alpha = 1;
//}
//
//- (void)presentErrorMessage:(NSString *)message
//{
//    [UIAlertView showWithTitle:@"Couldn’t Log In"
//                       message:message
//             cancelButtonTitle:@"Dismiss"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}
//
//- (void)loggedInWithUser:(User *)user
//{
//    [self.delegate dismissOnboardingWithVoidAnimation:YES];
//}
//
//- (void)resetForm
//{
//    self.passwordTextField.text = @"";
//    self.loginButton.alpha = 1;
//}
//
//- (BOOL)textFieldShouldReturn:(UITextField *)textField
//{
//    if ([textField isEqual:self.emailTextField]) {
//        [self.passwordTextField becomeFirstResponder];
//    } else {
//        [self login:nil];
//    }
//    return YES;
//}
//
//- (void)textFieldDidChange:(UITextView *)textView;
//{
//    [self.loginButton setEnabled:[self validates] animated:YES];
//}
//
//- (void)setupDefaultUsernameAndPassword
//{
//    if (([ARDeveloperOptions options][@"username"] && [ARDeveloperOptions options][@"password"]) && self.hideDefaultValues == NO) {
//        self.emailTextField.text = [ARDeveloperOptions options][@"username"];
//        self.passwordTextField.secureTextEntry = YES;
//        self.passwordTextField.text = [ARDeveloperOptions options][@"password"];
//        self.passwordTextField.secureTextEntry = NO;
//    }
//}
//
//- (void)back:(id)sender
//{
//    // If self.email is set, we got dropped off here from SSO
//    // so we wanna go back to the splash instead.
//
//    if (self.email) {
//        [self.delegate slideshowDone];
//    }
//
//    [self.navigationController popViewControllerAnimated:YES];
//}
//
//- (void)showSpinner
//{
//    UIView *view = [[UIView alloc] initWithFrame:self.view.bounds];
//    view.backgroundColor = [UIColor colorWithWhite:0 alpha:.5];
//    UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
//    [view addSubview:spinner];
//    spinner.center = CGPointMake(CGRectGetMidX(self.view.bounds), CGRectGetMidY(self.view.bounds));
//    [spinner startAnimating];
//
//    UILabel *label = [[UILabel alloc] init];
//    label.font = [UIFont serifFontWithSize:16];
//    label.textColor = [UIColor whiteColor];
//    [label sizeToFit];
//    label.center = CGPointMake(spinner.center.x, spinner.center.y + 50);
//    [view addSubview:label];
//    [self.view addSubview:view];
//    view.tag = SPINNER_TAG;
//
//    //we dont want the keyboard to shoot up while we're spinning
//    [self hideKeyboard];
//}
//
//- (void)hideSpinner
//{
//    UIView *view = [self.view viewWithTag:SPINNER_TAG];
//    [view removeFromSuperview];
//}
//
//- (void)passwordResetError:(NSString *)message
//{
//    [self hideSpinner];
//    [UIAlertView showWithTitle:@"Couldn’t Reset Password"
//                       message:message
//             cancelButtonTitle:@"OK"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}
//
//- (void)passwordResetSent
//{
//    [self hideSpinner];
//    [UIAlertView showWithTitle:@"Please Check Your Email"
//                       message:@"We have sent you an email with a link to reset your password"
//             cancelButtonTitle:@"OK"
//             otherButtonTitles:nil
//                      tapBlock:nil];
//}

@end
