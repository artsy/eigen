#import "AROnboardingMoreInfoViewController.h"
#import "ARAuthProviders.h"
#import "AROnboardingNavBarView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARUserManager.h"
#import "AROnboardingViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import <UIAlertView+Blocks/UIAlertView+Blocks.h>
#import "UIView+HitTestExpansion.h"

//sigh
#define EMAIL_TAG 111
#define SOCIAL_TAG 222

@interface AROnboardingMoreInfoViewController ()<UITextFieldDelegate, UIAlertViewDelegate>
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
    [self.containerView alignCenterXWithView:self.view predicate:nil];
    NSString *centerYOffset = [UIDevice isPad] ? @"0" : @"-30";
    [self.containerView alignCenterYWithView:self.view predicate: NSStringWithFormat(@"%@@750", centerYOffset)];
    self.keyboardConstraint = [[self.containerView alignBottomEdgeWithView:self.view predicate:@"<=0@1000"] lastObject];
    [self.containerView constrainWidth:@"280"];

    self.nameField = [[ARTextFieldWithPlaceholder alloc] init];
    self.nameField.placeholder = @"Full Name";
    self.nameField.autocapitalizationType = UITextAutocapitalizationTypeWords;
    self.nameField.autocorrectionType = UITextAutocorrectionTypeNo;
    self.nameField.returnKeyType = UIReturnKeyNext;
    self.nameField.keyboardAppearance = UIKeyboardAppearanceDark;

    if (self.name) {
        self.nameField.text = self.name;
    }

    self.emailField = [[ARTextFieldWithPlaceholder alloc] init];
    self.emailField.placeholder = @"Email";
    self.emailField.keyboardType = UIKeyboardTypeEmailAddress;
    self.emailField.autocorrectionType = UITextAutocorrectionTypeNo;
    self.emailField.returnKeyType = UIReturnKeyNext;
    self.emailField.keyboardAppearance = UIKeyboardAppearanceDark;

    if (self.email) {
        self.emailField.text = self.email;
    }

    if (self.name && self.email) {
        UITextPosition *start = [self.emailField beginningOfDocument];
        UITextPosition *end = [self.emailField positionFromPosition:start inDirection:UITextLayoutDirectionRight offset:self.email.length];
        self.emailField.selectedTextRange = [self.emailField textRangeFromPosition:start toPosition:end];
    }

    [@[self.nameField, self.emailField] each:^(ARTextFieldWithPlaceholder *textField) {
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
    [UIView animateIf:YES duration:duration :^{
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

    self.keyboardConstraint.constant = 0;
    [UIView animateIf:YES duration:duration :^{
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
    [@[self.nameField, self.emailField] each:^(ARTextFieldWithPlaceholder *textField) {
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

    @weakify(self);
    [self setFormEnabled:NO];
    if (self.provider == ARAuthProviderFacebook) {
        [[ARUserManager sharedManager] createUserViaFacebookWithToken:self.token
                                                                email:self.emailField.text
                                                                 name:self.nameField.text
                                                              success:^(User *user) {
            @strongify(self);
            [self loginWithFacebookCredential:NO];
        } failure:^(NSError *error, id JSON) {
            @strongify(self);
            if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
                if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                    ARActionLog(@"Facebook account already linked");
                    [self userAlreadyExistsForLoginType:AROnboardingMoreInfoViewControllerLoginTypeFacebook];
                    return;

                // there's already a user with this email
                } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                           || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                    NSString *source = [self existingAccountSource:JSON];
                    [self accountExists:source];
                    return;
                }
            }

            ARErrorLog(@"Couldn't link Facebook account. Error: %@. The server said: %@", error.localizedDescription, JSON);
            NSString *errorString = [NSString stringWithFormat:@"Server replied saying '%@'.", JSON[@"error"] ?: JSON[@"message"] ?: error.localizedDescription];
            @weakify(self);
            [UIAlertView showWithTitle:@"Error Creating\na New Artsy Account" message:errorString cancelButtonTitle:@"Close" otherButtonTitles:nil tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
                @strongify(self);
                [self setFormEnabled:YES];
            }];
        }];
    } else {
        [[ARUserManager sharedManager] createUserViaTwitterWithToken:self.token
                                                              secret:self.secret
                                                                email:self.emailField.text
                                                                 name:self.nameField.text
                                                              success:^(User *user) {
            @strongify(self);
            [self loginWithTwitterCredential:NO];
      } failure:^(NSError *error, id JSON) {
          @strongify(self);
          if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
              if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                  ARActionLog(@"Twitter account already linked");
                  [self userAlreadyExistsForLoginType:AROnboardingMoreInfoViewControllerLoginTypeTwitter];
                  return;

                  // there's already a user with this email
              } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                         || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                  NSString *source = [self existingAccountSource:JSON];
                  [self accountExists:source];
                  return;
              }
          }

          ARErrorLog(@"Couldn't link Twitter account. Error: %@. The server said: %@", error.localizedDescription, JSON);
          NSString *errorString = [NSString stringWithFormat:@"Server replied saying '%@'.", JSON[@"error"] ?: JSON[@"message"] ?: error.localizedDescription];
          @weakify(self);
          [UIAlertView showWithTitle:@"Error Creating\na New Artsy Account" message:errorString cancelButtonTitle:@"Close" otherButtonTitles:nil tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
              @strongify(self);
              [self setFormEnabled:YES];
          }];
      }];
    }
}

