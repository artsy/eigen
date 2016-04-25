#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+RelatedModels.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingNavigationItemsView.h"
#import "AROnboardingHeaderView.h"
#import "Gene.h"
#import "ARLogger.h"

#import "MTLModel+JSON.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARPersonalizeViewController () <UITextFieldDelegate, PersonalizeNetworkDelegate>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic) UIView *searchView;
@property (nonatomic) AROnboardingHeaderView *headerView;
@property (nonatomic) AROnboardingNavigationItemsView *onboardingNavigationItems;
@property (nonatomic, strong) AROnboardingPersonalizeTableViewController *searchResultsTable;

@property (nonatomic) AFHTTPRequestOperation *searchRequestOperation;
@end


@implementation ARPersonalizeViewController

- (instancetype)initWithGenes:(NSArray *)genes forStage:(AROnboardingStage)stage
{
    self = [super init];
    if (self) {
        _state = stage;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(searchTextChanged:)
                                                 name:UITextFieldTextDidChangeNotification
                                               object:nil];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidChangeNotification object:nil];
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
    [self.onboardingNavigationItems constrainHeight:@"50"];
    [self.onboardingNavigationItems alignBottomEdgeWithView:self.view predicate:@"0"];
    [self.onboardingNavigationItems alignLeadingEdgeWithView:self.view predicate:@"0"];

    [self.onboardingNavigationItems.next addTarget:self action:@selector(nextTapped:) forControlEvents:UIControlEventTouchUpInside];
    [self.onboardingNavigationItems.back addTarget:self action:@selector(backTapped:) forControlEvents:UIControlEventTouchUpInside];

    self.headerView = [[AROnboardingHeaderView alloc] init];
    [self.view addSubview:self.headerView];

    [self.headerView alignTopEdgeWithView:self.view predicate:@"0"];
    [self.headerView constrainHeight:@"180"];
    [self.headerView constrainWidthToView:self.view predicate:@"0"];
    [self.headerView alignLeadingEdgeWithView:self.view predicate:@"0"];

    self.searchResultsTable = [[AROnboardingPersonalizeTableViewController alloc] init];
    self.searchResultsTable.networkDelegate = self;
    [self.view addSubview:self.searchResultsTable.view];

    [self.searchResultsTable.view alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.searchResultsTable.view constrainTopSpaceToView:self.headerView predicate:@"5"];
    [self.searchResultsTable.view constrainBottomSpaceToView:self.onboardingNavigationItems predicate:@"0"];

    switch (self.state) {
        case AROnboardingStagePersonalizeArtists:
            // progress percentages are made up for now, will be calculated by steps and remaining steps later
            [self.headerView setupHeaderViewWithTitle:@"Follow artists that most interest you." andProgress:0.33f];
            self.headerView.searchField.searchField.delegate = self;
            [self populateTrendingArtists];
            break;
        case AROnboardingStagePersonalizeCategories:
            [self.headerView setupHeaderViewWithTitle:@"Follow categories of art that most interest you." andProgress:0.5f];
            self.headerView.searchField.searchField.delegate = self;
            [self.onboardingNavigationItems disableNextStep];
            [self populateTrendingArtists];
            break;
        case AROnboardingStagePersonalizeBudget:
            [self.headerView setupHeaderViewWithTitle:@"Do you have a budget in mind?" andProgress:0.7f];
            break;
        default:
            break;
    }
}

#pragma mark -
#pragma mark Search Field

- (void)searchTextChanged:(NSNotification *)notification
{
    BOOL searchBarIsEmpty = [self.headerView.searchField.searchField.text isEqualToString:@""];
    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeSearchResults;

    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    if (searchBarIsEmpty) {
        [self.searchResultsTable updateTableContentsFor:@[] replaceContents:ARSearchResultsReplaceAll animated:NO];
        return;
    }

    switch (self.state) {
        case AROnboardingStagePersonalizeArtists: {
            self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.headerView.searchField.searchField.text success:^(NSArray *results) {
                [self.searchResultsTable updateTableContentsFor:results replaceContents:ARSearchResultsReplaceAll animated:NO];
            } failure:^(NSError *error) {
                [self reportError:error];
            }];
        } break;
        case AROnboardingStagePersonalizeCategories: {
            self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.headerView.searchField.searchField.text success:^(NSArray *results) {
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


#pragma mark -
#pragma mark Network

- (void)populateTrendingArtists
{
    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;

    self.searchRequestOperation = [ArtsyAPI getTrendingArtistsWithSuccess:^(NSArray *artists) {
        [self.searchResultsTable updateTableContentsFor:artists
                                        replaceContents:ARSearchResultsReplaceAll
                                               animated:NO];
    } failure:^(NSError *error) {
        [self reportError:error];
    }];
}

- (void)populateTrendingCategories
{
    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModePlaceholder;

    // call into gene API
}

- (void)artistFollowed:(Artist *)artist
{
    switch (self.searchResultsTable.contentDisplayMode) {
        case ARTableViewContentDisplayModeSearchResults: {
            self.searchResultsTable.contentDisplayMode = ARTableViewContentDisplayModeRelatedResults;
            self.searchRequestOperation = [ArtsyAPI getRelatedArtistsForArtist:artist success:^(NSArray *artists) {
                [self.searchResultsTable updateTableContentsFor:artists
                                                replaceContents:ARSearchResultsReplaceAll
                                                       animated:YES];
            } failure:^(NSError *error) {
                [self reportError:error];
            }];

            break;
        }
        case ARTableViewContentDisplayModeRelatedResults: {
            self.searchRequestOperation = [ArtsyAPI getRelatedArtistForArtist:artist success:^(NSArray *relatedArtist) {
                [self.searchResultsTable updateTableContentsFor:relatedArtist
                                                replaceContents:ARSearchResultsReplaceSingle
                                                       animated:NO];
            } failure:^(NSError *error) {
                [self reportError:error];
            }];

            break;
        }
        default:
            break;
    }
}

- (void)categoryFollowed:(Gene *)category
{
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
        case AROnboardingStagePersonalizeArtists:
            [self.delegate personalizeArtistsDone];
            break;
        case AROnboardingStagePersonalizeCategories:
            if (NO) { // chooseAtLeastOneCategory bool/method
                [self.delegate personalizeCategoriesDone];
            } else {
                [self.onboardingNavigationItems showWarning:@"Follow one or more categories"];
            }
            break;
        case AROnboardingStagePersonalizeBudget:
            [self.delegate personalizeBudgetDone];
            break;
        default:
            break;
    }
}

- (void)backTapped:(id)sender
{
    [self.delegate backTapped];
}

- (void)followableItemClicked:(NSObject<ARFollowable> *)item
{
    [self.delegate followableItemFollowed:item];

    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    switch (self.state) {
        case AROnboardingStagePersonalizeArtists: {
            [self artistFollowed:(Artist *)item];
            break;
        }

        case AROnboardingStagePersonalizeCategories: {
            [self categoryFollowed:(Gene *)item];
            break;
        }
        default:
            break;
    }
}

@end
