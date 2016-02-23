#import "ARQuicksilverViewController.h"

#import "Artist.h"
#import "Artwork.h"
#import "ArtsyAPI+Search.h"
#import "ARContentViewControllers.h"
#import "Gene.h"
#import "SearchResult.h"
#import "ARSearchTableViewCell.h"
#import "ARFileUtils.h"
#import "ARFonts.h"
#import "Profile.h"
#import "SiteFeature.h"
#import "ARSwitchBoard+Eigen.h"

#import <AFNetworking/UIImageView+AFNetworking.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>


@interface ARQuicksilverViewController () <ARMenuAwareViewController, UISearchControllerDelegate, UISearchBarDelegate, UITableViewDataSource, UITableViewDelegate, UISearchResultsUpdating>

@property (nonatomic, assign, readwrite) NSInteger selectedIndex;
@property (nonatomic, copy, readwrite) NSArray *searchResults;
@property (nonatomic, copy, readwrite) NSArray *resultsHistory;
@property (nonatomic, strong, readonly) AFHTTPRequestOperation *searchRequest;
@property (strong, nonatomic) UISearchController *searchController;

@end


@implementation ARQuicksilverViewController

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesNavigationButtons
{
    return YES;
}

- (BOOL)hidesToolbarMenu
{
    return YES;
}

#pragma mark - UIViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSString *path = [ARFileUtils appDocumentsPathWithFolder:@"dev" filename:@"quicksilver_history"];
    if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
        NSData *data = [NSData dataWithContentsOfFile:path];
        self.resultsHistory = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    } else {
        self.resultsHistory = @[];
    }

    self.searchController = [[UISearchController alloc] initWithSearchResultsController:nil];
    self.searchController.searchResultsUpdater = self;
    self.searchController.dimsBackgroundDuringPresentation = NO;
    self.searchController.searchBar.delegate = self;
    self.tableView.tableHeaderView = self.searchController.searchBar;

    self.tableView.dataSource = self;
    self.tableView.delegate = self;

    [self.tableView registerClass:[ARSearchTableViewCell class] forCellReuseIdentifier:@"SearchCell"];
    self.tableView.backgroundColor = [UIColor blackColor];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    [self presentViewController:self.searchController animated:NO completion:nil];
    [self.searchController.searchBar becomeFirstResponder];

    [self setHighlight:YES forCellAtIndex:self.selectedIndex];
}

- (void)searchBarDownPressed:(ARQuicksilverSearchBar *)searchBar
{
    [self setHighlight:NO forCellAtIndex:self.selectedIndex];

    NSInteger nextIndex = self.selectedIndex + 1;
    self.selectedIndex = MIN(nextIndex, self.contentArray.count);

    [self setHighlight:YES forCellAtIndex:self.selectedIndex];
}

- (void)searchBarUpPressed:(ARQuicksilverSearchBar *)searchBar
{
    [self setHighlight:NO forCellAtIndex:self.selectedIndex];

    NSInteger nextIndex = self.selectedIndex - 1;
    self.selectedIndex = MAX(0, nextIndex);

    [self setHighlight:YES forCellAtIndex:self.selectedIndex];
}

- (void)searchBarEscapePressed:(ARQuicksilverSearchBar *)searchBar
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)setHighlight:(BOOL)highlight forCellAtIndex:(NSInteger)index
{
    NSIndexPath *path = [NSIndexPath indexPathForRow:index inSection:0];
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:path];

    UIColor *background = highlight ? [UIColor darkGrayColor] : [UIColor blackColor];
    [cell setBackgroundColor:background];
}

- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar
{
    [self.presentedViewController dismissViewControllerAnimated:YES completion:nil];
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
    if ([searchBar.text hasPrefix:@"/"]) {
        [self.presentedViewController dismissViewControllerAnimated:NO completion:nil];
        [self addObjectToRecents:searchBar.text];
        id controller = [ARSwitchBoard.sharedInstance loadPath:searchBar.text];
        [self.navigationController pushViewController:controller animated:YES];
        return;
    }

    NSIndexPath *path = [NSIndexPath indexPathForRow:self.selectedIndex inSection:0];
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:path];
    [cell setBackgroundColor:[UIColor grayColor]];

    [self tableView:self.tableView didSelectRowAtIndexPath:path];
}

