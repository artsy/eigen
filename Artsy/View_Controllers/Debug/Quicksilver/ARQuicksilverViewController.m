#import "ARQuicksilverViewController.h"
#import "ARContentViewControllers.h"
#import "SearchResult.h"
#import "ARSearchTableViewCell.h"
#import "ARFileUtils.h"


@interface ARQuicksilverViewController ()

@property (nonatomic, assign, readwrite) NSInteger selectedIndex;
@property (nonatomic, copy, readwrite) NSArray *searchResults;
@property (nonatomic, copy, readonly) NSArray *resultsHistory;
@property (nonatomic, strong, readonly) AFJSONRequestOperation *searchRequest;

@end


@implementation ARQuicksilverViewController

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesBackButton
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
    NSData *data = [NSData dataWithContentsOfFile:path];
    _resultsHistory = [NSKeyedUnarchiver unarchiveObjectWithData:data];

    if (!self.resultsHistory) {
        _resultsHistory = @[];
    }
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self.searchDisplayController.searchResultsTableView reloadData];
    [self.searchBar becomeFirstResponder];

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
    UITableViewCell *cell = [self.searchDisplayController.searchResultsTableView cellForRowAtIndexPath:path];

    UIColor *background = highlight ? [UIColor darkGrayColor] : [UIColor blackColor];
    [cell setBackgroundColor:background];
}

- (void)searchBarReturnPressed:(ARQuicksilverSearchBar *)searchBar
{
    [searchBar resignFirstResponder];

    if ([searchBar.text hasPrefix:@"/"]) {
        id controller = [ARSwitchBoard.sharedInstance loadPath:searchBar.text];
        [self.navigationController pushViewController:controller animated:YES];
        return;
    }

    UITableView *tableView = self.searchDisplayController.searchResultsTableView;
    NSIndexPath *path = [NSIndexPath indexPathForRow:self.selectedIndex inSection:0];
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:path];
    [cell setBackgroundColor:[UIColor grayColor]];

    [self tableView:tableView didSelectRowAtIndexPath:path];
}

- (NSInteger)tableView:(UITableView *)aTableView numberOfRowsInSection:(NSInteger)section
{
    return self.contentArray.count;
}

- (void)searchDisplayControllerDidBeginSearch:(UISearchDisplayController *)controller
{
    controller.searchResultsTableView.hidden = NO;
}

- (void)searchDisplayController:(UISearchDisplayController *)controller didHideSearchResultsTableView:(UITableView *)tableView
{
    // We need to prevent the resultsTable from hiding if the search is still active
    if (self.searchDisplayController.active == YES) {
        tableView.hidden = NO;
    }
}

- (void)searchDisplayController:(UISearchDisplayController *)controller didLoadSearchResultsTableView:(UITableView *)tableView
{
    [controller.searchResultsTableView registerClass:[ARSearchTableViewCell class] forCellReuseIdentifier:@"SearchCell"];
    tableView.backgroundColor = [UIColor blackColor];
}

- (BOOL)searchDisplayController:(UISearchDisplayController *)controller shouldReloadTableForSearchString:(NSString *)query
{
    if (self.searchRequest) {
        [self.searchRequest cancel];
    }

    if (query.length == 0) {
        self.searchResults = nil;
        [controller.searchResultsTableView reloadData];

    } else {
        [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];

        @weakify(self);
        _searchRequest = [ArtsyAPI searchWithQuery:query success:^(NSArray *results) {
            @strongify(self);
            self.searchResults = [results copy];
            self.selectedIndex = 0;

            [controller.searchResultsTableView reloadData];
            [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            [self setHighlight:YES forCellAtIndex:0];

        } failure:^(NSError *error) {
            if (error.code != NSURLErrorCancelled) {
                [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
            }
        }];
    }

    return NO;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"SearchCell"];
    SearchResult *result = self.contentArray[indexPath.row];

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

    @weakify(cell);
    [cell.imageView setImageWithURLRequest:result.imageRequest placeholderImage:placeholder

                                   success:^(NSURLRequest *request, NSHTTPURLResponse *response, UIImage *image) {
         @strongify(cell);
         cell.imageView.image = image;
         [cell layoutSubviews];

                                   }
                                   failure:nil];

    return cell;
}

- (NSArray *)contentArray
{
    return (self.searchBar.text.length == 0) ? self.resultsHistory : self.searchResults;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    SearchResult *result = self.contentArray[indexPath.row];
    _resultsHistory = [self.resultsHistory arrayByAddingObject:result];

    NSString *path = [ARFileUtils appDocumentsPathWithFolder:@"dev" filename:@"quicksilver_history"];
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:self.resultsHistory];
    [data writeToFile:path atomically:YES];

    UIViewController *controller = nil;

    if (result.model == [Artwork class]) {
        controller = [[ARArtworkSetViewController alloc] initWithArtworkID:result.modelID];

    } else if (result.model == [Artist class]) {
        controller = [[ARArtistViewController alloc] initWithArtistID:result.modelID];

    } else if (result.model == [Gene class]) {
        controller = [[ARGeneViewController alloc] initWithGeneID:result.modelID];

    } else if (result.model == [Profile class]) {
        controller = [ARSwitchBoard.sharedInstance routeProfileWithID:result.modelID];

    } else if (result.model == [SiteFeature class]) {
        NSString *path = NSStringWithFormat(@"/feature/%@", result.modelID);
        controller = [[ARSwitchBoard sharedInstance] loadPath:path];
    }

    [self.navigationController pushViewController:controller animated:YES];
}

@end
