#import "ARPriceRangeViewController.h"

#import "ARFonts.h"
#import "AROnboardingViewController.h"
#import "AROnboardingFollowableTableViewCell.h"


@interface ARPriceRangeViewController ()
@property (nonatomic) NSArray *ranges;
@end


@implementation ARPriceRangeViewController
- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];

    self.ranges = @[
        @{ @"range" : @(500),
           @"display" : @"Under $500" },
        @{ @"range" : @(2500),
           @"display" : @"Under $2,500" },
        @{ @"range" : @(5000),
           @"display" : @"Under $5,000" },
        @{ @"range" : @(10000),
           @"display" : @"Under $10,000" },
        @{ @"range" : @(25000),
           @"display" : @"Under $25,000" },
        @{ @"range" : @(50000),
           @"display" : @"Under $50,000" },
        @{ @"range" : @(1000000),
           @"display" : @"No budget in mind" }
    ];


    [self.tableView registerClass:[AROnboardingFollowableTableViewCell class] forCellReuseIdentifier:@"OnboardingSearchCell"];
    self.tableView.backgroundColor = [UIColor clearColor];
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.scrollEnabled = NO;
}

#pragma mark -
#pragma mark Table view

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"OnboardingSearchCell"];
    [cell prepareForBudgetUse];
    cell.title.text = self.ranges[indexPath.row][@"display"];
    cell.accessoryType = UITableViewCellAccessoryNone;
    return cell;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.ranges.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 44 + (5 * 2);
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    _rangeValue = self.ranges[indexPath.row][@"range"];

    // deselect the others
    for (AROnboardingFollowableTableViewCell *otherCell in self.tableView.visibleCells) {
        otherCell.follow.image = nil;
    }

    AROnboardingFollowableTableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    cell.follow.image = [UIImage imageNamed:@"followButtonChecked"];

    [self.delegate budgetSelected];
}


@end
