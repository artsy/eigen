#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+RelatedModels.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingNavigationItemsView.h"
#import "AROnboardingHeaderView.h"
#import "ARAcceptConditionsView.h"
#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "ARLoginButtonsView.h"
#import "ARPriceRangeViewController.h"
#import "Gene.h"
#import "ARLogger.h"

#import "MTLModel+JSON.h"

#import "Artsy-Swift.h"

#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

// maxim's sneaky last comment in Eigen (for a dummy commit). This can be removed when you find it ;).

@interface ARPersonalizeViewController () <UITextFieldDelegate, UITextViewDelegate, ARPersonalizeNetworkDelegate, ARPersonalizeContainer>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic, strong, readwrite) UIView *searchView;
@property (nonatomic, strong, readwrite) AROnboardingHeaderView *headerView;
@property (nonatomic, strong, readwrite) AROnboardingNavigationItemsView *onboardingNavigationItems;
@property (nonatomic, strong, readwrite) ARLoginFieldsView *onboardingTextFields;
@property (nonatomic, strong) ARLoginButtonsView *onboardingButtonsView;
@property (nonatomic, strong) ARAcceptConditionsView *acceptConditionsView;
@property (nonatomic, strong, readwrite) AROnboardingPersonalizeTableViewController *searchResultsTable;
@property (nonatomic, strong, readwrite) ARPriceRangeViewController *budgetTable;
@property (nonatomic, assign, readwrite) BOOL followedAtLeastOneCategory;
@property (nonatomic, strong) NSLayoutConstraint *navigationItemsBottomConstraint;
@property (nonatomic, assign, readwrite) BOOL comingBack;

@property (nonatomic, strong) NSLayoutConstraint *spaceHeaderToTop;
@property (nonatomic, strong) NSLayoutConstraint *spaceFieldsToHeader;



@property (nonatomic, strong, readwrite) NSMutableArray *artistsFollowed;
@property (nonatomic, strong, readwrite) NSMutableArray *categoriesFollowed;

@property (nonatomic, weak) AFHTTPRequestOperation *searchRequestOperation;
@end


@implementation ARPersonalizeViewController

- (instancetype)initForStage:(AROnboardingStage)stage
{
    self = [super init];
    if (self) {
        _state = stage;
        _artistsFollowed = [NSMutableArray new];
        _categoriesFollowed = [NSMutableArray new];
    }
    return self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textChanged:)
                                                 name:UITextFieldTextDidChangeNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textBeganEditing:)
                                                 name:UITextFieldTextDidBeginEditingNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textEndedEditing:)
                                                 name:UITextFieldTextDidEndEditingNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    
    if (self.comingBack && self.state == AROnboardingStagePersonalizeEmail) {
        [self.onboardingTextFields.emailField becomeFirstResponder];
    }

    // We need an auto-layout render pass for the iPhone X,
    // as the status bar safe values are only available here, instead of during viewDidLoad etc
    [self finaliseValuesForiPadWithInterfaceOrientation:UIApplication.sharedApplication.statusBarOrientation];
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidBeginEditingNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidEndEditingNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Yes I am just as confused as you are
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self showViews];
    });
}

