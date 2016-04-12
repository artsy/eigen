#import "ARPersonalizeViewController.h"

#import "Artist.h"
#import "ArtsyAPI+Search.h"
#import "ARFonts.h"
#import "AROnboardingGeneTableController.h"
#import "AROnboardingArtistTableController.h"
#import "AROnboardingSearchField.h"
#import "AROnboardingFollowableTableViewCell.h"
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


@property (nonatomic) UIScrollView *scrollView;

//Search table view is controlled by this VC because it interacts more with the search bar
@property (nonatomic) UITableView *artistTableView, *geneTableView, *searchTableView;
@property (nonatomic) UIView *searchView;
@property (nonatomic) AROnboardingHeaderView *headerView;
@property (nonatomic) AROnboardingSearchField *searchBar;
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
    //    self.scrollView = [[UIScrollView alloc] init];
    //    self.scrollView.frame = self.view.frame;
    //    self.scrollView.delaysContentTouches = NO;
    //    self.scrollView.backgroundColor = [UIColor blackColor];
    //    [self.view addSubview:self.scrollView];
    //
    //    CGSize screenSize = self.scrollView.bounds.size;
    //    UILabel *headline = [[UILabel alloc] initWithFrame:CGRectMake(20, 30, screenSize.width - 40, 40)];
    //    headline.font = [UIFont serifFontWithSize:24];
    //    headline.text = @"What interests you?";
    //    headline.textColor = [UIColor whiteColor];
    //    self.titleLabel = headline;
    //    [self.scrollView addSubview:headline];
    //
    //    UILabel *followArtists = [[UILabel alloc] initWithFrame:CGRectMake(20, 80, screenSize.width - 40, 20)];
    //    followArtists.font = [UIFont sansSerifFontWithSize:14];
    //    followArtists.textColor = [UIColor whiteColor];
    //    followArtists.text = [@"Enter your favorite artists" uppercaseString];
    //    [self.scrollView addSubview:followArtists];
    //
    //    CGFloat cancelButtonWidth = 70;
    //    CGFloat searchLeftMargin = 20;
    //    self.searchBar = [[AROnboardingSearchField alloc] initWithFrame:CGRectMake(searchLeftMargin, 105, screenSize.width - cancelButtonWidth - searchLeftMargin, 40)];
    //    self.searchBar.placeholder = @"Search artists…";
    //    self.searchBar.delegate = self;
    //    self.searchBar.autocapitalizationType = UITextAutocapitalizationTypeWords;
    //    self.searchBar.autocorrectionType = UITextAutocorrectionTypeNo;
    //    self.searchBar.keyboardAppearance = UIKeyboardAppearanceDark;
    //    [self.searchBar addTarget:self action:@selector(searchBarDown:) forControlEvents:UIControlEventTouchDown];
    //
    //    self.cancelButton = [UIButton buttonWithType:UIButtonTypeCustom];
    //    self.cancelButton.frame = CGRectMake(screenSize.width - cancelButtonWidth, self.searchBar.frame.origin.y, cancelButtonWidth, self.searchBar.bounds.size.height - 1);
    //    self.cancelButton.titleLabel.font = [UIFont sansSerifFontWithSize:11];
    //    self.cancelButton.backgroundColor = [UIColor blackColor];
    //    [self.cancelButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    //    [self.cancelButton setTitle:@"CANCEL" forState:UIControlStateNormal];
    //
    //    [self.scrollView addSubview:self.cancelButton];
    //    [self.cancelButton addTarget:self action:@selector(cancelSearch:) forControlEvents:UIControlEventTouchUpInside];
    //    self.cancelButton.alpha = 0;
    //
    //    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(startedEditing:)
    //                                                 name:UITextFieldTextDidBeginEditingNotification
    //                                               object:nil];
    //    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(searchTextChanged:)
    //                                                 name:UITextFieldTextDidChangeNotification
    //                                               object:nil];
    //
    //    [self.scrollView addSubview:self.searchBar];
    //
    //    self.artistTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, [self bottomOf:self.searchBar], screenSize.width, 10)];
    //    self.artistTableView.dataSource = self.artistController;
    //    self.artistTableView.delegate = self.artistController;
    //    [self.artistController prepareTableView:self.artistTableView];
    //    self.artistTableView.backgroundColor = [UIColor blackColor];
    //    self.artistTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    //    self.artistTableView.scrollEnabled = NO;
    //
    //    __weak typeof (self) wself = self;
    //    [self.artistController setPostRemoveBlock:^{
    //        __strong typeof (wself) sself = wself;
    //        [sself updateArtistTableViewAnimated:YES];
    //    }];
    //
    //    [self.scrollView addSubview:self.artistTableView];
    //
    //    self.geneTableView = [[UITableView alloc] initWithFrame:CGRectMake(0,
    //                                                                       [self bottomOf:self.artistTableView], screenSize.width,
    //                                                                       54 * self.genesToFollow.count + 50)];
    //    self.geneTableView.dataSource = self.geneController;
    //    self.geneTableView.delegate = self.geneController;
    //    [self.geneController prepareTableView:self.geneTableView];
    //    self.geneTableView.backgroundColor = [UIColor clearColor];
    //    self.geneTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    //    self.geneTableView.scrollEnabled = NO;
    //
    //    [self.scrollView addSubview:self.geneTableView];
    //
    //    self.searchView = [[UIView alloc] initWithFrame:CGRectMake(0,
    //                                                               [self bottomOf:self.searchBar],
    //                                                               screenSize.width, 1000)];
    //    self.searchView.backgroundColor = [UIColor blackColor];
    //    [self.scrollView addSubview:self.searchView];
    //    self.searchView.alpha = 0;
    //
    //    self.followedArtistsLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 20, screenSize.width - 40, 100)];
    //    self.followedArtistsLabel.numberOfLines = 0;
    //    self.followedArtistsLabel.font = [UIFont serifFontWithSize:16];
    //    self.followedArtistsLabel.textColor = [UIColor artsyGraySemibold];
    //    [self.searchView addSubview:self.followedArtistsLabel];
    //    self.followedArtistsLabel.alpha = 0;
    //
    //    self.searchTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, screenSize.width, 1000)];
    //    [self.searchView addSubview:self.searchTableView];
    //    self.searchTableView.dataSource = self;
    //    self.searchTableView.delegate = self;
    //    self.searchTableView.backgroundColor = [UIColor blackColor];
    //    self.searchTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    //    [self.searchTableView registerClass:[AROnboardingFollowableTableViewCell class] forCellReuseIdentifier:SearchCellId];
    //
    //    self.searchResults = @[];
    //
    //    self.scrollView.contentSize = CGSizeMake(CGRectGetWidth(self.view.bounds), CGRectGetMaxY(self.geneTableView.frame) + 44);
    //    self.continueButton = [[ARWhiteFlatButton alloc] initWithFrame:CGRectMake(0, screenSize.height - 44, screenSize.width, 44)];
    //    [self.continueButton addTarget:self action:@selector(continueTapped:) forControlEvents:UIControlEventTouchUpInside];
    //    [self.continueButton setTitle:@"Continue" forState:UIControlStateNormal];
    //    [self.view addSubview:self.continueButton];
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UITextFieldTextDidBeginEditingNotification object:nil];
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
    self.searchBar.text = @"";

    AROnboardingFollowableTableViewCell *cell = (AROnboardingFollowableTableViewCell *)[self.searchTableView cellForRowAtIndexPath:indexPath];
    cell.followState = !cell.followState;

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

