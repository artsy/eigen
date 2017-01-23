#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+RelatedModels.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingNavigationItemsView.h"
#import "AROnboardingHeaderView.h"
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


@interface ARPersonalizeViewController () <UITextFieldDelegate, ARPersonalizeNetworkDelegate, ARPersonalizeContainer>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic, strong, readwrite) UIView *searchView;
@property (nonatomic, strong, readwrite) AROnboardingHeaderView *headerView;
@property (nonatomic, strong, readwrite) AROnboardingNavigationItemsView *onboardingNavigationItems;
@property (nonatomic, strong, readwrite) AROnboardingPersonalizeTableViewController *searchResultsTable;
@property (nonatomic, strong, readwrite) ARPriceRangeViewController *budgetTable;
@property (nonatomic, assign, readwrite) BOOL followedAtLeastOneCategory;

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

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(searchTextChanged:)
                                                 name:UITextFieldTextDidChangeNotification
                                               object:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(searchStarted:)
                                                 name:UITextFieldTextDidBeginEditingNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(searchEnded:)
                                                 name:UITextFieldTextDidEndEditingNotification
                                               object:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidBeginEditingNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidEndEditingNotification object:nil];
}


- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
    [self showViews];
}

- (void)showViews
{
    self.view.backgroundColor = [UIColor whiteColor];

    self.onboardingNavigationItems = [[AROnboardingNavigationItemsView alloc] init];
    [self.view addSubview:self.onboardingNavigationItems];

    [self.onboardingNavigationItems constrainWidthToView:self.view predicate:@"0"];
    [self.onboardingNavigationItems alignBottomEdgeWithView:self.view predicate:@"0"];
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
            [self.headerView hideSearchBar];
            break;
        case AROnboardingStagePersonalizePassword:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Create a password" withLargeLayout:self.useLargeLayout];
            [self.headerView hideSearchBar];
            break;
        case AROnboardingStagePersonalizeName:
            [self.onboardingNavigationItems disableNextStep];
            [self.headerView setupHeaderViewWithTitle:@"Enter your full name" withLargeLayout:self.useLargeLayout];
            [self.headerView hideSearchBar];
            break;
        case AROnboardingStagePersonalizeArtists:
            [self addSearchTable];
            // progress percentages are made up for now, will be calculated by steps and remaining steps later
            [self.headerView setupHeaderViewWithTitle:@"Follow artists that most interest you" withLargeLayout:self.useLargeLayout];
            self.searchResultsTable.headerPlaceholderText = @"TOP ARTISTS ON ARTSY";
            self.headerView.searchField.searchField.delegate = self;
            [self.headerView.searchField.searchField setPlaceholder:@"Search artist"];
            [self populateTrendingArtistsAnimated:NO];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self addSearchTable];
            [self.headerView setupHeaderViewWithTitle:@"Follow categories of art that most interest you" withLargeLayout:self.useLargeLayout];
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
            [self.headerView hideSearchBar];
            break;
        default:
            break;
    }
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
#pragma mark Search Field

- (void)searchTextChanged:(NSNotification *)notification
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

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

- (void)searchStarted:(NSNotification *)notification
{
    [self.headerView.searchField searchStarted];
}

- (void)searchEnded:(NSNotification *)notification
{
    [self.headerView.searchField searchEnded];
}

#pragma mark -
#pragma mark Network

- (void)populateTrendingArtistsAnimated:(BOOL)animated
{
    [self.searchRequestOperation cancel];


    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;

    self.searchRequestOperation = [ArtsyAPI getPopularArtistsWithSuccess:^(NSArray *artists) {
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
            [self.delegate personalizeEmailDone];
            break;
        case AROnboardingStagePersonalizePassword:
            [self.delegate personalizePasswordDone];
            break;
        case AROnboardingStagePersonalizeName:
            [self.delegate personalizeNameDone];
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