- (void)showViews
{
    self.view.backgroundColor = [UIColor whiteColor];

    self.onboardingNavigationItems = [[AROnboardingNavigationItemsView alloc] init];
    [self.view addSubview:self.onboardingNavigationItems];

    [self.onboardingNavigationItems constrainWidthToView:self.view predicate:@"0"];
    [self.onboardingNavigationItems constrainHeight:@"50"];

    self.navigationItemsBottomConstraint = [self.onboardingNavigationItems alignBottomEdgeWithView:self.view predicate:@"0"];

    CGRect keyboardFrame = [(AROnboardingViewController *)self.delegate keyboardFrame];
    if (CGRectGetHeight(keyboardFrame) > 0) {
        self.navigationItemsBottomConstraint.constant = -keyboardFrame.size.height;
    }
    [self.onboardingNavigationItems alignLeadingEdgeWithView:self.view predicate:@"0"];

    [self.onboardingNavigationItems.next addTarget:self action:@selector(nextTapped:) forControlEvents:UIControlEventTouchUpInside];
    [self.onboardingNavigationItems.back addTarget:self action:@selector(backTapped:) forControlEvents:UIControlEventTouchUpInside];

    self.headerView = [[AROnboardingHeaderView alloc] init];
    [self.view addSubview:self.headerView];
    
    // for iPhone 5
    if ([[UIScreen mainScreen] bounds].size.height == 568.0) {
        self.spaceHeaderToTop = [self.headerView alignTopEdgeWithView:self.view predicate:self.useLargeLayout ? @"80" : @"20"];
        [self.headerView constrainHeight:@"120"];
    } else {
        self.spaceHeaderToTop = [self.headerView alignTopEdgeWithView:self.view predicate:self.useLargeLayout ? @"80" : @"60"];
        [self.headerView constrainHeight:@"160"];
    }

    [self.headerView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.headerView alignCenterXWithView:self.view predicate:@"0"];

    switch (self.state) {
        case AROnboardingStagePersonalizeEmail:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your email address" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"If you don't have an Artsy account yet we'll get one set up"
                         withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForEmailWithLargeLayout:self.useLargeLayout];
            self.onboardingTextFields.emailField.delegate = self;
            [self.onboardingTextFields.emailField becomeFirstResponder];
            [self addFacebookButton];
            break;
        case AROnboardingStateAcceptConditions:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Agree to Terms" withLargeLayout:self.useLargeLayout];
            [self addAcceptConditionsView];
            break;
        case AROnboardingStagePersonalizePassword:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Create a password" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"Must be 6 characters or longer" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForPasswordWithLargeLayout:self.useLargeLayout];
            [self.onboardingTextFields.passwordField becomeFirstResponder];
            self.onboardingTextFields.passwordField.delegate = self;
            [self addGoBackButton];
            break;
        case AROnboardingStagePersonalizeLogin:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your password" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForLoginWithLargeLayout:self.useLargeLayout];
            [self.onboardingTextFields.passwordField becomeFirstResponder];
            self.onboardingTextFields.passwordField.delegate = self;
            [self addForgotPasswordButton];
            break;
        case AROnboardingStagePersonalizeName:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your full name" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"Galleries and auction houses you contact will identify you by your full name" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForNameWithLargeLayout:self.useLargeLayout];
            [self.onboardingTextFields.nameField becomeFirstResponder];
            self.onboardingTextFields.nameField.delegate = self;
            break;
        case AROnboardingStagePersonalizeArtists:
            [self addSearchTable];
            // progress percentages are made up for now, will be calculated by steps and remaining steps later
            [self.headerView setupHeaderViewWithTitle:@"Follow artists that most interest you" withLargeLayout:self.useLargeLayout];
            [self.headerView showSearchBar];
            self.searchResultsTable.headerPlaceholderText = @"TOP ARTISTS ON ARTSY";
            self.headerView.searchField.searchField.delegate = self;
            [self.headerView.searchField.searchField setPlaceholder:@"Search artist"];
            [self populateTrendingArtistsAnimated:NO];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self addSearchTable];
            [self.headerView setupHeaderViewWithTitle:@"Follow categories of art that most interest you" withLargeLayout:self.useLargeLayout];
            [self.headerView showSearchBar];
            self.headerView.searchField.searchField.delegate = self;
            self.searchResultsTable.headerPlaceholderText = @"POPULAR CATEGORIES OF ART ON ARTSY";
            [self.headerView.searchField.searchField setPlaceholder:@"Search medium, movement, or style"];
            [self.onboardingNavigationItems disableNextStep]; // for the styling
            self.onboardingNavigationItems.next.enabled = YES; 
            [self populateTrendingCategoriesAnimated:NO];
            break;
        case AROnboardingStagePersonalizeBudget:
            [self addBudgetTable];
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Do you have a budget in mind?" withLargeLayout:self.useLargeLayout];
            break;
        default:
            break;
    }

    [self finaliseValuesForiPadWithInterfaceOrientation:UIApplication.sharedApplication.statusBarOrientation];
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"