- (void)accountExists:(NSString *)source
{
    NSString *message;
    NSInteger tag;
    if ([source isEqualToString:@"email"]) {
        message= [NSString stringWithFormat:@"An account already exists for the email address \"%@\".", self.emailField.text];
        tag = EMAIL_TAG;
    } else {
        message= [NSString stringWithFormat:@"An account already exists for the email address \"%@\". Please log in via %@.",
                  self.emailField.text,
                  [source capitalizedString]];
        tag = SOCIAL_TAG;
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Account Already Exists" message:message delegate:self cancelButtonTitle:@"Log In" otherButtonTitles:nil];
    alert.tag = tag;
    [alert show];
}

/// skipAhead to pass over the rest of onboarding
- (void)loginWithTwitterCredential:(BOOL)skipAhead
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    @weakify(self);

    [[ARUserManager sharedManager] loginWithTwitterToken:self.token
                                                  secret:self.secret
                                  successWithCredentials:nil
     gotUser:^(User *currentUser) {
         @strongify(self);
         [self loginCompletedForLoginType:AROnboardingMoreInfoViewControllerLoginTypeTwitter skipAhead:skipAhead];
    } authenticationFailure:^(NSError *error) {
        @strongify(self);
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        //TODO: handle me

    } networkFailure:^(NSError *error) {
        @strongify(self);
        [self setFormEnabled:YES];
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [ARNetworkErrorManager presentActiveErrorModalWithError:error];
    }];
}

/// skipAhead to pass over the rest of onboarding
- (void)loginWithFacebookCredential:(BOOL)skipAhead
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    @weakify(self);

    [[ARUserManager sharedManager] loginWithFacebookToken:self.token successWithCredentials:nil
      gotUser:^(User *currentUser) {
          @strongify(self);
          [self loginCompletedForLoginType:AROnboardingMoreInfoViewControllerLoginTypeFacebook skipAhead:skipAhead];
      } authenticationFailure:^(NSError *error) {
          @strongify(self);
          [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
          //TODO: handle me

      } networkFailure:^(NSError *error) {
          @strongify(self);
          [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
          [self setFormEnabled:YES];
          [ARNetworkErrorManager presentActiveErrorModalWithError:error];
    }];
}

- (void)userAlreadyExistsForLoginType:(AROnboardingMoreInfoViewControllerLoginType)loginType
{
    //let's go ahead and log them in
    switch (loginType) {
        case AROnboardingMoreInfoViewControllerLoginTypeFacebook:
            [self loginWithFacebookCredential:YES];
            break;
        case AROnboardingMoreInfoViewControllerLoginTypeTwitter:
            [self loginWithTwitterCredential:YES];
            break;
    }
}

- (void)loginCompletedForLoginType:(AROnboardingMoreInfoViewControllerLoginType)loginType skipAhead:(BOOL)skipAhead
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    
    if (skipAhead) {
        [self.delegate dismissOnboardingWithVoidAnimation:YES];
    } else {
        [self.delegate signupDone];
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
    if (textField == self.nameField  && !self.emailField.text.length) {
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
