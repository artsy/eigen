#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingFollowableTableViewCell.h"
#import "Artsy+UILabels.h"
#import "UIColor+ArtsyColors.h"
#import "Artist.h"
#import "Gene.h"
#import "ARFollowable.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingPersonalizeTableViewController ()
@property (nonatomic, strong) NSMutableArray *searchResults;
@property (nonatomic, assign) BOOL shouldAnimate;
@end


@implementation AROnboardingPersonalizeTableViewController

- (instancetype)init
{
    self = [super init];
    if (self) {
        _searchResults = [NSMutableArray array];
    }

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.tableView registerClass:[AROnboardingFollowableTableViewCell class] forCellReuseIdentifier:@"OnboardingSearchCell"];

    self.tableView.delegate = self;
    self.tableView.dataSource = self;
}


- (void)updateTableContentsFor:(NSArray *)searchResults
               replaceContents:(ARSearchResultsReplaceContents)replaceStyle
                      animated:(BOOL)animated
{
    UITableViewRowAnimation animationStyle;
    switch (replaceStyle) {
        case ARSearchResultsReplaceSingle:
            if (searchResults[0]) {
                [self.searchResults replaceObjectAtIndex:self.tableView.indexPathForSelectedRow.row withObject:searchResults[0]];
            } else {
                [self.searchResults removeObjectAtIndex:self.tableView.indexPathForSelectedRow.row];
            }
            animationStyle = UITableViewRowAnimationFade;
            break;

        case ARSearchResultsReplaceAll:
            self.searchResults = searchResults.mutableCopy;
            animationStyle = UITableViewRowAnimationNone;
            break;

        default:
            animationStyle = UITableViewRowAnimationNone;
            break;
    }

    self.shouldAnimate = animated;
    [self.tableView reloadSections:[NSIndexSet indexSetWithIndex:0] withRowAnimation:animationStyle];
    [self flashAndFadeTableView];
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
    return self.searchResults.count;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    UIView *headerView = [[UIView alloc] init];
    ARSerifLabel *headerTitle = [[ARSerifLabel alloc] init];
    UIView *lineView = [[UIView alloc] init];

    switch (self.contentDisplayMode) {
        case ARTableViewContentDisplayModeSearchResults:
            headerTitle.text = @"";
            break;
        case ARTableViewContentDisplayModeRelatedResults:
            headerTitle.text = @"YOU MAY ALSO LIKE";
            break;
        case ARTableViewContentDisplayModePlaceholder:
            headerTitle.text = @"TOP ARTISTS ON ARTSY";
            break;
        default:
            break;
    }

    headerTitle.font = [UIFont serifFontWithSize:15.0f];

    [headerView addSubview:headerTitle];
    [headerTitle alignLeadingEdgeWithView:headerView predicate:@"15"];
    [headerTitle alignTrailingEdgeWithView:headerView predicate:@"-15"];
    [headerTitle constrainHeightToView:headerView predicate:@"0"];
    [headerTitle alignCenterYWithView:headerView predicate:@"0"];

    lineView.backgroundColor = self.tableView.separatorColor;
    [headerView addSubview:lineView];

    [lineView constrainHeight:@"0.5"];
    [lineView constrainWidthToView:headerView predicate:@"*.96"];
    [lineView alignBottom:@"0" trailing:@"0" toView:headerView];

    return headerView;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (self.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults && self.shouldAnimate) {
        CGRect originalFrame = cell.frame;

        cell.frame = CGRectMake(cell.frame.origin.x, self.tableView.frame.size.height, cell.frame.size.width, cell.frame.size.height);
        cell.alpha = 0;
        CGFloat duration = (0.6 * originalFrame.origin.y) / self.tableView.frame.size.height + 0.3;
        CGFloat delay = 0.18 * (indexPath.row);

        [UIView animateWithDuration:duration delay:delay options:UIViewAnimationOptionCurveEaseIn animations:^{
            cell.frame = originalFrame;
            cell.alpha = 1.0;
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
        cell.thumbnail.image = [UIImage imageWithData:[NSData dataWithContentsOfURL:artist.squareImageURL]];
    } else if ([result isKindOfClass:[Gene class]]) {
        Gene *gene = (Gene *)result;
        cell.title.text = gene.name;
        cell.thumbnail.image = [UIImage imageWithData:[NSData dataWithContentsOfURL:gene.smallImageURL]];
    }

    cell.follow.image = [UIImage imageNamed:@"followButton"];

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    cell.follow.image = [UIImage imageNamed:@"followButtonChecked"];

    NSObject<ARFollowable> *item = self.searchResults[indexPath.row];
    [self.networkDelegate followableItemClicked:item];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 80;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 40;
}

@end
