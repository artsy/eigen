#import "AROnboardingMoreInfoViewController.h"
#import "ARAuthProviders.h"
#import "AROnboardingNavBarView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARUserManager.h"
#import "AROnboardingViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>
#import "UIView+HitTestExpansion.h"
#import "ARNetworkErrorManager.h"
#import "ARLogger.h"

#import "UIDevice-Hardware.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

//sigh
#define EMAIL_TAG 111
#define SOCIAL_TAG 222


@interface AROnboardingMoreInfoViewController () <UITextFieldDelegate, UIAlertViewDelegate>
@property (nonatomic) NSString *token;
@property (nonatomic) NSString *secret;
@property (nonatomic) NSString *name;
@property (nonatomic) NSString *email;
@property (nonatomic) UIView *containerView;
@property (nonatomic) AROnboardingNavBarView *navBar;
@property (nonatomic) ARTextFieldWithPlaceholder *nameField;
@property (nonatomic) ARTextFieldWithPlaceholder *emailField;
@property (nonatomic) NSLayoutConstraint *keyboardConstraint;
@property (nonatomic) ARAuthProviderType provider;
@end


@implementation AROnboardingMoreInfoViewController

- (instancetype)initForFacebookWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name
{
    self = [super init];
    if (self) {
        _provider = ARAuthProviderFacebook;
        _token = token;
        _name = name;
        _email = email;
    }
    return self;
}

- (instancetype)initForTwitterWithToken:(NSString *)token andSecret:(NSString *)secret
{
    self = [super init];
    if (self) {
        _provider = ARAuthProviderTwitter;
        _token = token;
        _secret = secret;
    }
    return self;
}

- (void)viewDidLoad
{
    [self setupUI];
    [super viewDidLoad];
}

- (void)setupUI
{
    self.navBar = [[AROnboardingNavBarView alloc] init];
    self.navBar.title.text = @"Almost Done…";
    [self.navBar.back addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
    [self.navBar.forward setTitle:@"JOIN" forState:UIControlStateNormal];
    [self.navBar.forward setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [self.view addSubview:self.navBar];

    UITapGestureRecognizer *keyboardCancelTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideKeyboard)];
    [self.view addGestureRecognizer:keyboardCancelTap];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];


    self.containerView = [[UIView alloc] init];
    [self.view addSubview:self.containerView];
    [self.containerView alignCenterXWithView:self.view predicate:@"0"];
    NSString *centerYOffset = [UIDevice isPad] ? @"0" : @"-30";
    [self.containerView alignCenterYWithView:self.view predicate:NSStringWithFormat(@"%@@750", centerYOffset)];
    self.keyboardConstraint = [self.containerView alignBottomEdgeWithView:self.view predicate:@"<=0@1000"];
    [self.containerView constrainWidth:@"280"];

    self.nameField = [[ARTextFieldWithPlaceholder alloc] init];
    self.nameField.placeholder = @"Full Name";
    self.nameField.autocapitalizationType = UITextAutocapitalizationTypeWords;
    self.nameField.autocorrectionType = UITextAutocorrectionTypeNo;
    self.nameField.returnKeyType = UIReturnKeyNext;

    if (self.name) {
        self.nameField.text = self.name;
    }

    self.emailField = [[ARTextFieldWithPlaceholder alloc] init];
    self.emailField.placeholder = @"Email";
    self.emailField.keyboardType = UIKeyboardTypeEmailAddress;
    self.emailField.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.emailField.autocorrectionType = UITextAutocorrectionTypeNo;
    self.emailField.returnKeyType = UIReturnKeyNext;

    if (self.email) {
        self.emailField.text = self.email;
    }

    if (self.name && self.email) {
        UITextPosition *start = [self.emailField beginningOfDocument];
        UITextPosition *end = [self.emailField positionFromPosition:start inDirection:UITextLayoutDirectionRight offset:self.email.length];
        self.emailField.selectedTextRange = [self.emailField textRangeFromPosition:start toPosition:end];
    }

    [@[ self.nameField, self.emailField ] each:^(ARTextFieldWithPlaceholder *textField) {
        textField.clearButtonMode = UITextFieldViewModeWhileEditing;
        textField.delegate = self;
        [self.containerView addSubview:textField];
        [textField constrainWidth:@"280" height:@"30"];
        [textField alignLeading:@"0" trailing:@"0" toView:self.containerView];
        [textField ar_extendHitTestSizeByWidth:0 andHeight:10];
    }];

    if (self.name) {
        [self.emailField becomeFirstResponder];
    } else {
        [self.nameField becomeFirstResponder];
    }

    [self.nameField alignTopEdgeWithView:self.containerView predicate:@"0"];
    [self.emailField constrainTopSpaceToView:self.nameField predicate:@"20"];
    [self.emailField alignBottomEdgeWithView:self.containerView predicate:@"0"];

    [self.navBar.forward setEnabled:[self canSubmit] animated:NO];
    [self.navBar.forward addTarget:self action:@selector(submit:) forControlEvents:UIControlEventTouchUpInside];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textChanged:) name:UITextFieldTextDidChangeNotification object:nil];
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    self.keyboardConstraint.constant = -keyboardSize.height - ([UIDevice isPad] ? 20 : 10);
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    self.keyboardConstraint.constant = 0;
    [UIView animateIf:YES duration:duration:^{
        [self.view layoutIfNeeded];
    }];
}

