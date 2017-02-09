#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+RelatedModels.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingNavigationItemsView.h"
#import "AROnboardingHeaderView.h"
#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "ARLoginButtonsView.h"
#import "ARPriceRangeViewController.h"
#import "Gene.h"
#import "ARLogger.h"

#import "MTLModel+JSON.h"

#import "Artsy-Swift.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <UIAlertView_Blocks/UIAlertView+Blocks.h>


@interface ARPersonalizeViewController () <UITextFieldDelegate, ARPersonalizeNetworkDelegate, ARPersonalizeContainer>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic, strong, readwrite) UIView *searchView;
@property (nonatomic, strong, readwrite) AROnboardingHeaderView *headerView;
@property (nonatomic, strong, readwrite) AROnboardingNavigationItemsView *onboardingNavigationItems;
@property (nonatomic, strong, readwrite) ARLoginFieldsView *onboardingTextFields;
@property (nonatomic, strong) ARLoginButtonsView *onboardingButtonsView;
@property (nonatomic, strong, readwrite) AROnboardingPersonalizeTableViewController *searchResultsTable;
@property (nonatomic, strong, readwrite) ARPriceRangeViewController *budgetTable;
@property (nonatomic, assign, readwrite) BOOL followedAtLeastOneCategory;
@property (nonatomic, strong) NSLayoutConstraint *navigationItemsBottomConstraint;

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


//- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
//{
//    [self showViews];
//}

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
    if (CGRectGetHeight(keyboardFrame)>0) {
        self.navigationItemsBottomConstraint.constant = -keyboardFrame.size.height;
    }
    [self.onboardingNavigationItems alignLeadingEdgeWithView:self.view predicate:@"0"];

    [self.onboardingNavigationItems.next addTarget:self action:@selector(nextTapped:) forControlEvents:UIControlEventTouchUpInside];
    [self.onboardingNavigationItems.back addTarget:self action:@selector(backTapped:) forControlEvents:UIControlEventTouchUpInside];

    self.headerView = [[AROnboardingHeaderView alloc] init];
    [self.view addSubview:self.headerView];

    [self.headerView alignTopEdgeWithView:self.view predicate:@"0"];
    [self.headerView constrainHeight:@"160"];
    [self.headerView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.headerView alignCenterXWithView:self.view predicate:@"0"];

    switch (self.state) {
        case AROnboardingStagePersonalizeEmail:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your email address" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"If you don't have an Artsy account yet we'll get one set up"
                         withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForEmail];
            self.onboardingTextFields.emailField.delegate = self;
            [self.onboardingTextFields.emailField becomeFirstResponder];
            [self addFacebookButton];
            break;
        case AROnboardingStagePersonalizePassword:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Create a password" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"Must be 7 characters or longer" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForPassword];
            [self.onboardingTextFields.passwordField becomeFirstResponder];
            self.onboardingTextFields.passwordField.delegate = self;
            [self addGoBackButton];
            break;
        case AROnboardingStagePersonalizeLogin:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your password" withLargeLayout:self.useLargeLayout];
//            [self.headerView addHelpText:@"Enter your password to log in" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForPassword];
            [self.onboardingTextFields.passwordField becomeFirstResponder];
            self.onboardingTextFields.passwordField.delegate = self;
            [self addForgotPasswordButton];
            break;
        case AROnboardingStagePersonalizeName:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your full name" withLargeLayout:self.useLargeLayout];
            [self.headerView addHelpText:@"Galleries and auction houses you contact will identify you by your full name" withLargeLayout:self.useLargeLayout];
            [self addTextFields];
            [self.onboardingTextFields setupForName];
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
            [self.onboardingNavigationItems disableNextStep];
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
}

- (void)addTextFields
{
    self.onboardingTextFields = [[ARLoginFieldsView alloc] init];
    [self.view addSubview:self.onboardingTextFields];
    
    [self.onboardingTextFields constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"0"];
    [self.onboardingTextFields alignCenterXWithView:self.view predicate:@"0"];
    [self.onboardingTextFields constrainTopSpaceToView:self.headerView predicate:@"5"];
    [self.onboardingTextFields constrainHeight:@"100"];
}

- (void)addButtons
{
    self.onboardingButtonsView = [[ARLoginButtonsView alloc] init];
    [self.view addSubview:self.onboardingButtonsView];
    
    
    [self.onboardingButtonsView constrainWidthToView:self.view predicate:self.useLargeLayout ? @"*.6" : @"*.9"];
    [self.onboardingButtonsView alignCenterXWithView:self.view predicate:@"0"];
    [self.onboardingButtonsView constrainHeight:@"30"];
    [self.onboardingButtonsView constrainTopSpaceToView:self.onboardingTextFields predicate:@"20"];
}
- (void)addFacebookButton
{

    [self addButtons];
    [self.onboardingButtonsView setupForFacebook];
    
    [self.onboardingButtonsView.actionButton addTarget:self
                                                        action:@selector(facebookTapped:)
                                              forControlEvents:UIControlEventTouchUpInside];
}

