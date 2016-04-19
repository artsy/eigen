#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
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


static NSString *SearchCellId = @"OnboardingSearchCell";


@interface ARPersonalizeViewController () <UIScrollViewDelegate, UITableViewDelegate, UITableViewDataSource, UITextFieldDelegate>

@property (nonatomic, assign, readwrite) AROnboardingStage state;

@property (nonatomic) NSArray *genesToFollow;
@property (nonatomic) NSArray *searchResults;

@property (nonatomic) AROnboardingGeneTableController *geneController;
@property (nonatomic) AROnboardingArtistTableController *artistController;
@property (nonatomic, strong) AROnboardingPersonalizeTableViewController *searchResultsTable;


@property (nonatomic) UIScrollView *scrollView;

//Search table view is controlled by this VC because it interacts more with the search bar
@property (nonatomic) UITableView *artistTableView, *geneTableView, *searchTableView;
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
        _searchResults = [NSMutableArray array];
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

- (void)searchToggleFollowStatusForArtist:(Artist *)artist atIndexPath:indexPath
{
    self.searchResults = @[];
    self.headerView.searchField.searchField.text = @"";

    AROnboardingFollowableTableViewCell *cell = (AROnboardingFollowableTableViewCell *)[self.searchTableView cellForRowAtIndexPath:indexPath];
    //    cell.followState = !cell.followState;

    // We need to do this vs. checking if followed because
    // the artist instance that was followed is a different object
    // to this one

    if ([self.artistController hasArtist:artist]) {
        self.followedThisSession--;
        artist.followed = NO;
        [self.artistController removeArtist:artist];

        [artist unfollowWithSuccess:nil failure:^(NSError *error) {
            [self.artistController addArtist:artist];
            [self updateFollowString];
        }];
    } else {
        self.followedThisSession++;
        [self.artistController addArtist:artist];

        [artist followWithSuccess:nil failure:^(NSError *error) {
            [self.artistController removeArtist:artist];
            [self updateFollowString];
        }];
    }

    [self updateFollowString];

    if (self.followedThisSession <= 0) {
        [self.cancelButton setTitle:@"CANCEL" forState:UIControlStateNormal];

    } else if (self.followedThisSession == 1) { //if it went from zero to positive, it's 1
        [self.cancelButton setTitle:@"DONE" forState:UIControlStateNormal];
    }

    NSArray *otherCells = [[self.searchTableView visibleCells] reject:^BOOL(UITableViewCell *aCell) {
        return cell == aCell;
    }];

    [UIView animateWithDuration:.2 animations:^{
        for (UIView *view in otherCells) {
            view.alpha = 0;
        }
    }];

    [UIView animateWithDuration:.2 delay:.2 options:0 animations:^{
        self.searchTableView.alpha = 0;
        self.followedArtistsLabel.alpha = 1;

    } completion:^(BOOL finished) {
        self.searchResults = @[];
        [self.searchTableView reloadData];
    }];
}

- (void)updateFollowString
{
    NSArray *names = [[self.artistController.artists array] map:^id(Artist *artist) {
        return artist.name;
    }];

    if (names.count == 0) {
        self.followedArtistsLabel.attributedText = [[NSAttributedString alloc] initWithString:@""];
        return;
    }

    NSString *text = [@"Following " stringByAppendingString:[names componentsJoinedByString:@", "]];
    NSMutableAttributedString *attr = [[NSMutableAttributedString alloc] initWithString:text];
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];

    [attr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [text length])];
    self.followedArtistsLabel.attributedText = attr;
    CGSize suggested = [self.followedArtistsLabel sizeThatFits:self.searchView.bounds.size];
    CGRect frame = self.followedArtistsLabel.frame;
    frame.size.height = suggested.height;
    self.followedArtistsLabel.frame = frame;
}


#pragma mark -
#pragma mark Search bar


- (BOOL)textFieldShouldClear:(UITextField *)textField
{
    //    [self.headerView.searchField.searchField resignFirstResponder];
    //    self.headerView.searchField.searchField.text = @"";
    //    [self updateArtistTableViewAnimated:NO];
    //    self.scrollView.scrollEnabled = YES;

    [UIView animateWithDuration:.35 delay:0 usingSpringWithDamping:.8 initialSpringVelocity:2.5 options:0 animations:^{
        self.scrollView.contentOffset = CGPointZero;
        
        self.cancelButton.alpha = 0;
        self.searchView.alpha = 0;
      //        self.titleLabel.alpha = 1;

    } completion:nil];

    return YES;
}

- (void)textFieldDidBeginEditing:(UITextField *)textField
{
    //    [self.cancelButton setTitle:@"CANCEL" forState:UIControlStateNormal];
    //    self.followedThisSession = 0;
    //    self.followedArtistsLabel.alpha = 0;
    //    self.searchTableView.alpha = 0;
    //
    //    [UIView animateWithDuration:.3 animations:^{
    //        self.searchView.alpha = 1;
    //    }];
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    BOOL searchBarIsEmpty = [self.headerView.searchField.searchField.text isEqualToString:@""];
    if (self.searchTableView.alpha == 0) {
        [UIView animateWithDuration:.1 animations:^{
            self.searchTableView.alpha = 1;
        }];

    } else if (searchBarIsEmpty) {
        self.searchTableView.alpha = 0;
    }

    if (self.searchRequestOperation) {
        [self.searchRequestOperation cancel];
    }

    if (searchBarIsEmpty) {
        self.searchResults = @[];
        [self.searchTableView reloadData];
        return YES;
    }

    self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.headerView.searchField.searchField.text success:^(NSArray *results) {
        self.searchResults = results;
        [self.searchTableView reloadData];

    } failure:^(NSError *error) {
        if (error.code != NSURLErrorCancelled) {
            [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            ARErrorLog(@"Personalize search network error %@", error.localizedDescription);
        }
    }];

    return YES;
}

#pragma mark -
#pragma mark Table view delegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.searchResults.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 54;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:SearchCellId];
    Artist *artist = self.searchResults[indexPath.row];
    cell.textLabel.text = artist.name;
    //    cell.followState = [self.artistController hasArtist:artist];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //    [self searchToggleFollowStatusForArtist:self.searchResults[indexPath.row] atIndexPath:indexPath];
}

@end
