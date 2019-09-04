#import "ARRootViewController.h"
#import "ARAnimatedTickView.h"
#import "ARTickedTableViewCell.h"
#import "ARAdminTableViewCell.h"
#import "ARAdminPreloadTableViewCell.h"
#import "EigenLikeNavigationController.h"
#import <SAMKeychain/SAMKeychain.h>

#import "AppDelegate.h"
#import "ARDefaults.h"
#import "AppSetup.h"
#import "CommitNetworkModel.h"
#import "ARLabOptions.h"

#import "ARRootViewController+PRs.h"

#import <Emission/AREmission.h>
#import <Emission/ARGraphQLQueryCache.h>

#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARArtworkComponentViewController.h>
#import <Emission/ARArtworkAttributionClassFAQViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARComponentViewController.h>
#import <Emission/ARCollectionComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARInquiryComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileViewController.h>
#import <Emission/ARShowConsignmentsFlowViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/ARFairComponentViewController.h>
#import <Emission/ARShowComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>

#import "ARStorybookComponentViewController.h"

#import "InternalWebViewController.h"
#import "EigenLikeNavigationController.h"
#import <ISO8601DateFormatter/ISO8601DateFormatter.h>
#import "ARAdminSentryBreadcrumbViewController.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImageManager.h>

@implementation ARRootViewController

- (void)viewDidLoad
{
  [super viewDidLoad];

  AppSetup *setup = [AppSetup ambientSetup];

  ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
  [self registerClass:ARTickedTableViewCell.class forCellReuseIdentifier:ARLabOptionCell];
  [self registerClass:ARAdminTableViewCell.class forCellReuseIdentifier:ARSubtitledLabOptionCell];
  [self registerClass:ARAdminTableViewCell.class forCellReuseIdentifier:AROptionCell];
  [self registerClass:ARAdminPreloadTableViewCell.class forCellReuseIdentifier:ARPreloadOptionCell];

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

  ARSectionData *labsSection = [self labsSection];
  [tableViewData addSectionData:labsSection];

  // TODO: Deprecate
  // These were nice quick for getting bootstrapped, but they should be storybooks
  // so that they can be controlled in JS and deployed with PRs.
  ARSectionData *viewControllerSection = [self jumpToViewControllersSection];
  [tableViewData addSectionData:viewControllerSection];

  ARSectionData *adminSection = [self adminSection];
  [tableViewData addSectionData:adminSection];

  self.tableViewData = tableViewData;
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    BOOL autoJump = [[NSUserDefaults standardUserDefaults] boolForKey:ARJumpStraightIntoStorybooks];
    if (autoJump) {
      id viewController = [ARStorybookComponentViewController new];
      [self.navigationController pushViewController:viewController animated:YES];
    }
  });
}

/// Sections

- (ARSectionData *)jumpToViewControllersSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"View Controllers"];

  [sectionData addCellData:self.jumpToShow];
  [sectionData addCellData:self.jumpToFair];
  [sectionData addCellData:self.jumpToMap];
  [sectionData addCellData:self.jumpToCollection];
  [sectionData addCellData:self.jumpToArtwork];
  [sectionData addCellData:self.jumpToArtworkWithInquireable];
  [sectionData addCellData:self.jumpToArtworkWithBNMO];
  [sectionData addCellData:self.jumpToArtworkWithBNMOWithEdition];
  [sectionData addCellData:self.jumpToArtworkInAuction];
  [sectionData addCellData:self.jumpToArtworkWithMultipleImages];
  [sectionData addCellData:self.jumpToArtworkWithInstitutionPartner];
  [sectionData addCellData:self.jumpToArtworkAttributionClassFAQ];
  [sectionData addCellData:self.jumpToArtist];
  [sectionData addCellData:self.jumpToRandomArtist];
  [sectionData addCellData:self.jumpToHomepage];
  [sectionData addCellData:self.jumpToGene];
  [sectionData addCellData:self.jumpToRefinedGene];
  [sectionData addCellData:self.jumpToMyProfile];
  [sectionData addCellData:self.jumpToConsignments];
  [sectionData addCellData:self.jumpToInbox];
  [sectionData addCellData:self.jumpToInquiry];
  [sectionData addCellData:self.jumpToFavorites];
  [sectionData addCellData:self.jumpToBidFlow];

  return sectionData;
}

- (ARSectionData *)developersSection
{
  ARSectionData *sectionData = [[ARSectionData alloc] init];
  [self setupSection:sectionData withTitle:@"Developer"];

  [sectionData addCellData:self.jumpToStorybooks];
  [sectionData addCellData:self.autoOpenStorybooksOnLaunch];

  return sectionData;
}

