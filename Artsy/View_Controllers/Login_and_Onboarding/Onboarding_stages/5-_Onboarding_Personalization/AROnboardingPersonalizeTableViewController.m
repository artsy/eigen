#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingFollowableTableViewCell.h"
#import "Artsy+UILabels.h"
#import "UIColor+ArtsyColors.h"
#import "Artist.h"
#import "Gene.h"
#import "ARFollowable.h"
#import "UIImageView+AsyncImageLoading.h"
#import "AROnboardingPersonalizationGeneImageStateReconciler.h"

#import <Extraction/ARSpinner.h>
#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingPersonalizeTableViewController ()

@property (nonatomic, assign) BOOL shouldAnimate;
@property (nonatomic, strong) AROnboardingPersonalizationGeneImageStateReconciler *geneImageReconciler;
@property (nonatomic, strong) NSIndexPath *selectedRowToReplace;
@property (nonatomic, strong, readwrite) NSMutableArray *searchResults;
@property (nonatomic, strong) UILabel *noResultsLabel;
@property (nonatomic, assign) BOOL loadedInitialResults;
@property (nonatomic, strong) ARSpinner *spinner;

@end


@implementation AROnboardingPersonalizeTableViewController

- (instancetype)init
{
    self = [super init];
    if (self) {
        _geneImageReconciler = [AROnboardingPersonalizationGeneImageStateReconciler new];
        _searchResults = [NSMutableArray array];
        _loadedInitialResults = NO;
    }

    return self;
}

- (NSArray *)displayedResults
{
    return self.searchResults;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.tableView registerClass:[AROnboardingFollowableTableViewCell class] forCellReuseIdentifier:@"OnboardingSearchCell"];

    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.tableFooterView = [[UIView alloc] initWithFrame:CGRectZero];

    [self setupEmptyResultsLabel];
}

- (void)showLoadingSpinner
{
    ARSpinner *spinner = [[ARSpinner alloc] init];
    [self.view addSubview:spinner];

    [spinner constrainWidth:@"44" height:@"44"];
    [spinner alignCenterWithView:self.view];
    spinner.spinnerColor = [UIColor blackColor];
    self.spinner = spinner;
    [self.spinner startAnimating];
}

- (void)removeLoadingSpinner
{
    if (self.spinner) {
        [self.spinner stopAnimating];
        [self.spinner removeFromSuperview];
    }
}

- (void)updateTableContentsFor:(NSArray *)searchResults
               replaceContents:(ARSearchResultsReplaceContents)replaceStyle
                      animated:(BOOL)animated
{
    [self removeLoadingSpinner];
    self.loadedInitialResults = YES;
    switch (replaceStyle) {
        case ARSearchResultsReplaceSingle:
            if (searchResults.count) {
                [self.searchResults replaceObjectAtIndex:self.tableView.indexPathForSelectedRow.row withObject:searchResults[0]];
                self.selectedRowToReplace = self.tableView.indexPathForSelectedRow;
                if (self.selectedRowToReplace) {
                    [self.geneImageReconciler addReplacedGene:self.selectedRowToReplace];
                }
            } else if (self.searchResults.count) {
                [self.searchResults removeObjectAtIndex:self.tableView.indexPathForSelectedRow.row];
            }
            break;
        case ARSearchResultsReplaceAll:
            if (self.searchResults.count > 1) {
               [self.tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:NO];
            }
            [self.geneImageReconciler reset];
            self.searchResults = searchResults.mutableCopy;
            break;
        default:
            break;
    }
    self.shouldAnimate = animated;
    [self.tableView reloadData];
    [self.tableView layoutIfNeeded];
    self.shouldAnimate = NO;
}

- (void)flashAndFadeTableView
{
    if (self.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults && self.shouldAnimate) {
        [UIView animateWithDuration:0.35 animations:^{
            self.tableView.alpha = 0;
        } completion:^(BOOL finished) {
            self.tableView.alpha = 1;
        }];

        self.shouldAnimate = NO;
    }
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (self.searchResults.count == 0) {
        BOOL resultsNotYetLoaded = (self.loadedInitialResults == NO);
        self.noResultsLabel.hidden = resultsNotYetLoaded;
    } else {
        self.noResultsLabel.hidden = YES;
    }

    return self.searchResults.count;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    UIView *headerView = [[UIView alloc] init];

    if (self.searchResults.count == 0) {
        return headerView;
    }

    ARSerifLabel *headerTitle = [[ARSerifLabel alloc] init];
    UIView *lineView = [[UIView alloc] init];

    headerView.backgroundColor = [UIColor whiteColor];
    switch (self.contentDisplayMode) {
        case ARTableViewContentDisplayModeSearchResults:
            headerTitle.text = @"";
            break;
        case ARTableViewContentDisplayModeRelatedResults:
            headerTitle.text = @"YOU MAY ALSO LIKE";
            break;
        case ARTableViewContentDisplayModePlaceholder:
            headerTitle.text = self.headerPlaceholderText;
            break;
        default:
            break;
    }

    headerTitle.font = [UIFont serifFontWithSize:15.0f];

    [headerView addSubview:headerTitle];
    [headerTitle alignLeadingEdgeWithView:headerView predicate:@"20"];
    [headerTitle alignTrailingEdgeWithView:headerView predicate:@"-20"];
    [headerTitle constrainHeightToView:headerView predicate:@"0"];
    [headerTitle alignCenterYWithView:headerView predicate:@"0"];

    lineView.backgroundColor = [UIColor artsyGrayRegular];
    [headerView addSubview:lineView];

    [lineView constrainHeight:@"0.5"];
    [lineView alignLeading:@"20" trailing:@"-20" toView:headerView];
    [lineView alignBottomEdgeWithView:headerView predicate:@"0"];

    return headerView;
}

