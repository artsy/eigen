#import "ARAuctionArtworkResultsViewController.h"
#import "ARAuctionArtworkTableViewCell.h"
#import "ARAuctionResultsNetworkModel.h"
#import "ARPageSubtitleView.h"
#import "ARFeedStatusIndicatorTableViewCell.h"

static NSString *ARAuctionTableViewCellIdentifier = @"ARAuctionTableViewCellIdentifier";
static NSString *ARAuctionTableViewHeaderIdentifier = @"ARAuctionTableViewHeaderIdentifier";

static const NSInteger ARArtworkIndex = 0;


@interface ARAuctionArtworkResultsViewController ()
@property (nonatomic, strong) NSObject<AuctionResultsNetworkModel> *network;
@property (nonatomic, copy) NSArray *auctionResults;
@end


@implementation ARAuctionArtworkResultsViewController

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    self = [super initWithStyle:UITableViewStyleGrouped];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
    _network = [[ARAuctionResultsNetworkModel alloc] initWithArtwork:artwork];

    return self;
}

- (UIView *)createWarningView
{
    UIView *container = [[UIView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(self.view.bounds), 100)];
    UILabel *warning = [[ARWarningView alloc] initWithFrame:CGRectZero];

    warning.text = @"Note: Auction results are an experimental feature with limited data.";
    [container addSubview:warning];
    [warning alignTop:@"0" leading:@"60" bottom:@"-12" trailing:@"-60" toView:container];

    container.backgroundColor = warning.backgroundColor;
    return container;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self.tableView registerClass:ARAuctionArtworkTableViewCell.class forCellReuseIdentifier:ARAuctionTableViewCellIdentifier];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.allowsSelection = NO;
    self.tableView.backgroundColor = [UIColor whiteColor];
    self.tableView.tableHeaderView = [self createWarningView];

    @weakify(self);
    [self.network getRelatedAuctionResults:^(NSArray *auctionResults) {
        @strongify(self);
        self.auctionResults = auctionResults;
        [self.tableView reloadData];
    }];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 2;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    NSString *title = (section == ARArtworkIndex) ? @"COMPARABLE AUCTION RESULTS FOR" : @"MOST SIMILAR RESULTS";
    return [[ARPageSubTitleView alloc] initWithTitle:title];
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 40;
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return 0;
}

- (CGFloat)tableView:(UITableView *)tableView estimatedHeightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == ARArtworkIndex) {
        CGFloat width = CGRectGetWidth(self.view.bounds);
        return [ARAuctionArtworkTableViewCell heightWithArtwork:self.artwork withWidth:width];
    }

    if (self.auctionResults.count) {
        return [ARAuctionArtworkTableViewCell estimatedHeightWithAuctionLot:self.auctionResults[indexPath.row]];
    } else {
        return [ARFeedStatusIndicatorTableViewCell heightForFeedItemWithState:ARFeedStatusStateLoading];
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat width = CGRectGetWidth(self.view.bounds);
    if (indexPath.section == ARArtworkIndex) {
        return [ARAuctionArtworkTableViewCell heightWithArtwork:self.artwork withWidth:width];
    }

    if (self.auctionResults.count) {
        return [ARAuctionArtworkTableViewCell heightWithAuctionLot:self.auctionResults[indexPath.row] withWidth:width];
    } else {
        return [ARFeedStatusIndicatorTableViewCell heightForFeedItemWithState:ARFeedStatusStateLoading];
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (section == ARArtworkIndex) {
        return 1;
    }

    return MAX(self.auctionResults.count, 1);
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section != ARArtworkIndex && self.auctionResults.count == 0) {
        return [ARFeedStatusIndicatorTableViewCell cellWithInitialState:ARFeedStatusStateLoading];
    }

    return [self.tableView dequeueReusableCellWithIdentifier:ARAuctionTableViewCellIdentifier];
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(ARAuctionArtworkTableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.section == ARArtworkIndex) {
        [cell updateWithArtwork:self.artwork];

    } else if (self.auctionResults.count) {
        [cell updateWithAuctionResult:self.auctionResults[indexPath.row]];
    }
}


- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

@end
