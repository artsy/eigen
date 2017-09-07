#import "ARRootViewController.h"
#import "ARAnimatedTickView.h"
#import "ARTickedTableViewCell.h"
#import "ARAdminTableViewCell.h"
#import <SAMKeychain/SAMKeychain.h>

#import "AppDelegate.h"
#import "ARDefaults.h"

#import "ARRootViewController+AppHub.h"
#import "ARRootViewController+PRs.h"

#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARInquiryComponentViewController.h>
#import "ARStorybookComponentViewController.h"

#import "InternalWebViewController.h"

@implementation ARRootViewController

- (void)viewDidLoad
{
  [super viewDidLoad];

  ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
  [self registerClass:ARTickedTableViewCell.class forCellReuseIdentifier:ARLabOptionCell];
  [self registerClass:ARAdminTableViewCell.class forCellReuseIdentifier:AROptionCell];

  ARSectionData *appData = [[ARSectionData alloc] init];
  [self setupSection:appData withTitle:[self titleForApp]];
  [appData addCellData:self.emissionJSLocationDescription];
  [tableViewData addSectionData:appData];

  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  BOOL usePRBuild = [defaults boolForKey:ARUsePREmissionDefault];

#if defined(DEPLOY)
  // It can get real confusing if you have AppHub running on your local
  // development environment.
  if(!usePRBuild) {
    ARSectionData *appHubSection = [self appHubSectionData];
    [tableViewData addSectionData:appHubSection];
  }
#endif

#if defined(DEBUG)
  // This isn't of any use unless you're developing
  if(!usePRBuild) {
    ARSectionData *developerSection = [self developersSection];
    [tableViewData addSectionData:developerSection];
  }
#endif

  ARSectionData *reviewSection = [self prSectionData];
  [tableViewData addSectionData:reviewSection];

  ARSectionData *userSection = [self userSection];
  [tableViewData addSectionData:userSection];

  ARSectionData *adminSection = [self adminSection];
  [tableViewData addSectionData:adminSection];

#if defined(DEBUG)
  // These were nice quick for getting bootstrapped, but they should be storybooks
  // so that they can be controlled in JS and deployed with PRs.
  ARSectionData *viewControllerSection = [self jumpToViewControllersSection];
  [tableViewData addSectionData:viewControllerSection];
#endif

  self.tableViewData = tableViewData;
}

/// Sections

- (ARSectionData *)jumpToViewControllersSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"View Controllers"];

  [sectionData addCellData:self.jumpToArtist];
  [sectionData addCellData:self.jumpToRandomArtist];
  [sectionData addCellData:self.jumpToHomepage];
  [sectionData addCellData:self.jumpToGene];
  [sectionData addCellData:self.jumpToRefinedGene];
  [sectionData addCellData:self.jumpToWorksForYou];
  [sectionData addCellData:self.jumpToConsignments];
  [sectionData addCellData:self.jumpToInbox];
  [sectionData addCellData:self.jumpToInquiry];
  
  return sectionData;
}

- (ARSectionData *)developersSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"Developer"];

  [sectionData addCellData:self.jumpToStorybooks];

  return sectionData;
}


/// Cell Data