// Yes, this is deprecated, but it's the most straightforward way to change 2 values for iPad landscape
- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self finaliseValuesForiPadWithInterfaceOrientation:toInterfaceOrientation];
}

#pragma clang diagnostic pop

- (CGFloat)statusBarHeight
{
    return self.view.safeAreaInsets.top;
}

- (void)finaliseValuesForiPadWithInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    CGFloat statusBarHeight = [self statusBarHeight];
    if (self.spaceHeaderToTop && self.spaceFieldsToHeader) {
        if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
            self.spaceHeaderToTop.constant = statusBarHeight;
            self.spaceFieldsToHeader.constant = -35;
        } else {
            self.spaceHeaderToTop.constant =  statusBarHeight + (self.useLargeLayout ? 60 : 10);
            self.spaceFieldsToHeader.constant = self.useLargeLayout ? 145 : 5;
        }
    }

    // It will default to 0 in the init code, but we have to wait until the view is in the heirarchy
    // before `self.view.safeAreaInsets.bottom` will actually return a useful value
    if (self.view.safeAreaInsets.bottom && self.navigationItemsBottomConstraint.constant == 0) {
        self.navigationItemsBottomConstraint.constant = -1 * self.view.safeAreaInsets.bottom;
    }
}

- (void)addTextFields
{
    self.onboardingTextFields = [[ARLoginFieldsView alloc] init];
    [self.view addSubview:self.onboardingTextFields];
    
    [self.onboardingTextFields constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.onboardingTextFields alignCenterXWithView:self.view predicate:@"0"];
    self.spaceFieldsToHeader = [self.onboardingTextFields constrainTopSpaceToView:self.headerView predicate:self.useLargeLayout ? @"150" : @"5"];
    
    // for iPhone 5
    if ([[UIScreen mainScreen] bounds].size.height == 568.0) {
        [self.onboardingTextFields constrainHeight:@"80"];
    } else {
        [self.onboardingTextFields constrainHeight:@"100"];
    }
}

- (void)addAcceptConditionsView
{
    self.acceptConditionsView = [[ARAcceptConditionsView alloc] init];
    [self.view addSubview:self.acceptConditionsView];
    
    [self.acceptConditionsView constrainWidthToView:self.view predicate:@"0"];
    [self.acceptConditionsView alignCenterXWithView:self.view predicate:@"0"];
    [self.acceptConditionsView constrainTopSpaceToView:self.headerView.titleLabel predicate:@"0"];
    [self.acceptConditionsView constrainHeight:@"300"];
    
    self.acceptConditionsView.helpTextLabel.delegate = self;
    [self.acceptConditionsView.checkboxButton addTarget:self
                                                 action:@selector(checkboxButtonPressed:)
                                       forControlEvents:UIControlEventTouchUpInside];
}

- (void)addButtons
{
    self.onboardingButtonsView = [[ARLoginButtonsView alloc] init];
    [self.view addSubview:self.onboardingButtonsView];
    
    [self.onboardingButtonsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.onboardingButtonsView alignCenterXWithView:self.view predicate:@"0"];
    [self.onboardingButtonsView constrainHeight:@"30"];
    [self.onboardingButtonsView constrainTopSpaceToView:self.onboardingTextFields predicate:self.useLargeLayout ? @"5" : @"20"];
    
    if (self.useLargeLayout) {
        [self.onboardingButtonsView.actionButton setContentHorizontalAlignment:UIControlContentHorizontalAlignmentCenter];
    } else {
        [self.onboardingButtonsView.actionButton setContentHorizontalAlignment:UIControlContentHorizontalAlignmentLeft];
    }

}
- (void)addFacebookButton
{
    [self addButtons];
    [self.onboardingButtonsView setupForFacebookWithLargeLayout:self.useLargeLayout];
    
    [self.onboardingButtonsView.actionButton addTarget:self
                                                        action:@selector(facebookTapped:)
                                              forControlEvents:UIControlEventTouchUpInside];
}