- (NSInteger)tableView:(UITableView *)aTableView numberOfRowsInSection:(NSInteger)section
{
    return self.contentArray.count;
}

- (void)updateSearchResultsForSearchController:(UISearchController *)searchController
{
    NSString *query = searchController.searchBar.text;
    if (self.searchRequest) {
        [self.searchRequest cancel];
    }

    if (query.length == 0) {
        self.searchResults = nil;
        [self.tableView reloadData];

    } else {
        [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];

        __weak typeof(self) wself = self;
        _searchRequest = [ArtsyAPI searchWithQuery:query success:^(NSArray *results) {
            __strong typeof (wself) sself = wself;
            sself.searchResults = [results copy];
            sself.selectedIndex = 0;

            [self.tableView reloadData];
            [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            [sself setHighlight:YES forCellAtIndex:0];
            [self.tableView reloadData];

        } failure:^(NSError *error) {
            if (error.code != NSURLErrorCancelled) {
                [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            }
        }];
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"SearchCell"];
    SearchResult *result = self.contentArray[indexPath.row];

    if ([result isKindOfClass:NSString.class]) {
        cell.textLabel.text = (id)result;
        cell.imageView.image = nil;
        return cell;
    }

    BOOL published = result.isPublished.boolValue;
    if (!published) {
        cell.textLabel.text = [result.displayText stringByAppendingString:@" (unpublished)"];
        cell.textLabel.textColor = [UIColor artsyLightGrey];
    } else {
        cell.textLabel.text = result.displayText;
        cell.textLabel.textColor = [UIColor whiteColor];
    }
    cell.backgroundColor = [UIColor blackColor];

    UIImage *placeholder = [UIImage imageNamed:@"SearchThumb_LightGray"];


    __weak typeof(cell) wcell = cell;
    [cell.imageView setImageWithURLRequest:result.imageRequest placeholderImage:placeholder

                                   success:^(NSURLRequest *request, NSHTTPURLResponse *response, UIImage *image) {
        __weak typeof (wcell) cell = wcell;
         cell.imageView.image = image;
         [cell layoutSubviews];

                                   }
                                   failure:nil];

    return cell;
}

- (NSArray *)contentArray
{
    return (self.searchController.searchBar.text.length == 0) ? self.resultsHistory : self.searchResults;
}

- (void)addObjectToRecents:(id)object
{
    NSMutableArray *mutableArray = [self.resultsHistory mutableCopy];
    [mutableArray removeObject:object];
    [mutableArray insertObject:object atIndex:0];

    self.resultsHistory = mutableArray.copy;

    NSString *path = [ARFileUtils appDocumentsPathWithFolder:@"dev" filename:@"quicksilver_history"];
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:self.resultsHistory];
    [data writeToFile:path atomically:YES];

    [self.tableView reloadData];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self.presentedViewController dismissViewControllerAnimated:NO completion:nil];

    SearchResult *result = self.contentArray[indexPath.row];
    [self addObjectToRecents:result];

    UIViewController *controller = nil;

    if ([result isKindOfClass:NSString.class]) {
        controller = [ARSwitchBoard.sharedInstance loadPath:(id)result];

    } else if (result.model == [Artwork class]) {
        controller = [[ARArtworkSetViewController alloc] initWithArtworkID:result.modelID];

    } else if (result.model == [Artist class]) {
        controller = [[ARArtistViewController alloc] initWithArtistID:result.modelID];

    } else if (result.model == [Gene class]) {
        controller = [[ARGeneViewController alloc] initWithGeneID:result.modelID];

    } else if (result.model == [Profile class]) {
        controller = [ARSwitchBoard.sharedInstance routeProfileWithID:result.modelID];

    } else if (result.model == [SiteFeature class]) {
        NSString *path = NSStringWithFormat(@"/feature/%@", result.modelID);
        controller = [ARSwitchBoard.sharedInstance loadPath:path];
    }

    [self.navigationController pushViewController:controller animated:YES];
}

@end