- (ARCellData *)jumpToStorybooks
{
  return [self tappableCellDataWithTitle:@"Open Storybook" selection: ^{
    id viewController = [ARStorybookComponentViewController new];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToEndUserStorybooks
{
  return [self tappableCellDataWithTitle:@"Open Storybook Browser" selection: ^{
    id viewController = [[ARComponentViewController alloc] initWithEmission:nil moduleName:@"StorybookBrowser" initialProperties: @{}];

    [self.navigationController pushViewController:viewController animated:YES];
  }];
}


- (ARCellData *)jumpToUserDocs
{
  return [self tappableCellDataWithTitle:@"Open Emission beta Docs" selection: ^{
    NSURL *url = [NSURL URLWithString:@"https://github.com/artsy/emission/blob/master/docs/using_the_beta.md"];
    id viewController = [[InternalWebViewController alloc] initWithURL:url];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtist
{
  return [self tappableCellDataWithTitle:@"Artist" selection: ^{
    id viewController = [[ARArtistComponentViewController alloc] initWithArtistID:@"david-shrigley"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToRandomArtist
{
  NSString *sourceRoot = [NSProcessInfo processInfo].environment[@"SRCROOT"];
  NSString *artistListFromExample = @"../externals/metaphysics/schema/artist/maps/artist_title_slugs.js";
  NSString *slugsPath = [sourceRoot stringByAppendingPathComponent:artistListFromExample];

  NSFileManager *manager = [NSFileManager defaultManager];

  // Don't have the submodule? bail, it's no biggie
  if (![manager fileExistsAtPath:slugsPath]) { return nil; }

  // Otherwise lets support jumping to a random Artist
  return [self tappableCellDataWithTitle:@"Artist (random from metaphysics)" selection: ^{
    NSString *data = [NSString stringWithContentsOfFile:slugsPath encoding:NSUTF8StringEncoding error:nil];
    NSString *jsonString = [[[data
                             stringByReplacingOccurrencesOfString:@"export default" withString:@""]
                             stringByReplacingOccurrencesOfString:@"'" withString:@"\""]
                             stringByReplacingOccurrencesOfString:@",\n];" withString:@"]"];
    NSArray *artists = [NSJSONSerialization JSONObjectWithData:[jsonString dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
    u_int32_t rnd = arc4random_uniform((uint32_t)artists.count);
    id viewController = [[ARArtistComponentViewController alloc] initWithArtistID:[artists objectAtIndex:rnd]];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToHomepage
{
  return [self tappableCellDataWithTitle:@"Homepage" selection: ^{
    id viewController = [[ARHomeComponentViewController alloc] initWithEmission:nil];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToGene
{
  return [self tappableCellDataWithTitle:@"Gene" selection: ^{
    id viewController = [[ARGeneComponentViewController alloc] initWithGeneID:@"website"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToRefinedGene
{
  // From: https://github.com/artsy/metaphysics/blob/master/schema/home/add_generic_genes.js
  return [self tappableCellDataWithTitle:@"Gene Refined" selection: ^{
    id viewController = [[ARGeneComponentViewController alloc] initWithGeneID:@"emerging-art" refineSettings:@{ @"medium": @"painting", @"price_range": @"50.00-10000.00" }];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToWorksForYou
{
  return [self tappableCellDataWithTitle:@"Works For You" selection:^{
    id viewController = [[ARWorksForYouComponentViewController alloc] initWithSelectedArtist:nil];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToConsignments
{
  return [self tappableCellDataWithTitle:@"Start Consignment Flow" selection:^{
    id viewController = [[ARComponentViewController alloc] initWithEmission: nil moduleName:@"Consignments" initialProperties: @{}];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToInbox
{
  return [self tappableCellDataWithTitle:@"Inbox" selection:^{
    id viewController = [[ARInboxComponentViewController alloc] initWithInbox];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToInquiry
{
  return [self tappableCellDataWithTitle:@"Inquiry" selection: ^{
    id viewController = [[ARInquiryComponentViewController alloc] initWithArtworkID:@"damien-hirst-for-the-love-of-god-lenticular-6"];
    [self.navigationController presentViewController:viewController animated:YES completion:nil];
  }];
}


- (ARCellData *)generateStagingSwitch
{
  BOOL useStaging = [[NSUserDefaults standardUserDefaults] boolForKey:ARUseStagingDefault];
  NSString *title = [NSString stringWithFormat:@"Switch to %@ (Resets)", useStaging ? @"Production" : @"Staging"];

  ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
    cell.textLabel.text = title;
  }];

  [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
    [self showAlertViewWithTitle:@"Confirm Switch" message:@"Switching servers may log you out. App will exit. Please re-open to log back in." actionTitle:@"Continue" actionHandler:^{

      [[NSUserDefaults standardUserDefaults] setBool:!useStaging forKey:ARUseStagingDefault];
      [[NSUserDefaults standardUserDefaults] synchronize];
      exit(0);
    }];
  }];
  return crashCellData;
}

- (ARCellData *)emissionJSLocationDescription
{
  AppDelegate *appDelegate = (id)[UIApplication sharedApplication].delegate;

  ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
    cell.textLabel.text = [appDelegate emissionLoadedFromString];
  }];

  return crashCellData;
}

- (ARSectionData *)userSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"User"];

  [sectionData addCellData:self.jumpToEndUserStorybooks];
#if defined(DEPLOY)
  [sectionData addCellData:self.jumpToUserDocs];
#endif
  return sectionData;
}

- (ARSectionData *)adminSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"Admin"];
  [sectionData addCellData:self.generateStagingSwitch];
  [sectionData addCellData:self.logOutButton];
  return sectionData;
}

- (ARCellData *)logOutButton
{
  return [self tappableCellDataWithTitle:@"Log Out" selection:^{
    [self showAlertViewWithTitle:@"Confirm Log Out" message:@"" actionTitle:@"Continue" actionHandler:^{

      [self.authenticationManager logOut];
      exit(0);
    }];
  }];
}


@end
