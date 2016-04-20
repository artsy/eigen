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

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//- (void)setSearchResults:(NSArray *)searchResults
//{
//    _searchResults = searchResults;
//    [self.tableView reloadData];
//}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.searchResults.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"OnboardingSearchCell"];

    Artist *artist = self.searchResults[indexPath.row];
    cell.title.text = artist.name;

    //    cell.title.text = @"Glorious Artist";
    cell.follow.image = [UIImage imageNamed:@"FollowCheckmark"];
    cell.thumbnail.image = [UIImage imageWithData:[NSData dataWithContentsOfURL:artist.squareImageURL]];
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 74;
}


@end