- (void)updateArtistTableViewAnimated:(BOOL)animated
{
    if ([self.searchBar isFirstResponder]) {
        return;
    }
    CGRect aFrame = self.artistTableView.frame;
    aFrame.size.height = (54 * self.artistController.artists.count);

    CGRect gFrame = self.geneTableView.frame;
    gFrame.origin.y = CGRectGetMaxY(aFrame);

    [UIView animateSpringIf:animated duration:0.3 delay:0 damping:10 velocity:5:^{
        self.artistTableView.frame = aFrame;
        self.geneTableView.frame = gFrame;
        self.scrollView.contentSize = CGSizeMake(CGRectGetWidth(self.view.bounds), CGRectGetMaxY(self.geneTableView.frame) + 44);
    } completion:^(BOOL finished) {
        [self.artistTableView reloadData];
    }];
}

#pragma mark -
#pragma mark Search bar

- (void)searchBarDown:(id)sender
{
    if (self.cancelButton.alpha > 0) {
        return;
    }

    CGPoint currentOffset = self.scrollView.contentOffset;
    CGFloat off = -5;

    [UIView animateWithDuration:.07 delay:0 usingSpringWithDamping:.8 initialSpringVelocity:2.5 options:0 animations:^{
        self.scrollView.contentOffset = CGPointMake(currentOffset.x, currentOffset.y + off);

    } completion:^(BOOL finished) {
        [UIView animateWithDuration:.3 delay:0 usingSpringWithDamping:.8 initialSpringVelocity:2.5 options:0 animations:^{
            CGPoint currentOffset = self.scrollView.contentOffset;
            self.scrollView.contentOffset = CGPointMake(currentOffset.x, currentOffset.y + 105);
            self.cancelButton.alpha = 1;
            [self.scrollView bringSubviewToFront:self.cancelButton];
            self.scrollView.scrollEnabled = NO;
//            self.titleLabel.alpha = 0;
        } completion:nil];
    }];
}

- (void)cancelSearch:(id)sender
{
    [self.searchBar resignFirstResponder];
    self.searchBar.text = @"";
    [self updateArtistTableViewAnimated:NO];
    self.scrollView.scrollEnabled = YES;

    [UIView animateWithDuration:.35 delay:0 usingSpringWithDamping:.8 initialSpringVelocity:2.5 options:0 animations:^{
        self.scrollView.contentOffset = CGPointZero;

        self.cancelButton.alpha = 0;
        self.searchView.alpha = 0;
      //        self.titleLabel.alpha = 1;

    } completion:nil];
}

- (void)startedEditing:(id)sender
{
    [self.cancelButton setTitle:@"CANCEL" forState:UIControlStateNormal];
    self.followedThisSession = 0;
    self.followedArtistsLabel.alpha = 0;
    self.searchTableView.alpha = 0;

    [UIView animateWithDuration:.3 animations:^{
        self.searchView.alpha = 1;
    }];
}

- (void)searchTextChanged:(NSNotification *)notification
{
    BOOL searchBarIsEmpty = [self.searchBar.text isEqualToString:@""];
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
        return;
    }

    self.searchRequestOperation = [ArtsyAPI artistSearchWithQuery:self.searchBar.text success:^(NSArray *results) {
        self.searchResults = results;
        [self.searchTableView reloadData];

    } failure:^(NSError *error) {
        if (error.code != NSURLErrorCancelled) {
            [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            ARErrorLog(@"Personalize search network error %@", error.localizedDescription);
        }
    }];
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
    cell.followState = [self.artistController hasArtist:artist];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self searchToggleFollowStatusForArtist:self.searchResults[indexPath.row] atIndexPath:indexPath];
}

@end
