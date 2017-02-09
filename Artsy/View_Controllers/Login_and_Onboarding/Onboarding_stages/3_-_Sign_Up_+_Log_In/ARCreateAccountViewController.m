#import "ARCreateAccountViewController.h"

#import "ARAppConstants.h"
#import "AROnboardingViewController.h"
#import "AROnboardingNavBarView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "ARUserManager.h"
#import <Extraction/ARSpinner.h>
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "UIView+HitTestExpansion.h"
#import "ARCustomEigenLabels.h"
#import "ARNetworkErrorManager.h"
#import "ARAuthProviders.h"
#import "ARTopMenuViewController.h"
#import "ARLogger.h"

#import "ARLoginFieldsView.h"
#import "ARLoginButtonsView.h"
#import "Artsy+UILabels.h"
#import "ARFonts.h"

#import "UIDevice-Hardware.h"

#import "Artsy-Swift.h"

#import <NPKeyboardLayoutGuide/NPKeyboardLayoutGuide.h>
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <EDColor/EDColor.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

//sigh
#define EMAIL_TAG 111
#define SOCIAL_TAG 222
#define ERROR_TAG 333


@interface ARCreateAccountViewController () <UITextFieldDelegate, UIAlertViewDelegate>

@property (nonatomic, strong) ARLoginFieldsView *textFieldsView;
@property (nonatomic, strong) ARLoginButtonsView *buttonsView;
@property (nonatomic, strong) ARSerifLineHeightLabel *titleLabel;

@property (nonatomic) ARSpinner *loadingSpinner;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) NSLayoutConstraint *titleToTextFieldsSpacer;
@property (nonatomic, strong) ARWarningView *warningView;
@property (nonatomic, strong) ARTopMenuViewController *topMenuViewController;

// To stop the keyboard from appearing when brought back
// viewDidAppear gets called after the successful FB login, without a viewWillDisappear
@property (nonatomic, assign) BOOL movedToFacebook;
@end


@implementation ARCreateAccountViewController

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];


    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(textChanged:)
                                                 name:UITextFieldTextDidChangeNotification
                                               object:nil];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    if (!self.movedToFacebook) {
        [self.textFieldsView.nameField becomeFirstResponder];
    }
}

- (void)viewDidLoad
{
    UITapGestureRecognizer *keyboardCancelTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideKeyboard)];
    [self.view addGestureRecognizer:keyboardCancelTap];

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    spinner.alpha = 0;
    spinner.center = self.view.center;
    spinner.spinnerColor = [UIColor whiteColor];
    self.loadingSpinner = spinner;
    [self.view addSubview:spinner];

    [super viewDidLoad];
}

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [self showViews];
}

- (void)showViews
{
    self.view.backgroundColor = [UIColor whiteColor];

    self.titleLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:1.4];
    self.titleLabel.text = @"Set up your Artsy account";
    self.titleLabel.font = [UIFont serifFontWithSize:self.useLargeLayout ? 40.0 : 30.0];
    self.titleLabel.textAlignment = self.useLargeLayout ? NSTextAlignmentCenter : NSTextAlignmentLeft;

    [self.view addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self.view predicate:@"*.9"];
    [self.titleLabel alignCenterXWithView:self.view predicate:@"0"];
    [self.titleLabel alignTopEdgeWithView:self.view predicate:@"20"];
    [self.titleLabel constrainHeight:@"60"];

    self.textFieldsView = [[ARLoginFieldsView alloc] init];
    [self.view addSubview:self.textFieldsView];

    [self.textFieldsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.textFieldsView alignCenterXWithView:self.view predicate:@"0"];
    self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"120" : @"20"];
    [self.textFieldsView constrainHeight:@">=162"];
    [self.textFieldsView setupForSignUp];

    self.buttonsView = [[ARLoginButtonsView alloc] init];
    [self.view addSubview:self.buttonsView];
    [self.buttonsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.buttonsView alignCenterXWithView:self.view predicate:@"0"];
    [self.buttonsView constrainTopSpaceToView:self.textFieldsView predicate:@"0"];
    [self.buttonsView constrainHeight:@"300"];
    [self.buttonsView setupForSignUp];

    self.textFieldsView.nameField.delegate = self;
    self.textFieldsView.emailField.delegate = self;
    self.textFieldsView.passwordField.delegate = self;