- (void)addForgotPasswordButton
{
    [self addButtons];
    [self.onboardingButtonsView setupForLoginWithLargeLayout:self.useLargeLayout];
    
    [self.onboardingButtonsView.actionButton addTarget:self
                                                action:@selector(forgotPassword:)
                                      forControlEvents:UIControlEventTouchUpInside];
}

- (void)addGoBackButton
{
    [self addButtons];
    [self.onboardingButtonsView setupForSignUpWithLargeLayout:self.useLargeLayout];
    
    [self.onboardingButtonsView.actionButton addTarget:self
                                                action:@selector(backTapped:)
                                      forControlEvents:UIControlEventTouchUpInside];
}

- (void)addSearchTable
{
    self.searchResultsTable = [[AROnboardingPersonalizeTableViewController alloc] init];
    self.searchResultsTable.networkDelegate = self;
    [self.view addSubview:self.searchResultsTable.view];

    [self.searchResultsTable.view constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.searchResultsTable.view alignCenterXWithView:self.view predicate:@"0"];
    [self.searchResultsTable.view constrainTopSpaceToView:self.headerView predicate:@"5"];
    [self.searchResultsTable.view constrainBottomSpaceToView:self.onboardingNavigationItems predicate:@"0"];
}

- (void)addBudgetTable
{
    self.budgetTable = [[ARPriceRangeViewController alloc] init];
    self.budgetTable.delegate = self;
    [self.view addSubview:self.budgetTable.view];

    [self.budgetTable.view constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.budgetTable.view alignCenterXWithView:self.view predicate:@"0"];

    if (self.useLargeLayout) {
        [self.budgetTable.view alignCenterYWithView:self.view predicate:@"0"];
        [self.budgetTable.view constrainHeight:@"490"];
    } else {
        [self.budgetTable.view constrainTopSpaceToView:self.headerView predicate:@"5"];
        [self.budgetTable.view constrainBottomSpaceToView:self.onboardingNavigationItems predicate:@"0"];
    }
}

#pragma mark -
#pragma mark Keyboard Accessory Animation

- (void)updateKeyboardFrame:(CGRect)keyboardFrame
{
    if (self.onboardingNavigationItems && !(self.state == AROnboardingStagePersonalizeArtists || self.state == AROnboardingStagePersonalizeCategories)) {
        self.navigationItemsBottomConstraint.constant = -keyboardFrame.size.height;
    }
}
- (void)keyboardWillShow:(NSNotification *)notification
{
    if (self.state == AROnboardingStagePersonalizeEmail) {
        CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue].size;
        self.navigationItemsBottomConstraint.constant = -keyboardSize.height;
    }
}

#pragma mark -
#pragma mark Text View Delegate

- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction
{
    NSString *path = [[URL.absoluteString componentsSeparatedByString:@"/"] lastObject];
    if ([path isEqualToString:@"terms"]) {
        [self.delegate termsAndConditionsLinkTapped];
    } else if ([path isEqualToString:@"privacy"]) {
        [self.delegate privacyPolicyLinkTapped];
    }
    
    return NO;
}

#pragma mark -
#pragma mark Text Field Delegate

- (void)textChanged:(NSNotification *)notification
{
    
    switch (self.state) {
        case AROnboardingStagePersonalizeEmail:
            [self emailTextChanged];
            break;
        case AROnboardingStagePersonalizePassword:
            [self passwordTextChanged];
            break;
        case AROnboardingStagePersonalizeLogin:
            [self passwordTextChanged];
            break;
        case AROnboardingStagePersonalizeName:
            [self nameTextChanged];
            break;
        case AROnboardingStagePersonalizeArtists:
            [self searchTextChanged];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self searchTextChanged];
            break;
        default:
            break;
    }
}

