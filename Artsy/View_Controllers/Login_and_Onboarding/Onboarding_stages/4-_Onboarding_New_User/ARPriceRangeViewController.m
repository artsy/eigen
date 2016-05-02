#import "ARPriceRangeViewController.h"

#import "ARFonts.h"
#import "AROnboardingViewController.h"
#import "AROnboardingTableViewCell.h"


@interface ARPriceRangeViewController () <UITableViewDataSource, UITableViewDelegate>
@property (nonatomic) NSArray *ranges;
@end


@implementation ARPriceRangeViewController
- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];

    CGSize screenSize = self.view.bounds.size;
    NSInteger tableOrigin;
    if (screenSize.height > 480) {
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
            @{ @"range" : @(100000),
               @"display" : @"Under $100,000" },
            @{ @"range" : @(1000000),
               @"display" : @"$100,000+" }
        ];
        tableOrigin = 120;

    } else {
        self.ranges = @[
            @{ @"range" : @(1000),
               @"display" : @"Under $1,000" },
            @{ @"range" : @(5000),
               @"display" : @"Under $5,000" },
            @{ @"range" : @(20000),
               @"display" : @"Under $20,000" },
            @{ @"range" : @(50000),
               @"display" : @"Under $50,000" },
            @{ @"range" : @(100000),
               @"display" : @"Under $100,000" },
            @{ @"range" : @(1000000),
               @"display" : @"$100,000+" }
        ];
        tableOrigin = 136;
    }
    UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, tableOrigin, screenSize.width, screenSize.height - tableOrigin)
                                                          style:UITableViewStylePlain];
    [tableView registerClass:[AROnboardingTableViewCell class] forCellReuseIdentifier:@"StatusCell"];
    tableView.backgroundColor = [UIColor clearColor];
    tableView.dataSource = self;
    tableView.delegate = self;
    tableView.scrollEnabled = NO;
    tableView.separatorStyle = UITableViewCellSeparatorStyleNone;

    [self.view addSubview:tableView];
    CALayer *sep = [CALayer layer];
    sep.frame = CGRectMake(15, 0, CGRectGetWidth(self.view.bounds) - 30, .5);
    sep.backgroundColor = [UIColor artsyGrayRegular].CGColor;
    [tableView.layer addSublayer:sep];

    UILabel *header = [[UILabel alloc] initWithFrame:CGRectMake(20, 30, CGRectGetWidth(self.view.bounds) - 40, 30)];
    header.textColor = [UIColor blackColor];
    header.font = [UIFont serifFontWithSize:24];
    header.text = @"Do you have a budget in mind?";
    [self.view addSubview:header];
}

#pragma mark -
#pragma mark Table view

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"StatusCell"];
    cell.textLabel.text = self.ranges[indexPath.row][@"display"];
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
    NSNumber *range = self.ranges[indexPath.row][@"range"];
    [self.delegate setPriceRangeDone:[range integerValue]];
}


@end
