#import "AREchoContentsViewController.h"
@import Aerodramus;
#import "Artsy-Swift.h"
#import "ARSwitchBoard.h"

enum : NSUInteger {
    Routes,
    Features,
    Messages,
    NumberOfSections
};

static NSString *CellIdentifier = @"Cell";


@interface AREchoContentsViewController ()

@property (nonatomic, strong) Aerodramus *echo;
@property (nonatomic, strong) NSArrayOf(NSString *) * routeKeys;
@property (nonatomic, strong) NSArrayOf(NSString *) * featureKeys;

@end


@implementation AREchoContentsViewController

- (instancetype)init
{
    self = [super initWithStyle:UITableViewStyleGrouped];
    if (!self) {
        return nil;
    }

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.echo = [[ARSwitchBoard sharedInstance] echo];
    self.routeKeys = self.echo.routes.allKeys;
    self.featureKeys = self.echo.features.allKeys;
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return NumberOfSections;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    switch (section) {
        case Routes:
            return self.echo.routes.count;
        case Features:
            return self.echo.features.count;
        case Messages:
            return self.echo.messages.count;
    }
    return 0;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    switch (section) {
        case Routes:
            return @"Routes";
        case Features:
            return @"Features";
        case Messages:
            return @"Messages";
    }
    return nil;
}

- (NSString *)tableView:(UITableView *)tableView titleForFooterInSection:(NSInteger)section
{
    if (section == NumberOfSections - 1) {
        return [NSString stringWithFormat:@"Last upated %@", self.echo.lastUpdatedDate];
    }
    return nil;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];

    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:CellIdentifier];
    }

    switch (indexPath.section) {
        case Routes: {
            Route *route = self.echo.routes[self.routeKeys[indexPath.row]];
            cell.textLabel.text = route.name;
            cell.detailTextLabel.text = route.path;
        } break;
        case Features: {
            Feature *feature = self.echo.features[self.featureKeys[indexPath.row]];
            cell.textLabel.text = feature.name;
            cell.detailTextLabel.text = feature.state ? @"On" : @"Off";
        } break;
        case Messages: {
            Message *message = self.echo.messages[indexPath.row];
            cell.textLabel.text = message.name;
            cell.detailTextLabel.text = message.content;
        } break;
    }

    return cell;
}
@end