- (void)textBeganEditing:(NSNotification *)notification
{
    
    switch (self.state) {
        case AROnboardingStagePersonalizeArtists:
            [self searchStarted];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self searchStarted];
            break;
        default:
            break;
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    switch (self.state) {
        case AROnboardingStagePersonalizePassword:
            if (![self validPassword:textField.text]) {
                [self.onboardingTextFields enableErrorState];
                [self.headerView enableErrorHelpText];
                [self.onboardingNavigationItems showError:@"Try a different password"];
                return NO;
            } else {
                [self nextTapped:nil];
            }
            break;
        case AROnboardingStagePersonalizeEmail:
            if (![self validEmail:textField.text]) {
                [self.onboardingTextFields enableErrorState];
                [self.onboardingNavigationItems showError:@"Try a valid email"];
                return NO;
            } else {
                [self nextTapped:nil];
            }
            break;
        case AROnboardingStagePersonalizeLogin:
        case AROnboardingStagePersonalizeName:
            [self nextTapped:nil];
            break;
        case AROnboardingStagePersonalizeArtists:
            [self.headerView.searchField.searchField resignFirstResponder];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self.headerView.searchField.searchField resignFirstResponder];
            break;
        default:
            break;
    }
    
    return YES;
}

- (void)textEndedEditing:(NSNotification *)notification
{
    switch (self.state) {
        case AROnboardingStagePersonalizeArtists:
            [self searchEnded];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self searchEnded];
            break;
        default:
            break;
    }
}


#pragma mark -
#pragma mark Account Creation