//
//    [self.buttonsView.emailActionButton setTitle:@"Complete" forState:UIControlStateNormal];
//
//    [self.buttonsView.emailActionButton addTarget:self action:@selector(submit:) forControlEvents:UIControlEventTouchUpInside];
//    [self.buttonsView.facebookActionButton addTarget:self action:@selector(fb:) forControlEvents:UIControlEventTouchUpInside];
//
//    [self.buttonsView.emailActionButton setEnabled:[self canSubmit] animated:YES];
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    if (UIInterfaceOrientationIsLandscape([[UIApplication sharedApplication] statusBarOrientation])) {
        self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"20" : @"80"];
    }
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    self.titleToTextFieldsSpacer = [self.textFieldsView constrainTopSpaceToView:self.titleLabel predicate:self.useLargeLayout ? @"120" : @"80"];
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)hideKeyboard
{
    [self.view endEditing:YES];
}

- (BOOL)canSubmit
{
    return self.textFieldsView.emailField.text.length && self.textFieldsView.nameField.text.length && [self.textFieldsView.emailField.text containsString:@"@"] && self.textFieldsView.passwordField.text.length >= 6;
}

- (void)setFormEnabled:(BOOL)enabled
{
    [@[ self.textFieldsView.nameField, self.textFieldsView.emailField, self.textFieldsView.passwordField ] each:^(ARTextFieldWithPlaceholder *textField) {
        textField.enabled = enabled;
        textField.alpha = enabled ? 1 : 0.3;
    }];

    if (enabled) {
        [self.loadingSpinner fadeOutAnimated:YES];
    } else {
        [self.loadingSpinner fadeInAnimated:YES];
    }
}

- (NSString *)existingAccountSource:(NSDictionary *)JSON
{
    NSArray *providers = JSON[@"providers"];
    if (providers) {
        return [providers.first lowercaseString];
    }
    NSString *message = JSON[@"text"];
    if (!message) {
        return @"email";
    }
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"A user with this email has already signed up with ([A-Za-z]+)." options:0 error:nil];
    NSTextCheckingResult *match = [regex firstMatchInString:message options:0 range:NSMakeRange(0, message.length)];
    if ([match numberOfRanges] != 2) {
        return @"email";
    }
    NSString *provider = [message substringWithRange:[match rangeAtIndex:1]];
    return [provider lowercaseString];
}

- (void)submit:(id)sender
{
    [self setFormEnabled:NO];

    NSString *username = self.textFieldsView.emailField.text;
    NSString *password = self.textFieldsView.passwordField.text;

    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] createUserWithName:self.textFieldsView.nameField.text email:username password:password success:^(User *user) {
        __strong typeof (wself) sself = wself;
        [sself loginWithUserCredentialsWithSuccess:^{
            [sself.delegate dismissOnboardingWithVoidAnimation:YES];
        }];
    } failure:^(NSError *error, id JSON) {
        __strong typeof (wself) sself = wself;
        if (JSON
            && [JSON isKindOfClass:[NSDictionary class]]
            && ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                || [JSON[@"error"] isEqualToString:@"User Already Invited"])) {
                NSString *source = [sself existingAccountSource:JSON];
                [sself accountExists:source];

        } else {
            [sself showWarningCouldNotCreateAccount];
        }
    }];
}

- (void)showWarningCouldNotCreateAccount
{
    [self setFormEnabled:YES];

    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t create your account" message:@"Please check your email address & password" delegate:nil cancelButtonTitle:@"Dismiss" otherButtonTitles:nil];
    [alert show];

    [self.textFieldsView.emailField becomeFirstResponder];
}

- (void)loginWithUserCredentialsWithSuccess:(void (^)())success
{
    NSString *username = self.textFieldsView.emailField.text;
    NSString *password = self.textFieldsView.passwordField.text;

    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] loginWithUsername:username
        password:password
        successWithCredentials:nil
        gotUser:^(User *currentUser) { success();
        }
        authenticationFailure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself setFormEnabled:YES];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t Log In" message:@"Please check your email and password." delegate:nil cancelButtonTitle:@"Dismiss" otherButtonTitles:nil];
        [alert show];
        }
        networkFailure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself setFormEnabled:YES];
        [sself performSelector:_cmd withObject:self afterDelay:3];
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Sign up failed."];
        }];
}

