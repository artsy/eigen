#import "ARRootViewController.h"
#import "ARAnimatedTickView.h"
#import "ARTickedTableViewCell.h"
#import "ARAdminTableViewCell.h"
#import <SAMKeychain/SAMKeychain.h>

#import "AppDelegate.h"
#import "ARDefaults.h"
#import "AppSetup.h"
#import "CommitNetworkModel.h"

#import "ARRootViewController+PRs.h"

#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARInquiryComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileViewController.h>
#import <Emission/ARShowConsignmentsFlowViewController.h>

#import "ARStorybookComponentViewController.h"

#import "InternalWebViewController.h"
#import "EigenLikeNavigationController.h"
#import <ISO8601DateFormatter/ISO8601DateFormatter.h>

@implementation ARRootViewController

- (void)viewDidLoad
{
  [super viewDidLoad];

  AppSetup *setup = [AppSetup ambientSetup];

  ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
  [self registerClass:ARTickedTableViewCell.class forCellReuseIdentifier:ARLabOptionCell];
  [self registerClass:ARAdminTableViewCell.class forCellReuseIdentifier:AROptionCell];

  ARSectionData *appData = [[ARSectionData alloc] init];
  [self setupSection:appData withTitle:[self titleForApp]];
  [appData addCellData:[self emissionJSLocationDescription:setup.emissionLoadedFromString]];
  if (setup.usingMaster && !setup.usingRNP) {
    [appData addCellDataFromArray:[self cellsForMasterInformation]];
  }
  [tableViewData addSectionData:appData];

  // This isn't of any use unless you're developing
  if(!setup.usingPRBuild) {
    ARSectionData *developerSection = [self developersSection];
    [tableViewData addSectionData:developerSection];
  }

  ARSectionData *reviewSection = [self prSectionData];
  [tableViewData addSectionData:reviewSection];

  ARSectionData *userSection = [self userSection];
  [tableViewData addSectionData:userSection];

  // TODO: Deprecate
  // These were nice quick for getting bootstrapped, but they should be storybooks
  // so that they can be controlled in JS and deployed with PRs.
  ARSectionData *viewControllerSection = [self jumpToViewControllersSection];
  [tableViewData addSectionData:viewControllerSection];

  ARSectionData *adminSection = [self adminSection];
  [tableViewData addSectionData:adminSection];

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
  [sectionData addCellData:self.jumpToMyProfile];
  [sectionData addCellData:self.jumpToConsignments];
  [sectionData addCellData:self.jumpToInbox];
  [sectionData addCellData:self.jumpToInquiry];
  [sectionData addCellData:self.jumpToFavorites];

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
    id viewController = [[ARArtistComponentViewController alloc] initWithArtistID:@"marina-abramovic-1"];
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


- (ARCellData *)jumpToMyProfile
{
  return [self tappableCellDataWithTitle:@"My Profile" selection:^{
    id viewController = [[ARMyProfileViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}


- (ARCellData *)jumpToConsignments
{
  return [self tappableCellDataWithTitle:@"Start Consignment Flow" selection:^{
    [[(EigenLikeNavigationController *)self.navigationController backButton] setHidden:YES];
    id viewController = [[ARShowConsignmentsFlowViewController alloc] init];

    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:viewController];
    nav.navigationBarHidden = YES;
    [self.navigationController presentViewController:nav animated:YES completion:NULL];
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

- (ARCellData *)jumpToFavorites
{
  return [self tappableCellDataWithTitle:@"Favorites" selection:^{
    id viewController = [[ARFavoritesComponentViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];
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

- (ARCellData *)toggleRNPSwitch
{
  BOOL forceRNP = [[NSUserDefaults standardUserDefaults] boolForKey:ARForceUseRNPDefault];
  NSString *rnpLocation = [[NSUserDefaults standardUserDefaults] stringForKey:ARRNPackagerHostDefault];
  NSString *title = !forceRNP ? [NSString stringWithFormat:@"Use RNP with %@", rnpLocation] : @"Revert forced RNP";

  ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
    cell.textLabel.text = title;
  }];

  [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
    [self showAlertViewWithTitle:@"Confirm Switch" message:@"Switching forced RNP settings." actionTitle:@"Continue" actionHandler:^{

      [[NSUserDefaults standardUserDefaults] setBool:!forceRNP forKey:ARForceUseRNPDefault];
      [[NSUserDefaults standardUserDefaults] synchronize];
      exit(0);
    }];
  }];
  return crashCellData;
}

- (ARCellData *)emissionJSLocationDescription:(NSString *)loadedFromString
{
  return [self informationCellDataWithTitle:loadedFromString];
}


- (NSArray<ARCellData *> *)cellsForMasterInformation
{
  NSError *jsonError = nil;
  NSURL *metadataURL = [[CommitNetworkModel new] fileURLForLatestCommitMetadata];

  NSData *data = [NSData dataWithContentsOfURL:metadataURL];
  if(!data) { return @[]; }

  NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&jsonError];
  Metadata *metadata = [[Metadata alloc] initFromJSONDict:json];

  if (jsonError) { return @[]; }

  ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
  NSDate *lastUpdate = [dateFormatter dateFromString:[metadata date]];

  NSUInteger unitFlags = NSCalendarUnitDay;
  NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierISO8601];
  NSDateComponents *components = [calendar components:unitFlags fromDate:lastUpdate toDate:[NSDate dateWithTimeIntervalSinceNow:0] options:0];

  NSString *pr = [NSString stringWithFormat:@"PR #%@ - %@", [metadata number], [metadata title]];

  return @[
     [self informationCellDataWithTitle:[NSString stringWithFormat:@"Last Updated: %@ days ago", @([components day])]],

     [self tappableCellDataWithTitle:pr selection:^{
       NSString *addr = [NSString stringWithFormat:@"https://github.com/artsy/emission/pull/%@", metadata.number];
       NSURL *url = [NSURL URLWithString:addr];
       id viewController = [[InternalWebViewController alloc] initWithURL:url];
       [self.navigationController pushViewController:viewController animated:YES];
     }]
  ];
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
  AppSetup *setup = [AppSetup ambientSetup];
  if (setup.inStaging) {
    [sectionData addCellDataFromArray:@[
      [self editableTextCellDataWithName:@"Gravity API" defaultKey:ARStagingAPIURLDefault],
      [self editableTextCellDataWithName:@"Metaphysics API" defaultKey:ARStagingMetaphysicsURLDefault],
      [self editableTextCellDataWithName:@"RN Packager" defaultKey:ARRNPackagerHostDefault],
    ]];

  }

  [sectionData addCellData:self.toggleRNPSwitch];
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