- (void)back:(id)sender
{
    [self.delegate popViewControllerAnimated:YES];
}

- (BOOL)canSubmit
{
    return self.nameField.text.length && self.emailField.text.length;
}

- (void)hideKeyboard
{
    [self.view endEditing:YES];
}

- (void)setFormEnabled:(BOOL)enabled
{
    [@[ self.nameField, self.emailField ] each:^(ARTextFieldWithPlaceholder *textField) {
        textField.enabled = enabled;
        textField.alpha = enabled? 1 : 0.5;
    }];
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
    if (![self canSubmit]) {
        return;
    }

    __weak typeof(self) wself = self;
    [self setFormEnabled:NO];
    if (self.provider == ARAuthProviderFacebook) {
        [[ARUserManager sharedManager] createUserViaFacebookWithToken:self.token
            email:self.emailField.text
            name:self.nameField.text
            success:^(User *user) {
            __strong typeof (wself) sself = wself;
            [sself loginWithFacebookCredential];
            }
            failure:^(NSError *error, id JSON) {
            __strong typeof (wself) sself = wself;
            if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
                if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                    ARErrorLog(@"Facebook account already linked");
                    [sself userAlreadyExistsForLoginType:AROnboardingMoreInfoViewControllerLoginTypeFacebook];
                    return;

                // there's already a user with this email
                } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                           || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                    NSString *source = [self existingAccountSource:JSON];
                    [sself accountExists:source];
                    return;
                }
            }

            ARErrorLog(@"Couldn't link Facebook account. Error: %@. The server said: %@", error.localizedDescription, JSON);
            NSString *errorString = [NSString stringWithFormat:@"Server replied saying '%@'.", JSON[@"error"] ?: JSON[@"message"] ?: error.localizedDescription];
           __weak typeof (self) wself = self;
            [UIAlertView showWithTitle:@"Error Creating\na New Artsy Account" message:errorString cancelButtonTitle:@"Close" otherButtonTitles:nil tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
                __strong typeof (wself) sself = wself;
                [sself setFormEnabled:YES];
            }];
            }];
    } else {
        [[ARUserManager sharedManager] createUserViaTwitterWithToken:self.token
            secret:self.secret
            email:self.emailField.text
            name:self.nameField.text
            success:^(User *user) {
            __strong typeof (wself) sself = wself;
            [sself loginWithTwitterCredential];
            }
            failure:^(NSError *error, id JSON) {
          __strong typeof (wself) sself = wself;
          if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
              if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                  ARErrorLog(@"Twitter account already linked");
                  [sself userAlreadyExistsForLoginType:AROnboardingMoreInfoViewControllerLoginTypeTwitter];
                  return;

                  // there's already a user with this email
              } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                         || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                  NSString *source = [self existingAccountSource:JSON];
                  [sself accountExists:source];
                  return;
              }
          }

          ARErrorLog(@"Couldn't link Twitter account. Error: %@. The server said: %@", error.localizedDescription, JSON);
          NSString *errorString = [NSString stringWithFormat:@"Server replied saying '%@'.", JSON[@"error"] ?: JSON[@"message"] ?: error.localizedDescription];
         __weak typeof (self) wself = self;
          [UIAlertView showWithTitle:@"Error Creating\na New Artsy Account" message:errorString cancelButtonTitle:@"Close" otherButtonTitles:nil tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
              __strong typeof (wself) sself = wself;
              [sself setFormEnabled:YES];
          }];
            }];
    }
}

