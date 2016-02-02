#import "ARCollectorStatusViewController.h"

#import "ARFonts.h"
#import "AROnboardingTableViewCell.h"
#import "AROnboardingViewController.h"
#import "UIViewController+ScreenSize.h"

#import <Artsy_UILabels/ARLabelSubclasses.h>

@interface ARCollectorStatusViewController () <UITableViewDataSource, UITableViewDelegate>
@property (nonatomic) ARSerifLineHeightLabel *label;
@property (nonatomic) UITableView *tableView;
@end


@implementation ARCollectorStatusViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor clearColor];

    CGSize screenSize = self.view.bounds.size;

    self.label = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    self.label.backgroundColor = [UIColor clearColor];
    self.label.opaque = NO;
    self.label.frame = CGRectMake(20, 30, CGRectGetWidth(self.view.bounds) - 40, 120);
    self.label.font = [UIFont serifFontWithSize:24];
    self.label.textColor = [UIColor whiteColor];
    self.label.numberOfLines = 0;
    [self.view addSubview:self.label];
    self.label.text = @"To give you better\nrecommendations we would\nlike to know a few things\nabout you.";

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wnonnull"
    CGFloat height = 230 + [self tableView:nil heightForHeaderInSection:0];
#pragma clang diagnostic pop

    self.tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, screenSize.height - height, screenSize.width, height)
                                                  style:UITableViewStylePlain];
    [self.tableView registerClass:AROnboardingTableViewCell.class forCellReuseIdentifier:@"StatusCell"];
    self.tableView.backgroundColor = [UIColor clearColor];
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.scrollEnabled = NO;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.view addSubview:self.tableView];
}


#pragma mark -
#pragma mark Table view

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"StatusCell"];
    cell.textLabel.text = @[ @"Yes, I buy art", @"Interested in starting", @"Just looking and learning" ][indexPath.row];
    return cell;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 3;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 44 + (5 * 2);
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    UILabel *header = [[UILabel alloc] initWithFrame:CGRectMake(20, 0, CGRectGetWidth(self.view.bounds) - 40, 30)];
    header.textColor = [UIColor whiteColor];
    header.font = [UIFont serifFontWithSize:24];
    header.text = @"Do you buy art?";

    UIView *wrapper = [[UIView alloc] init];
    [wrapper addSubview:header];

    CGRect frame = header.frame;
    frame.size.height += 20;
    wrapper.frame = frame;
    [wrapper addSubview:header];

    CALayer *separator = [CALayer layer];
    CGFloat height = [self tableView:tableView heightForHeaderInSection:section];
    separator.frame = CGRectMake(15, height - .5, CGRectGetWidth(self.view.bounds) - 30, .5);
    separator.backgroundColor = [UIColor artsyHeavyGrey].CGColor;
    [wrapper.layer addSublayer:separator];
    return wrapper;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return [self smallScreen] ? 50 : 75;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    ARCollectorLevel level = (ARCollectorLevel)(3 - indexPath.row);
    [self.delegate collectorLevelDone:level];
}

+ (NSString *)stringFromCollectorLevel:(enum ARCollectorLevel)level
{
    switch (level) {
        case ARCollectorLevelCollector:
            return @"collector";
        case ARCollectorLevelInterested:
            return @"interested";
        default: // Or ARCollectorLevelNo , since ARCollectorLevel starts at 1 but zero is the default value for a new User instance.
            return @"no";
    }
}

@end