- (ARSectionData *)labsSection
{
  ARSectionData *labsSectionData = [[ARSectionData alloc] init];
  labsSectionData.headerTitle = @"Labs";

  NSArray *options = [ARLabOptions labsOptions];
  for (NSInteger index = 0; index < options.count; index++) {
    NSString *key = options[index];
    NSString *title = [ARLabOptions descriptionForOption:key];
    BOOL requiresRestart = [[ARLabOptions labsOptionsThatRequireRestart] indexOfObject:title] != NSNotFound;

    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
    [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
      cell.textLabel.text = requiresRestart ? [title stringByAppendingString:@" (restarts)"] : title;
      cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[ARLabOptions boolForOption:key]];
    }];

    [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
      BOOL currentSelection = [ARLabOptions boolForOption:key];
      [ARLabOptions setBool:!currentSelection forOption:key];

      if (requiresRestart) {
        // Show checkmark.
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
          exit(0);
        });
      } else {
        AppDelegate *appDelegate = (id)[UIApplication sharedApplication].delegate;
        [appDelegate reloadEmission];
      }

      UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
      [(ARAnimatedTickView *)cell.accessoryView setSelected:!currentSelection animated:YES];
    }];

    [labsSectionData addCellData:cellData];
  }
  return labsSectionData;
}

- (ARCellData *)jumpToStorybooks
{
  return [self tappableCellDataWithTitle:@"Open Storybook" selection: ^{
    id viewController = [ARStorybookComponentViewController new];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)autoOpenStorybooksOnLaunch
{
  BOOL autoJump = [[NSUserDefaults standardUserDefaults] boolForKey:ARJumpStraightIntoStorybooks];
  NSString *title = autoJump ? @"Stop auto-jumping into Storybooks" : @"Jump into Storybooks on launch";

  ARCellData *autoSwitchCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
  [autoSwitchCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
    cell.textLabel.text = title;
    cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:autoJump];
  }];

  [autoSwitchCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:!autoJump];

    [self showAlertViewWithTitle:@"Confirm Switch" message:@"Switching auto-storybooks." actionTitle:@"Do it" actionHandler:^{
      [[NSUserDefaults standardUserDefaults] setBool:!autoJump forKey:ARJumpStraightIntoStorybooks];
      [[NSUserDefaults standardUserDefaults] synchronize];
      exit(0);
    }];
  }];

  return autoSwitchCellData;
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