- (void)accountExists:(NSString *)source
{
    NSString *message;
    NSInteger tag;
    if ([source isEqualToString:@"email"]) {
        message = [NSString stringWithFormat:@"An account already exists for the email address \"%@\".", self.emailField.text];
        tag = EMAIL_TAG;
    } else {
        message = [NSString stringWithFormat:@"An account already exists for the email address \"%@\". Please log in via %@.",
                                             self.emailField.text,
                                             [source capitalizedString]];
        tag = SOCIAL_TAG;
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Account Already Exists" message:message delegate:self cancelButtonTitle:@"Log In" otherButtonTitles:nil];
    alert.tag = tag;
    [alert show];
}

- (void)loginWithTwitterCredential
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    __weak typeof(self) wself = self;

    [[ARUserManager sharedManager] loginWithTwitterToken:self.token
        secret:self.secret
        successWithCredentials:nil
        gotUser:^(User *currentUser) {
         __strong typeof (wself) sself = wself;
         [sself loginCompletedForLoginType:AROnboardingMoreInfoViewControllerLoginTypeTwitter];
        }
        authenticationFailure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
          //TODO: handle me

        }
        networkFailure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself setFormEnabled:YES];
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Sign up failed."];
        }];
}

- (void)loginWithFacebookCredential
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    __weak typeof(self) wself = self;

    [[ARUserManager sharedManager] loginWithFacebookToken:self.token successWithCredentials:nil
        gotUser:^(User *currentUser) {
          __strong typeof (wself) sself = wself;
          [sself loginCompletedForLoginType:AROnboardingMoreInfoViewControllerLoginTypeFacebook];
        }
        authenticationFailure:^(NSError *error) {
          __strong typeof (wself) sself = wself;
          [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
          //TODO: handle me

        }
        networkFailure:^(NSError *error) {
          __strong typeof (wself) sself = wself;
          [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
          [sself setFormEnabled:YES];
          [ARNetworkErrorManager presentActiveError:error withMessage:@"Sign up failed."];
        }];
}

- (void)userAlreadyExistsForLoginType:(AROnboardingMoreInfoViewControllerLoginType)loginType
{
    //let's go ahead and log them in
    switch (loginType) {
        case AROnboardingMoreInfoViewControllerLoginTypeFacebook:
            [self loginWithFacebookCredential];
            break;
        case AROnboardingMoreInfoViewControllerLoginTypeTwitter:
            [self loginWithTwitterCredential];
            break;
    }
}

- (void)loginCompletedForLoginType:(AROnboardingMoreInfoViewControllerLoginType)loginType
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];

    if ([ARUserManager didCreateAccountThisSession]) {
        [self.delegate didSignUpAndLogin];
    } else {
        [self.delegate dismissOnboardingWithVoidAnimation:YES];
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UITextFieldTextDidChangeNotification
                                                  object:nil];
}

#pragma mark - UITextField notifications

- (void)textChanged:(NSNotification *)notification
{
    [self.navBar.forward setEnabled:[self canSubmit] animated:YES];
}

#pragma mark - UITextField delegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if (textField == self.nameField && !self.emailField.text.length) {
        [self.emailField becomeFirstResponder];
        return YES;

    } else if ([self canSubmit]) {
        [self submit:nil];
        return YES;
    }

    return NO;
}

#pragma mark - UIAlertViewDelegate

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    NSString *email = nil;
    if (alertView.tag == EMAIL_TAG) {
        email = self.emailField.text;
    }
    [self.delegate logInWithEmail:email];
}
@end