- (void)emailTextChanged
{
    // iOS Autocomplete includes a space after inserting the email, we need to remove it.
    NSString *email = [self.onboardingTextFields.emailField.text stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    self.onboardingTextFields.emailField.text = email;
    
    if ([self validEmail:email]) {
        [self.onboardingTextFields disableErrorState];
        [self.onboardingNavigationItems hideError];
        [self.onboardingNavigationItems enableNextStep];
    } else {
        [self.onboardingNavigationItems disableNextStep];
    }
}

- (void)passwordTextChanged
{
    NSString *password = self.onboardingTextFields.passwordField.text;
    
    if ([self validPassword:password]) {
        [self.onboardingTextFields disableErrorState];
        [self.headerView disableErrorHelpText];
        [self.onboardingNavigationItems hideError];
        [self.onboardingNavigationItems enableNextStep];
    } else {
        [self.onboardingNavigationItems disableNextStep];
    }
}

- (void)nameTextChanged
{
    if (self.onboardingTextFields.nameField.text.length > 0) {
        [self.onboardingNavigationItems enableNextStep];
    }
}

- (void)checkboxButtonPressed:(id)sender
{
    if (self.acceptConditionsView.checkboxButton.selected) {
        [self.onboardingNavigationItems disableNextStep];
    } else {
        [self.onboardingNavigationItems enableNextStep];
        [self.onboardingTextFields disableErrorState];
        [self.onboardingNavigationItems hideError];
    }
    self.acceptConditionsView.checkboxButton.selected = !self.acceptConditionsView.checkboxButton.selected;
}

- (BOOL)validEmail:(NSString *)email
{
    // Got this from http://regexlib.com and modified it to accept plusses in the name too (e.g. name+suffix@domain.com)
    NSString *emailValidationPattern = @"^([a-zA-Z0-9_\\-\\.\\+]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$";
    
    NSRegularExpression *regex = [[NSRegularExpression alloc] initWithPattern:emailValidationPattern
                                                                      options:NSRegularExpressionCaseInsensitive
                                                                        error:nil];
    NSUInteger emailMatch = [regex numberOfMatchesInString:email
                                                   options:0
                                                     range:NSMakeRange(0, [email length])];
    if (emailMatch > 0) {
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)validPassword:(NSString *)password
{
    // If the user is logging in, allow any non-empty password.
    if (self.state == AROnboardingStagePersonalizeLogin) {
        if (password.length > 0) {
            return YES;
        }
    } else {
        // Otherwise, new users signing up require passwords at least 8 chars long.
        if (password.length >= 8) {
            return YES;
        }
    }

    return NO;
}

- (void)showErrorWithMessage:(NSString *)errorMessage
{
    // Since the error might not be due to the UI that's currently visible, let's not highlight
    // text fields in red (since they error is likely unrelated).
    // [self.onboardingTextFields enableErrorState];
    [self.onboardingNavigationItems showError:errorMessage];
}



#pragma mark -
#pragma mark Forgot Password

- (void)forgotPassword:(id)sender
{
    UIAlertController *forgotPasswordAlert = [UIAlertController alertControllerWithTitle:@"Forgot Password"
                                                                                 message:@"Please enter your email address and we’ll send you a reset link."
                                                                          preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *sendEmailAction = [UIAlertAction actionWithTitle:@"Send Link"
                                                              style:UIAlertActionStyleDefault
                                                            handler:^(UIAlertAction * _Nonnull action) {
                                                                NSString *email = [[forgotPasswordAlert textFields].firstObject text];
                                                                if (![self validEmail:email]) {
                                                                    [self passwordResetError:@"Please check your email address"];
                                                                } else {
                                                                    [self.delegate sendPasswordResetEmail:email sender:self];
                                                                }
                                                            }];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"Cancel"
                                                           style:UIAlertActionStyleCancel
                                                         handler:^(UIAlertAction * _Nonnull action) {
    }];
    
    [forgotPasswordAlert addAction:sendEmailAction];
    [forgotPasswordAlert addAction:cancelAction];
    
    [forgotPasswordAlert addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
        textField.text = [self.delegate userEmail];
    }];
    
    [self presentViewController:forgotPasswordAlert animated:YES completion:nil];
}

- (void)passwordResetSent
{
    UIAlertController *confirmationAlert = [UIAlertController alertControllerWithTitle:@"Please Check Your Email"
                                                                               message:@"We have sent you an email with a link to reset your password"
                                                                        preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"OK"
                                                           style:UIAlertActionStyleCancel
                                                         handler:^(UIAlertAction * _Nonnull action) {
                                                         }];
    [confirmationAlert addAction:cancelAction];
    [self presentViewController:confirmationAlert animated:YES completion:nil];
}

- (void)passwordResetError:(NSString *)message
{
    UIAlertController *errorAlert = [UIAlertController alertControllerWithTitle:@"Couldn’t Reset Password"
                                                                               message:@"There was an issue trying to reset your password. Please try again."
                                                                        preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"OK"
                                                           style:UIAlertActionStyleCancel
                                                         handler:^(UIAlertAction * _Nonnull action) {
                                                         }];
    [errorAlert addAction:cancelAction];
    [self presentViewController:errorAlert animated:YES completion:nil];
}


#pragma mark -
#pragma mark Search Field

- (void)searchTextChanged
{
    BOOL searchBarIsEmpty = [self.headerView.searchField.searchField.text isEqualToString:@""];
    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeSearchResults;

    [self.searchRequestOperation cancel];

    if (searchBarIsEmpty) {
        switch (self.state) {
            case AROnboardingStagePersonalizeArtists: {
                [self populateTrendingArtistsAnimated:NO];
            } break;
            case AROnboardingStagePersonalizeCategories: {
                [self populateTrendingCategoriesAnimated:NO];
            } break;
            default:
                break;
        }
        return;
    }

    switch (self.state) {
        case AROnboardingStagePersonalizeArtists: {
            self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.headerView.searchField.searchField.text excluding:self.artistsFollowed success:^(NSArray *results) {
                [self.searchResultsTable updateTableContentsFor:results replaceContents:ARSearchResultsReplaceAll animated:NO];
            } failure:^(NSError *error) {
                [self reportError:error];
            }];
        } break;
        case AROnboardingStagePersonalizeCategories: {
            self.searchRequestOperation = [ArtsyAPI geneSearchWithQuery:self.headerView.searchField.searchField.text excluding:self.categoriesFollowed success:^(NSArray *results) {
                [self.searchResultsTable updateTableContentsFor:results replaceContents:ARSearchResultsReplaceAll animated:NO];
            } failure:^(NSError *error) {
                [self reportError:error];
            }];
        } break;
        default:
            break;
    }
}