- (ARCellData *)jumpToArtwork
{
  return [self tappableCellDataWithTitle:@"Artwork" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"candice-cmc-superman-donuts-1"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtworkWithBNMO
{
  return [self tappableCellDataWithTitle:@"Artwork With BNMO" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"josh-reames-columbo-ii"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtworkWithBNMOWithEdition
{
  return [self tappableCellDataWithTitle:@"Artwork With BNMO Edition Sets" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"terry-oneill-faye-dunaway-the-beverly-hills-hilton-los-angeles-the-morning-after-her-network-oscar-1"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtworkWithInquireable
{
  return [self tappableCellDataWithTitle:@"Artwork With Inquireable" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"ryan-hewett-la-femme-iv"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtworkInAuction
{
  return [self tappableCellDataWithTitle:@"Artwork In Auction" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"matthew-darbyshire-ennui"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}


- (ARCellData *)jumpToArtworkWithMultipleImages
{
  return [self tappableCellDataWithTitle:@"Artwork With Multiple Images" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"francis-bacon-study-after-velazquez"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtworkWithInstitutionPartner
{
  return [self tappableCellDataWithTitle:@"Artwork With Institution Partner" selection:^{
    id viewController = [[ARArtworkComponentViewController alloc] initWithArtworkID:@"jean-leon-gerome-the-guard"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}


- (ARCellData *)jumpToArtworkAttributionClassFAQ
{
  return [self tappableCellDataWithTitle:@"Artwork Attribution Class FAQ" selection:^{
    id viewController = [[ARArtworkAttributionClassFAQViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToArtist
{
  NSString *artistID = @"andy-warhol";
  return [self viewControllerCellDataWithTitle:@"Artist"
                                     selection:^{
    id viewController = [[ARArtistComponentViewController alloc] initWithArtistID:artistID];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARArtistComponentViewController preloadQueriesWithArtistID:artistID];
  }];
}

- (ARCellData *)jumpToCollection
{
  return [self viewControllerCellDataWithTitle:@"Collection"
                                     selection:^{
                                       id viewController = [[ARCollectionComponentViewController alloc] initWithCollectionID:@"street-art-now"];
                                       [self.navigationController pushViewController:viewController animated:YES];
                                     }
                                       preload:nil];
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
  return [self viewControllerCellDataWithTitle:@"Homepage"
                                     selection:^{
    id viewController = [[ARHomeComponentViewController alloc] initWithSelectedArtist:nil tab:ARHomeTabArtists emission:nil];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARHomeComponentViewController preloadQueriesWithSelectedArtist:nil tab:ARHomeTabArtists];
  }];
}

- (ARCellData *)jumpToGene
{
  NSString *geneID = @"minimalism";
  return [self viewControllerCellDataWithTitle:@"Gene"
                                     selection:^{
    id viewController = [[ARGeneComponentViewController alloc] initWithGeneID:geneID];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARGeneComponentViewController preloadQueriesWithGeneID:geneID refineSettings:@{}];
  }];
}

- (ARCellData *)jumpToRefinedGene
{
  // From: https://github.com/artsy/metaphysics/blob/master/schema/home/add_generic_genes.js
  NSString *geneID = @"emerging-art";
  NSDictionary *refineSettings = @{ @"medium": @"painting", @"price_range": @"50.00-10000.00" };
  return [self viewControllerCellDataWithTitle:@"Gene Refined"
                                     selection:^{
    id viewController = [[ARGeneComponentViewController alloc] initWithGeneID:geneID refineSettings:refineSettings];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARGeneComponentViewController preloadQueriesWithGeneID:geneID refineSettings:refineSettings];
  }];
}

- (ARCellData *)jumpToMyProfile
{
  return [self viewControllerCellDataWithTitle:@"My Profile"
                                     selection:^{
    id viewController = [[ARMyProfileViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARMyProfileViewController preloadQueries];
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
  return [self viewControllerCellDataWithTitle:@"Inbox"
                                     selection:^{
    id viewController = [[ARInboxComponentViewController alloc] initWithInbox];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARInboxComponentViewController preloadQueries];
  }];
}

- (ARCellData *)jumpToInquiry
{
  return [self tappableCellDataWithTitle:@"Inquiry" selection: ^{
    id viewController = [[ARInquiryComponentViewController alloc] initWithArtworkID:@"damien-hirst-analgesics"];
    [self.navigationController presentViewController:viewController animated:YES completion:nil];
  }];
}

- (ARCellData *)jumpToFavorites
{
  return [self viewControllerCellDataWithTitle:@"Favorites"
                                     selection:^{
    id viewController = [[ARFavoritesComponentViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];
  }
                                       preload:^NSArray<ARGraphQLQuery *> *{
    return [ARFavoritesComponentViewController preloadQueries];
  }];
}

- (ARCellData *)jumpToShow
{
  return [self tappableCellDataWithTitle:@"Show" selection:^{
    id viewController = [[ARShowComponentViewController alloc] initWithShowID:@"harlan-levey-projects-recreational-painting"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToFair
{
  return [self tappableCellDataWithTitle:@"Fair" selection:^{
    id viewController = [[ARFairComponentViewController alloc] initWithFairID:@"the-art-show-2019"];
    [self.navigationController pushViewController:viewController animated:YES];
  }];
}

- (ARCellData *)jumpToMap
{
  return [self tappableCellDataWithTitle:@"Map" selection:^{
    id viewController = [[ARMapContainerViewController alloc] init];
    [self.navigationController pushViewController:viewController animated:YES];

  }];
}

- (ARCellData *)jumpToBidFlow
{
  NSString *artworkID = @"david-hockney-pool-made-with-paper-and-blue-ink-for-book-from-paper-pools-2";
  NSString *saleID = @"phillips-summer-school-1";
  return [self viewControllerCellDataWithTitle:@"Bid Flow" selection: ^{
    ARBidFlowViewController *bidFlowController = [[ARBidFlowViewController alloc] initWithArtworkID:artworkID saleID:saleID];
    EigenLikeNavigationController *navigationController = [[EigenLikeNavigationController alloc] initWithRootViewController:bidFlowController];
    navigationController.showBackButtonOnRoot = YES;
    [self presentViewController:navigationController animated:YES completion:nil];
  } preload:^NSArray<ARGraphQLQuery *> *{
    return [ARBidFlowViewController preloadQueriesWithArtworkID:artworkID saleID:saleID intent:ARBidFlowViewControllerIntentBid];
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
      [[[AREmission sharedInstance] graphQLQueryCacheModule] clearAll];

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
  [sectionData addCellData:self.showSentryLogs];

  AppSetup *setup = [AppSetup ambientSetup];
  if (setup.inStaging) {
    [sectionData addCellDataFromArray:@[
      [self editableTextCellDataWithName:@"Gravity API" defaultKey:ARStagingAPIURLDefault],
      [self editableTextCellDataWithName:@"Metaphysics API" defaultKey:ARStagingMetaphysicsURLDefault],
      [self editableTextCellDataWithName:@"Prediction URL" defaultKey:ARStagingPredictionURLDefault],
      [self editableTextCellDataWithName:@"RN Packager" defaultKey:ARRNPackagerHostDefault],
    ]];

  }

  [sectionData addCellData:self.toggleRNPSwitch];
  [sectionData addCellData:self.generateStagingSwitch];
  [sectionData addCellData:self.clearGraphQLQueryCache];
  [sectionData addCellData:self.clearImageCache];
  [sectionData addCellData:self.logOutButton];
  return sectionData;
}

- (ARCellData *)clearGraphQLQueryCache;
{
  return [self tappableCellDataWithTitle:@"Clear GraphQL Query Cache" selection:^{
    [[[AREmission sharedInstance] graphQLQueryCacheModule] clearAll];
  }];
}

- (ARCellData *)clearImageCache;
{
  return [self tappableCellDataWithTitle:@"Clear image cache" selection:^{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    [[manager imageCache] clearDiskOnCompletion:^{
      [[manager imageCache] clearMemory];
    }];
  }];
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

- (ARCellData *)showSentryLogs
{
  return [self tappableCellDataWithTitle:@"Show Sentry Breadcrumbs" selection:^{
    [self.navigationController pushViewController:[[ARAdminSentryBreadcrumbViewController alloc] init] animated:YES];
  }];
}

@end