- (void)accountExists:(NSString *)source
{
    NSString *message;
    NSInteger tag;
    if ([source isEqualToString:@"email"]) {
        message = [NSString stringWithFormat:@"An account already exists for the email address \"%@\".", self.textFieldsView.emailField.text];
        tag = EMAIL_TAG;
    } else {
        message = [NSString stringWithFormat:@"An account already exists for the email address \"%@\". Please log in via %@.",
                                             self.self.textFieldsView.emailField.text,
                                             [source capitalizedString]];
        tag = SOCIAL_TAG;
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Account Already Exists" message:message delegate:self cancelButtonTitle:@"Log In" otherButtonTitles:nil];
    alert.tag = tag;
    [alert show];
}

- (void)showWarning:(NSString *)msg animated:(BOOL)animates
{
    if (!self.warningView) {
        self.warningView = [[ARWarningView alloc] initWithFrame:CGRectZero];

        ARTopMenuViewController *topMenu = self.topMenuViewController;
        UIViewController *hostVC = topMenu.visibleViewController;
        UIView *hostView = hostVC.view;

        [hostView addSubview:self.warningView];

        [self.warningView constrainHeight:@"50"];
        [self.warningView constrainWidthToView:hostView predicate:@"0"];
        [self.warningView alignAttribute:NSLayoutAttributeBottom
                             toAttribute:NSLayoutAttributeTop
                                  ofView:topMenu.keyboardLayoutGuide
                               predicate:@"0"];

        UITapGestureRecognizer *removeTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(removeWarning)];
        [self.warningView addGestureRecognizer:removeTapGesture];
        self.warningView.userInteractionEnabled = YES;
    }

    self.warningView.alpha = 0;
    self.warningView.text = msg;
    self.warningView.backgroundColor = [UIColor colorWithHex:0xdf6964];
    self.warningView.textColor = [UIColor whiteColor];

    [UIView animateIf:animates duration:ARAnimationQuickDuration:^{
        self.warningView.alpha = 1;
    }];

    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(removeWarning) object:nil];
    [self performSelector:@selector(removeWarning) withObject:nil afterDelay:5.0];
}

- (void)removeWarning
{
    [self removeWarning:ARPerformWorkAsynchronously];
}

- (void)removeWarning:(BOOL)animates
{
    [UIView animateIf:animates duration:ARAnimationDuration:^{
        self.warningView.alpha = 0;

    } completion:^(BOOL finished) {
        [self.warningView removeFromSuperview];
        self.warningView = nil;
    }];
}

- (void)viewWillDisappear:(BOOL)animated
{
    if (self.warningView) [self removeWarning:animated];
    [self hideKeyboard];

    [super viewWillDisappear:animated];

    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UITextFieldTextDidChangeNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillShowNotification
                                                  object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
}

- (void)fb:(id)sender
{
    __weak typeof(self) wself = self;
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    self.movedToFacebook = YES;
    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
        __strong typeof (wself) sself = wself;
        [sself fbSuccessWithToken:token email:email name:name];

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        
        NSString * reason = error.userInfo[@"com.facebook.sdk:ErrorLoginFailedReason"];
        if (![reason isEqualToString:@"com.facebook.sdk:UserLoginCancelled"]) {
            [sself fbError];
        }
    }];
}

