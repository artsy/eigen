#import "ARAdminTableViewController.h"

#import "ARAdminTableViewCell.h"
#import "ARTickedTableViewCell.h"

#import "ARFonts.h"

NSString *const AROptionCell = @"OptionCell";
NSString *const ARLabOptionCell = @"LabOptionCell";
NSString *const ARReadOnlyOptionCell = @"ARReadOnlyOptionCell";
NSString *const ARTwoLabelCell = @"ARTwoLabelCell";
admin
@implementation ARAdminTableViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self registerClass:[ARTickedTableViewCell class] forCellReuseIdentifier:ARLabOptionCell];
    [self registerClass:[ARAdminTableViewCell class] forCellReuseIdentifier:AROptionCell];
    [self registerClass:[ARAdminTableViewCell class] forCellReuseIdentifier:ARReadOnlyOptionCell];
    [self registerClass:[ARAdminTableViewCell class] forCellReuseIdentifier:ARTwoLabelCell];

    UIView *header = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 320, 60)];
    self.tableView.tableHeaderView = header;
}

- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selection:(dispatch_block_t)selection
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = title;
    }];

    [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        selection();
    }];
    return cellData;
}


- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selectionWithCell:(void (^)(UITableViewCell *cell))selection
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = title;
    }];

    [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
        selection(cell);
    }];
    return cellData;
}


- (ARCellData *)informationCellDataWithTitle:(NSString *)title
{
    ARCellData *cell = [[ARCellData alloc] initWithIdentifier:ARReadOnlyOptionCell];
    [cell setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = title;
        cell.textLabel.textColor = [UIColor grayColor];
    }];

    return cell;
}

- (NSString *)titleForApp
{
    NSDictionary *metadata = [[NSBundle mainBundle] infoDictionary];
    NSString *build = [metadata objectForKey:@"CFBundleVersion"];
    return [NSString stringWithFormat:@"Emission build %@", build];
}

- (void)setupSection:(ARSectionData *)section withTitle:(NSString *)title
{
    UIView *wrapper = [UIView new];
    wrapper.backgroundColor = [UIColor colorWithWhite:0.95 alpha:1];

    UILabel *label = [UILabel new];
    label.font = [UIFont sansSerifFontWithSize:14];
    label.text = title.uppercaseString;
    label.frame = CGRectMake(15, 4, 400, 20);

    [wrapper addSubview:label];

    section.headerView = wrapper;
    section.headerHeight = 28;
}

- (void)showAlertViewWithTitle:(NSString *)title message:(NSString *)message actionTitle:(NSString *)actionTitle actionHandler:(void (^)(void))handler
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];

    UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:actionTitle style:UIAlertActionStyleDestructive handler:^(UIAlertAction *action) {
        handler();
    }];

    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:nil];

    [alert addAction:defaultAction];
    [alert addAction:cancelAction];
    [self presentViewController:alert animated:YES completion:nil];
}

- (ARCellData *)editableTextCellDataWithName:(NSString *)name defaultKey:(NSString *)key
{
    ARCellData *cell = [[ARCellData alloc] initWithIdentifier:ARTwoLabelCell];
    cell.height = 60;

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *value = [defaults stringForKey:key];

    [cell setCellConfigurationBlock:^(UITableViewCell *tableViewCell) {
        tableViewCell.textLabel.text = [NSString stringWithFormat:@"%@:", name];
        tableViewCell.detailTextLabel.text = value;
    }];

    [cell setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        UIAlertController *controller = [UIAlertController alertControllerWithTitle:name message:@"" preferredStyle:UIAlertControllerStyleAlert];

        [controller addAction:[UIAlertAction actionWithTitle:@"Save + Restart" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            UITextField *theTextField = [controller textFields].firstObject;
            [defaults setObject:theTextField.text forKey:key];
            [defaults synchronize];
            exit(0);
        }]];

        [controller addAction:[UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
        }]];

        [controller addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.text = value;
        }];

        [self presentViewController:controller animated:YES completion:nil];
    }];
    return cell;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    // http://stackoverflow.com/questions/18924589/uitableviewcell-separator-disappearing-in-ios7

    // Due to a weird apple bug we need to do something to
    // trigger the lines between cells.
    UIView *emptyView_ = [[UIView alloc] initWithFrame:CGRectZero];
    emptyView_.backgroundColor = [UIColor clearColor];
    [self.tableView setTableFooterView:emptyView_];
}


@end
