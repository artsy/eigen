#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+RelatedModels.h"
#import "ARFonts.h"
#import "AROnboardingGeneTableController.h"
#import "AROnboardingArtistTableController.h"
#import "AROnboardingFollowableTableViewCell.h"
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


@interface ARPersonalizeViewController () <UITextFieldDelegate>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic) NSArray *genesToFollow;
//@property (nonatomic) NSArray *searchResults;

@property (nonatomic, strong) AROnboardingPersonalizeTableViewController *searchResultsTable;


@property (nonatomic) UIView *searchView;
@property (nonatomic) AROnboardingHeaderView *headerView;
@property (nonatomic) UILabel *followedArtistsLabel;
@property (nonatomic) UIButton *cancelButton;
@property (nonatomic, assign) NSInteger followedThisSession;
@property (nonatomic) AROnboardingNavigationItemsView *onboardingNavigationItems;

@property (nonatomic) ARWhiteFlatButton *continueButton;

@property (nonatomic) AFHTTPRequestOperation *searchRequestOperation;
@end


@implementation ARPersonalizeViewController

- (instancetype)initWithGenes:(NSArray *)genes forStage:(AROnboardingStage)stage
{
    self = [super init];
    if (self) {
        _state = stage;
        //        _searchResults = [NSMutableArray array];
        if (!genes || genes.count == 0) {
            NSArray *fallbackGenes = @[ @"Photography", @"Bauhaus", @"Dada", @"Glitch Aesthetic", @"Early Computer Art", @"Op Art", @"Minimalism" ];
            ARActionLog(@"Using fallback genes in 'Personalize'");
            // Convert names to Gene Objects
            _genesToFollow = [fallbackGenes map:^id(NSString *name) {
                NSString *geneID = [[name stringByReplacingOccurrencesOfString:@" " withString:@"-"]
                                    lowercaseString];
                Gene *gene = [Gene modelWithJSON:@{
                                                   @"name" : name,
                                                   @"id" : geneID
                                                   }];
                return gene;
            }];
        } else {
            _genesToFollow = genes;
        }

        _artistController = [[AROnboardingArtistTableController alloc] init];
        _geneController = [[AROnboardingGeneTableController alloc] initWithGenes:_genesToFollow];
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

    switch (self.state) {
        case AROnboardingStagePersonalizeArtists:
            // progress percentages are made up for now, will be calculated by steps and remaining steps later
            [self.headerView setupHeaderViewWithTitle:@"Follow artists that most interest you." andProgress:33.3f];
            self.headerView.searchField.searchField.delegate = self;
            break;
        case AROnboardingStagePersonalizeCategories:
            [self.headerView setupHeaderViewWithTitle:@"Follow categories of art that most interest you." andProgress:50.0f];
            [self.onboardingNavigationItems disableNextStep];
            break;
        case AROnboardingStagePersonalizeBudget:
            [self.headerView setupHeaderViewWithTitle:@"Do you have a budget in mind?" andProgress:70.0f];
            break;
        default:
            break;
    }

    self.searchResultsTable = [[AROnboardingPersonalizeTableViewController alloc] init];
    [self.view addSubview:self.searchResultsTable.view];

    [self.searchResultsTable.view alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.searchResultsTable.view constrainTopSpaceToView:self.headerView predicate:@"5"];
    [self.searchResultsTable.view constrainBottomSpaceToView:self.onboardingNavigationItems predicate:@"0"];
}

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

- (NSArray *)getRelatedArtistsForArtist:(Artist *)artist
{
    __block NSArray *results;

    [ArtsyAPI getRelatedArtistsForArtist:artist success:^(NSArray *artists) {
        results = artists;
    } failure:^(NSError *error) {
        if (error.code != NSURLErrorCancelled) {
            [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            ARErrorLog(@"Personalize search related network error %@", error.localizedDescription);
        }
        results = @[];
    }];

    return results;
}

#pragma mark -
#pragma mark Search bar


- (void)searchTextChanged:(NSNotification *)notification
{
    BOOL searchBarIsEmpty = [self.headerView.searchField.searchField.text isEqualToString:@""];

    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    if (searchBarIsEmpty) {
        [self.searchResultsTable updateTableContentsFor:@[] replaceContents:ARSearchResultsReplaceAll animated:NO];
    }
    self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.headerView.searchField.searchField.text success:^(NSArray *results) {
        [self.searchResultsTable updateTableContentsFor:results replaceContents:ARSearchResultsReplaceAll animated:NO];
    } failure:^(NSError *error) {
            if (error.code != NSURLErrorCancelled) {
                [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
                ARErrorLog(@"Personalize search network error %@", error.localizedDescription);
            }
    }];
}

@end
