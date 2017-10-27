#import "EmissionPRChooseViewController.h"
#import "ARDefaults.h"
#import "ARTickedTableViewCell.h"
#import "PRNetworkModel.h"

@implementation EmissionPRChooseViewController

- (void)viewDidLoad
{
  [super viewDidLoad];

  PRNetworkModel *network = [PRNetworkModel new];

  [network getPRs:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if(error) {
      NSLog(@"Error: %@", error.localizedDescription);
      return;
    }

    NSArray *prs = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    ARSectionData *section = [[ARSectionData alloc] init];
    [self setupSection:section withTitle:@"Code Review"];

    for (NSDictionary *pr in prs) {
      [section addCellData:[self sectionForPR:pr]];
    }

    dispatch_async(dispatch_get_main_queue(), ^{
      ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
      [self registerClass:ARTickedTableViewCell.class forCellReuseIdentifier:ARLabOptionCell];
      [tableViewData addSectionData:section];
      [tableViewData addSectionData:self.sectionForGoingBack];
      self.tableViewData = tableViewData;
      [self.tableView reloadData];
    });
  }];
}

- (ARCellData *)sectionForPR:(NSDictionary *)pr
{
  ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
  PRNetworkModel *network = [PRNetworkModel new];

  cellData.cellConfigurationBlock = ^(ARTickedTableViewCell *cell) {
    cell.textLabel.text = [NSString stringWithFormat:@"#%@ - %@", pr[@"number"], pr[@"title"]];
    [cell.textLabel setAlpha:0.5];
    
    [network verifyJSAtPRNumber:[pr[@"number"] intValue] completion:^(BOOL exists) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [cell.textLabel setAlpha:exists ? 1 : 0.5];
        [cell setTickSelected:exists animated:YES];
      });
    }];
  };

  cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setBool:YES forKey:ARUsePREmissionDefault];
    [defaults setInteger:[pr[@"number"] intValue] forKey:ARPREmissionIDDefault];
    [defaults synchronize];

    NSString *message = [NSString stringWithFormat:@"Converting to use: %@", pr[@"number"]];
    [self showAlertViewWithTitle:message message:@"This will show a spinner on every app load as it gets the newest JS" actionTitle:@"Restart" actionHandler:^{
      exit(0);
    }];
  };

  return cellData;
}

- (ARSectionData *)sectionForGoingBack
{
  ARSectionData *exitSection = [[ARSectionData alloc] init];
  [self setupSection:exitSection withTitle:@"Exit"];

  ARCellData *exitData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
  exitData.cellConfigurationBlock = ^(UITableViewCell *cell) {
    cell.textLabel.text = @"Go back";
  };

  exitData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
  };

  [exitSection addCellData:exitData];
  return exitSection;
}
@end