- (void)fbSuccessWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name
{
    __weak typeof(self) wself = self;
    if (email || ![email isEqualToString:@""]) {
        [[ARUserManager sharedManager] createUserViaFacebookWithToken:token
            email:email
            name:name
            success:^(User *user) {
                                                                  __strong typeof (wself) sself = wself;
                                                                  // we've created a user, now let's log them in
                                                                  [sself loginWithFacebookCredentialToken:token];
            }
            failure:^(NSError *error, id JSON) {
                                                                  __strong typeof (wself) sself = wself;
                                                                  if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
                                                                      if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                                                                          // this facebook account is already an artsy account
                                                                          // let's log them in
                                                                          [sself loginWithFacebookCredentialToken:token];
                                                                          return;
                                                                      } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                                                                                 || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                                                                          // there's already a user with this email
                                                                          NSString *source = [self existingAccountSource:JSON];
                                                                          [sself accountExists:source];
                                                                          return;
                                                                      }
                                                                  }
                                                                  
                                                                  // something else went wrong
                                                                  ARErrorLog(@"Couldn't link Facebook account. Error: %@. The server said: %@", error.localizedDescription, JSON);
                                                                  
                                                                  NSString *errorMessage = [NSString stringWithFormat:@"Server replied saying '%@'.", JSON[@"error"] ?: JSON[@"message"] ?: error.localizedDescription];
                                                                  
                                                                  // we'll display an alert view
                                                                  [sself showErrorAlertWithMessage:errorMessage];
            }];

    } else {
        // provide popup warning asking the user to use a Facebook account with email
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];

        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t create your account" message:@"Please use a Facebook account that has an email address" delegate:nil cancelButtonTitle:@"Dismiss" otherButtonTitles:nil];
        alert.tag = ERROR_TAG;
        [alert show];
    }
}

- (void)loginWithFacebookCredentialToken:(NSString *)token
{
    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] loginWithFacebookToken:token
        successWithCredentials:nil
        gotUser:^(User *currentUser) {
                                                      __strong typeof (wself) sself = wself;
                                                      // we've logged them in, let's wrap up
                                                      [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                                                      [sself.delegate finishAccountCreation];
        }
        authenticationFailure:^(NSError *error) {
                                        // TODO: handle this
                                        __strong typeof (wself) sself = wself;
                                        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        }
        networkFailure:^(NSError *error) {
                                               // TODO: handle this
                                               __strong typeof (wself) sself = wself;
                                               [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        }];
}

- (void)showErrorAlertWithMessage:(NSString *)errorMessage
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error Creating\na New Artsy Account" message:errorMessage delegate:self cancelButtonTitle:@"Close" otherButtonTitles:nil];
    alert.tag = ERROR_TAG;
    [alert show];
}


- (void)fbError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Facebook credentials"
                                                    message:@"Couldn’t get Facebook credentials. Please link a Facebook account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
}

#pragma mark -
#pragma mark UITextField

- (void)textChanged:(NSNotification *)n
{
//    [self.buttonsView.emailActionButton setEnabled:[self canSubmit] animated:YES];
}

- (void)textFieldDidBeginEditing:(UITextField *)textField
{
    textField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:textField.placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGrayMedium]}];

    ((ARTextFieldWithPlaceholder *)textField).baseline.backgroundColor = [UIColor blackColor].CGColor;
}

- (void)textFieldDidEndEditing:(UITextField *)textField
{
    textField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:textField.placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGraySemibold]}];

    ((ARTextFieldWithPlaceholder *)textField).baseline.backgroundColor = [UIColor artsyGrayRegular].CGColor;
}

#pragma mark - delegate
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if (textField == self.textFieldsView.nameField) {
        [self.textFieldsView.emailField becomeFirstResponder];
        return YES;
    } else if (textField == self.textFieldsView.emailField) {
        [self.textFieldsView.passwordField becomeFirstResponder];
        return YES;
    } else if ([self canSubmit]) {
        [self submit:nil];
        return YES;
    }

    if (![self.textFieldsView.emailField.text containsString:@"@"]) {
        [self showWarning:@"Email address appears to be invalid" animated:YES];
    } else if (self.textFieldsView.passwordField.text.length < 6) {
        [self showWarning:@"Password must be at least 6 characters" animated:YES];
    }
    return NO;
}

#pragma mark - UIAlertViewDelegate

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    NSString *email = nil;
    if (alertView.tag == EMAIL_TAG) {
        email = self.textFieldsView.emailField.text;
//        [self.delegate logInWithEmail:email];
    } else if (alertView.tag == ERROR_TAG) {
        [self setFormEnabled:YES];
    }
}

#pragma mark - DI

- (ARTopMenuViewController *)topMenuViewController
{
    return _topMenuViewController ?: [ARTopMenuViewController sharedController];
}

@end