- (void)searchStarted
{
    [self.headerView searchStarted];
}

- (void)searchEnded
{
    [self.headerView searchEnded];
}

#pragma mark -
#pragma mark Network

- (void)populateTrendingArtistsAnimated:(BOOL)animated
{
    [self.searchRequestOperation cancel];

    [self.searchResultsTable showLoadingSpinner];

    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;
    
    void (^updateArtistsTable)(NSArray*) = ^(NSArray *artists) {
        [self.searchResultsTable removeLoadingSpinner];
        [self.searchResultsTable updateTableContentsFor:artists
                                        replaceContents:ARSearchResultsReplaceAll
                                               animated:animated];
    };

    self.searchRequestOperation = [ArtsyAPI getPopularArtistsWithSuccess:^(NSArray *artists) {
        if (artists.count == 0) {
            self.searchRequestOperation = [ArtsyAPI getPopularArtistsFallbackWithSuccess:updateArtistsTable failure:^(NSError *error) {
                [self reportError:error];
            }];
        } else {
            updateArtistsTable(artists);
        }

    } failure:^(NSError *error) {
        [self reportError:error];
    }];
}

- (void)populateTrendingCategoriesAnimated:(BOOL)animated
{
    [self.searchRequestOperation cancel];
    [self.searchResultsTable showLoadingSpinner];

    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;


    self.searchRequestOperation = [ArtsyAPI getPopularGenesWithSuccess:^(NSArray *genes) {
        [self.searchResultsTable updateTableContentsFor:genes
                                        replaceContents:ARSearchResultsReplaceAll
                                               animated:animated];
    } failure:^(NSError *error) {
        [self reportError:error];
    }];
}

- (void)artistFollowed:(Artist *)artist
{
    if (self.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
        self.headerView.searchField.searchField.text = @"";
        [self.headerView.searchField endEditing:YES];
        [self.headerView.searchField.searchField resignFirstResponder];
        self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeRelatedResults;
        self.searchRequestOperation = [ArtsyAPI getRelatedArtistsForArtist:artist excluding:self.artistsFollowed success:^(NSArray *artists) {
            if (artists.count > 0) {
                [self.searchResultsTable updateTableContentsFor:artists
                                                replaceContents:ARSearchResultsReplaceAll
                                                       animated:YES];
            } else {
                // show default list
                [self populateTrendingArtistsAnimated:YES];
            }
        } failure:^(NSError *error) {
            [self reportError:error];
        }];

    } else {
        // exclude currently displayed artists as well
        NSArray *toExclude = [self.searchResultsTable.displayedResults arrayByAddingObjectsFromArray:self.artistsFollowed];
        self.searchRequestOperation = [ArtsyAPI getRelatedArtistForArtist:artist excluding:toExclude success:^(NSArray *relatedArtist) {
            [self.searchResultsTable updateTableContentsFor:relatedArtist
                                            replaceContents:ARSearchResultsReplaceSingle
                                                   animated:NO];
        } failure:^(NSError *error) {
            [self reportError:error];
        }];
    }
}