// Overridden in order to add custom animation to tableviewcells being displayed, rather than using UITableViewRowAnimation
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    // We only show custom animation in the case of the related suggestions after clicking a row
    // This animation has suggestions content coming in from the bottom
    if ((self.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults ||
         self.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) &&
        self.shouldAnimate) {
        // State to animate to
        CGRect originalFrame = cell.frame;

        // Start the cell at the bottom of the tableview
        cell.frame = CGRectMake(cell.frame.origin.x, self.tableView.frame.size.height, cell.frame.size.width, cell.frame.size.height);
        cell.alpha = 0;

        // The lower down the cell is in the list, the longer the animation takes (cell has further to travel)
        // Equally, to stagger, we want the bottom cells to start their animation later than the top cells
        // Other than that, magic constants are just the result of tweaks over time
        CGFloat duration = ((0.8 * originalFrame.origin.y) / self.tableView.frame.size.height + 0.3) + 0.15;
        CGFloat delay = 0.1 * (indexPath.row) + 0.2;

        [UIView animateWithDuration:duration delay:delay options:UIViewAnimationOptionCurveEaseInOut animations:^{
            cell.frame = originalFrame;
            cell.alpha = 0.8;
        } completion:^(BOOL finished) {
            cell.alpha = 1.0;
        }];
    } else if (indexPath == self.selectedRowToReplace) {
        cell.alpha = 0;
        [UIView animateWithDuration:0.45 delay:0.05 options:UIViewAnimationOptionCurveEaseInOut animations:^{
            cell.alpha = 0.7;
        } completion:^(BOOL finished) {
            cell.alpha = 1.0;
            self.selectedRowToReplace = nil;
        }];
    }
}

// overridden to add custom animation for the "you might like" header
- (void)tableView:(UITableView *)tableView willDisplayHeaderView:(UIView *)view forSection:(NSInteger)section
{
    if (self.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults && self.shouldAnimate) {
        CGRect originalFrame = view.frame;

        view.frame = CGRectMake(originalFrame.origin.x, originalFrame.origin.y + (2 * originalFrame.size.height),
                                originalFrame.size.width, originalFrame.size.height);
        view.alpha = 0;

        [UIView animateWithDuration:0.3 delay:0.1 options:UIViewAnimationOptionCurveEaseInOut animations:^{
            view.frame = originalFrame;
            view.alpha = 1.0;
        } completion:^(BOOL finished){
        }];
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"OnboardingSearchCell"];

    NSObject *result = self.searchResults[indexPath.row];

    if ([result isKindOfClass:[Artist class]]) {
        Artist *artist = (Artist *)result;
        cell.title.text = artist.name;
        [cell.thumbnail ar_setImageWithURL:artist.squareImageURL];
    } else if ([result isKindOfClass:[Gene class]]) {
        Gene *gene = (Gene *)result;
        cell.title.text = gene.name;

        NSURL *geneImageURL;
        if (self.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) {
            geneImageURL = [self.geneImageReconciler imageURLForGene:gene atIndexPath:indexPath];
        } else {
            geneImageURL = gene.smallImageURL;
        }
        [cell.thumbnail ar_setImageWithURL:geneImageURL];
    }
    cell.thumbnail.backgroundColor = [UIColor purpleColor];
    cell.follow.image = [UIImage imageNamed:@"followButton"];

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    cell.follow.image = [UIImage imageNamed:@"followButtonChecked"];

    [self.networkDelegate followableItemClicked:self.searchResults[indexPath.row]];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 72;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 40;
}

#pragma mark - Accessory views

- (void)setupEmptyResultsLabel
{
    self.noResultsLabel = [[UILabel alloc] init];
    self.noResultsLabel.text = @"No results found";
    self.noResultsLabel.font = [UIFont serifItalicFontWithSize:20.0];
    self.noResultsLabel.textColor = [UIColor artsyGraySemibold];
    self.noResultsLabel.textAlignment = NSTextAlignmentCenter;
    [self.tableView addSubview:self.noResultsLabel];

    [self.noResultsLabel constrainWidth:@"300" height:@"60"];
    [self.noResultsLabel alignCenterXWithView:self.tableView predicate:@"0"];
    [self.noResultsLabel alignCenterYWithView:self.tableView predicate:@"-60"];
}


@end
