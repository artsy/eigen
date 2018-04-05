#import "EigenLikeAdminViewController.h"

#import <objc/runtime.h>
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <Emission/AREmission.h>
#import <Emission/ARGraphQLQueryPreloader.h>

NSString *const AROptionCell = @"OptionCell";
NSString *const ARLabOptionCell = @"LabOptionCell";

@interface _BlockInvoker : NSObject
@property (nonatomic, copy, nonnull) dispatch_block_t block;
@end

@implementation _BlockInvoker
- (instancetype)initWithBlock:(dispatch_block_t)block;
{
  if ((self = [super init])) {
    _block = block;
  }
  return self;
}
- (void)invoke;
{
  self.block();
}
@end

@implementation EigenLikeAdminViewController

- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selection:(dispatch_block_t)selection configuration:(CellConfigurationBlock_t)configuration;
{
  ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
    cell.textLabel.text = title;
    if (configuration) {
      configuration(cell);
    }
  }];
  
  [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
    selection();
  }];
  return cellData;
}

- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selection:(dispatch_block_t)selection
{
  return [self tappableCellDataWithTitle:title selection:selection configuration:nil];
}

- (ARCellData *)viewControllerCellDataWithTitle:(NSString *)title
                                      selection:(dispatch_block_t)selection
                                        preload:(ARAdminVCPreloadBlock)preload;
{
  return [self tappableCellDataWithTitle:title selection:selection configuration:^(UITableViewCell *cell) {
    cell.accessoryView = [UIButton buttonWithType:UIButtonTypeCustom];
    __weak UIButton *button = (id)cell.accessoryView;
    [button setImage:[UIImage imageNamed:@"UITabBarDownloadsTemplate"] forState:UIControlStateNormal];
    [button sizeToFit];
    _BlockInvoker *blockInvoker = [[_BlockInvoker alloc] initWithBlock:^{
      NSLog(@"Preload: %@", title);
      [[[AREmission sharedInstance] graphQLQueryPreloaderModule] preloadQueries:preload()];
    }];
    objc_setAssociatedObject(button, &_cmd, blockInvoker, OBJC_ASSOCIATION_RETAIN);
    [button addTarget:blockInvoker action:@selector(invoke) forControlEvents:UIControlEventTouchUpInside];
  }];
}

- (ARCellData *)informationCellDataWithTitle:(NSString *)title
  {
    ARCellData *cell = [[ARCellData alloc] initWithIdentifier:AROptionCell];
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
  ARCellData *cell = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
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