- (void)categoryFollowed:(Gene *)category
{
    self.followedAtLeastOneCategory = YES;
    [self allowUserToContinue];

    if (self.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
        self.headerView.searchField.searchField.text = @"";
        [self.headerView.searchField endEditing:YES];
        [self.headerView.searchField.searchField resignFirstResponder];
        self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeRelatedResults;
        self.searchRequestOperation = [ArtsyAPI getRelatedGenesForGene:category excluding:self.categoriesFollowed success:^(NSArray *genes) {
            if (genes.count > 0) {
                [self.searchResultsTable updateTableContentsFor:genes
                                                replaceContents:ARSearchResultsReplaceAll
                                                       animated:YES];
            } else {
                // show default list
                [self populateTrendingCategoriesAnimated:YES];
            }

        } failure:^(NSError *error) {
            [self reportError:error];
        }];

    } else {
        // exclude currently displayed artists as well
        NSArray *toExclude = [self.searchResultsTable.displayedResults arrayByAddingObjectsFromArray:self.categoriesFollowed];
        self.searchRequestOperation = [ArtsyAPI getRelatedGeneForGene:category excluding:toExclude success:^(NSArray *relatedGene) {
            [self.searchResultsTable updateTableContentsFor:relatedGene
                                            replaceContents:ARSearchResultsReplaceSingle
                                                   animated:NO];
        } failure:^(NSError *error) {
            [self reportError:error];
        }];
    }
}

- (void)budgetSelected
{
    [self allowUserToContinue];
}

- (void)allowUserToContinue
{
    [self.onboardingNavigationItems enableNextStep];
    [self.onboardingNavigationItems hideWarning];
}

- (void)reportError:(NSError *)error
{
    [self.searchResultsTable removeLoadingSpinner];

    if (error.code != NSURLErrorCancelled) {
        [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
        ARErrorLog(@"Personalize search network error %@", error.localizedDescription);
    }
}

#pragma mark -
#pragma mark Onboarding Delegate

- (void)nextTapped:(id)sender
{
    switch (self.state) {
        case AROnboardingStagePersonalizeEmail:
            [self.delegate personalizeEmailDone:self.onboardingTextFields.emailField.text];
            break;
        case AROnboardingStagePersonalizePassword:
            [self.delegate personalizePasswordDone:self.onboardingTextFields.passwordField.text];
            break;
        case AROnboardingStagePersonalizeLogin:
            [self.onboardingNavigationItems showSpinner];
            [self.delegate personalizeLoginWithPasswordDone:self.onboardingTextFields.passwordField.text];
            break;
        case AROnboardingStagePersonalizeName:
            [self.delegate personalizeNameDone:self.onboardingTextFields.nameField.text];
            break;
        case AROnboardingStateAcceptConditions:
            [self.onboardingNavigationItems showSpinner];
            [self.delegate personalizeAcceptConditionsDone];
            break;
        case AROnboardingStagePersonalizeArtists:
            [self.delegate personalizeArtistsDone];
            break;
        case AROnboardingStagePersonalizeCategories:
            if (self.followedAtLeastOneCategory) {
                [self.delegate personalizeCategoriesDone];
            } else {
                [self.onboardingNavigationItems showWarning:@"Follow one or more categories"];
            }
            break;
        case AROnboardingStagePersonalizeBudget:
            if (self.budgetTable.rangeValue) {
                [self.delegate setPriceRangeDone:[self.budgetTable.rangeValue integerValue]];
                [self.delegate personalizeBudgetDone];
            } else {
                [self.onboardingNavigationItems showWarning:@"Select a budget"];
            }
            break;
        default:
            break;
    }
}

- (void)backTapped:(id)sender
{
    self.comingBack = YES;
    [self.delegate backTapped];
}

- (void)facebookTapped:(id)sender
{
    self.comingBack = YES;
    [self.delegate personaliseFacebookTapped];
}

- (void)followableItemClicked:(id<ARFollowable>)item
{
    [self.delegate followableItemFollowed:item];

    [self.searchRequestOperation cancel];


    switch (self.state) {
        case AROnboardingStagePersonalizeArtists: {
            [self.artistsFollowed addObject:item];
            [self artistFollowed:(Artist *)item];
            break;
        }

        case AROnboardingStagePersonalizeCategories: {
            [self.categoriesFollowed addObject:item];
            [self categoryFollowed:(Gene *)item];
            break;
        }
        default:
            break;
    }
}

@end
