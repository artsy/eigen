#import "ARRootViewController.h"
#import "NSDateFormatter+TimeAgo.h"
#import "ARDefaults.h"
#import "EmissionPRChooseViewController.h"

#import <ARGenericTableViewController/ARGenericTableViewController.h>

@implementation ARRootViewController(PR)

- (ARSectionData *)prSectionData;
{
  ARSectionData *section = [[ARSectionData alloc] initWithCellDataArray:@[
    [self togglePRBuilds]
  ]];

  [self setupSection:section withTitle:@"Code Review"];
  return section;
}

- (ARCellData *)togglePRBuilds
{
  ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

  cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
    BOOL usingPR = [defaults boolForKey:ARUsePREmissionDefault];

    if (usingPR) {
      cell.textLabel.text = @"Disable PR Build";

    } else {
      cell.textLabel.text = @"Use a PR build of Emission";
    }
  };

  cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
    BOOL usingPR = [defaults boolForKey:ARUsePREmissionDefault];

    if (!usingPR) {
      // Show a PR chooser
      [self presentViewController:[EmissionPRChooseViewController new] animated:YES completion:NULL];
    } else {
      // Undo the changes and restart
      [self showAlertViewWithTitle:@"Restarting to undo PR mode" message:@"This will revert back to dev, or master based JS" actionTitle:@"Do it" actionHandler:^{
        [defaults setBool:NO forKey:ARUsePREmissionDefault];
        [defaults synchronize];

        exit(0);
      }];
    }
  };

  return cellData;
}


@end