- (void)addForgotPasswordButton
{
    [self addButtons];
    [self.onboardingButtonsView setupForLogin];
    
    [self.onboardingButtonsView.actionButton addTarget:self
                                                action:@selector(forgotPassword:)
                                      forControlEvents:UIControlEventTouchUpInside];
}

- (void)addGoBackButton
{
    [self addButtons];
    [self.onboardingButtonsView setupForSignUp];
    
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
    self.navigationItemsBottomConstraint.constant = -keyboardFrame.size.height;

}
- (void)keyboardWillShow:(NSNotification *)notification
{
    if (self.state == AROnboardingStagePersonalizeEmail) {
        CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
        self.navigationItemsBottomConstraint.constant = -keyboardSize.height;
    }
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
                [self.onboardingNavigationItems showError:@"Try a different password"];
                return NO;
            } else {
                [self nextTapped:nil];
            }
        case AROnboardingStagePersonalizeEmail:
        case AROnboardingStagePersonalizeLogin:
        case AROnboardingStagePersonalizeName:
            [self nextTapped:nil];
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
    NSString *email = self.onboardingTextFields.emailField.text;
    
    if ([self validEmail:email]) {
        [self.onboardingNavigationItems enableNextStep];
    } else {
        [self.onboardingNavigationItems disableNextStep];
    }
}

- (void)passwordTextChanged
{
    NSString *password = self.onboardingTextFields.passwordField.text;
    
    if ([self validPassword:password]) {
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
    if (password.length < 7) {
        return NO;
    } else {
        return YES;
    }
}

#pragma mark -
#pragma mark Forgot Password

- (void)forgotPassword:(id)sender
{
    UIAlertView *alert = [[UIAlertView alloc]
                          initWithTitle:@"Forgot Password"
                          message:@"Please enter your email address and we’ll send you a reset link."
                          delegate:nil
                          cancelButtonTitle:@"Cancel"
                          otherButtonTitles:@"Send Link", nil];
    alert.alertViewStyle = UIAlertViewStylePlainTextInput;
    alert.tapBlock = ^(UIAlertView *alertView, NSInteger buttonIndex) {
        if (buttonIndex == alertView.firstOtherButtonIndex) {
            NSString *email = [[alertView textFieldAtIndex:0] text];
            if (![self validEmail:email]) {
                [self passwordResetError:@"Please check your email address"];
            } else {
//                [self showSpinner];
                [self.delegate sendPasswordResetEmail:email sender:self];
            }
        }
    };
//    [self hideKeyboard];
    [alert show];
}

- (void)passwordResetSent
{
//    [self hideSpinner];
    [UIAlertView showWithTitle:@"Please Check Your Email"
                       message:@"We have sent you an email with a link to reset your password"
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}

- (void)passwordResetError:(NSString *)message
{
//    [self hideSpinner];
    [UIAlertView showWithTitle:@"Couldn’t Reset Password"
                       message:message
             cancelButtonTitle:@"OK"
             otherButtonTitles:nil
                      tapBlock:nil];
}


#pragma mark -
#pragma mark Search Field

- (void)searchTextChanged
{
    BOOL searchBarIsEmpty = [self.headerView.searchField.searchField.text isEqualToString:@""];
    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeSearchResults;

    [self.searchRequestOperation cancel];

    if (searchBarIsEmpty) {
        [self.searchResultsTable updateTableContentsFor:@[] replaceContents:ARSearchResultsReplaceAll animated:NO];
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
    [self.headerView.searchField searchStarted];
}

- (void)searchEnded
{
    [self.headerView.searchField searchEnded];
}

#pragma mark -
#pragma mark Network

- (void)populateTrendingArtistsAnimated:(BOOL)animated
{
    [self.searchRequestOperation cancel];

    [self.searchResultsTable showLoadingSpinner];

    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;

    self.searchRequestOperation = [ArtsyAPI getPopularArtistsWithSuccess:^(NSArray *artists) {
        [self.searchResultsTable removeLoadingSpinner];
        [self.searchResultsTable updateTableContentsFor:artists
                                        replaceContents:ARSearchResultsReplaceAll
                                               animated:animated];
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
//        [self.searchResultsTable removeLoadingSpinner];
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
            [self.delegate personalizeLoginWithPasswordDone:self.onboardingTextFields.passwordField.text];
            break;
        case AROnboardingStagePersonalizeName:
            [self.delegate personalizeNameDone:self.onboardingTextFields.nameField.text];
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
    [self.delegate backTapped];
}

- (void)facebookTapped:(id)sender
{
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
