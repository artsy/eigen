#import "AROnboardingPersonalizeTableViewController.h"
#import "AROnboardingFollowableTableViewCell.h"
#import "Artsy+UILabels.h"
#import "UIColor+ArtsyColors.h"
#import "Artist.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingPersonalizeTableViewController ()

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
    headerTitle.text = @"TOP ARTISTS ON ARTSY";
    headerTitle.font = [UIFont serifFontWithSize:14.0f];

    [headerView addSubview:headerTitle];
    [headerTitle alignLeadingEdgeWithView:headerView predicate:@"15"];
    [headerTitle alignTrailingEdgeWithView:headerView predicate:@"-15"];
    [headerTitle constrainHeightToView:headerView predicate:@"0"];
    [headerTitle alignCenterYWithView:headerView predicate:@"0"];

    return headerView;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"OnboardingSearchCell"];

    Artist *artist = self.searchResults[indexPath.row];
    cell.title.text = artist.name;

    //    cell.title.text = @"Glorious Artist";
    cell.follow.image = [UIImage imageNamed:@"followButton"];
    cell.thumbnail.image = [UIImage imageWithData:[NSData dataWithContentsOfURL:artist.squareImageURL]];
    return cell;
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
