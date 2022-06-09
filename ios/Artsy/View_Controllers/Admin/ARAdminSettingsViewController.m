#import <CoreServices/CoreServices.h>
#import <ReplayKit/ReplayKit.h>

#import "ARAdminSettingsViewController.h"
#import "AREchoContentsViewController.h"
#import "ARInternalMobileWebViewController.h"

#import "ARDefaults.h"
#import "ARAnimatedTickView.h"
#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARFileUtils.h"
#import "ARRouter.h"
#import "AROptions.h"
#import "Artsy-Swift.h"

#import "UIDevice-Hardware.h"
#import "ARAdminNetworkModel.h"
#import "ARAppNotificationsDelegate.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <Emission/AREmission.h>
#import <Sentry/SentrySDK.h>
#import <React/RCTBridge.h>
#import <React/RCTDevSettings.h>


NSString *const ARRecordingScreen = @"ARRecordingScreen";

@interface ARAdminSettingsViewController()

@end

@implementation ARAdminSettingsViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARTableViewData *tableViewData = [[ARTableViewData alloc] init];

    NSString *name = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *gitCommitShortHash = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitShortHash"];
    NSString *userEmail = [[[ARUserManager sharedManager] currentUser] email];

    ARSectionData *userSectionData = [[ARSectionData alloc] init];
    userSectionData.headerTitle = [NSString stringWithFormat:@"%@ v%@, build %@ (%@), %@", name, version, build, gitCommitShortHash, userEmail];

    [userSectionData addCellDataFromArray:@[
        [self generateRestart],
    ]];
    [tableViewData addSectionData:userSectionData];

    ARSectionData *launcherSections = [[ARSectionData alloc] initWithCellDataArray:@[
        [self generateFair2],
        [self generateArtistSeries],
        [self generateFeaturePage],
        [self generateShowAllLiveAuctions],
        [self showConsignmentsFlow],
        [self generateEchoContents],
    ]];

    launcherSections.headerTitle = @"Launcher";
    [tableViewData addSectionData:launcherSections];

    ARSectionData *labsSection = [self createLabsSection];
    [tableViewData addSectionData:labsSection];

    ARSectionData *toggleSections = [[ARSectionData alloc] initWithCellDataArray:@[
       [self generateOnScreenMartsy]
    ]];
    toggleSections.headerTitle = @"Options";
    [tableViewData addSectionData:toggleSections];

    ARSectionData *developerSection = [self createDeveloperSection];
    [tableViewData addSectionData:developerSection];

    self.tableViewData = tableViewData;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    // Let's keep this light-on-dark since it's an admin-only view.
    return UIStatusBarStyleLightContent;
}


- (ARCellData *)generateFeaturePage
{
    return [self tappableCellDataWithTitle:@"→ Feature Page" selection:^{
        [[AREmission sharedInstance] navigate:@"/feature/milan-gallery-community"];
    }];
}

- (ARCellData *)generateArtistSeries
{
    return [self tappableCellDataWithTitle:@"→ Artist Series" selection:^{
        [[AREmission sharedInstance] navigate:@"/artist-series/alex-katz-ada"];
    }];
}

- (ARCellData *)generateFair2
{
    return [self tappableCellDataWithTitle:@"→ Fair" selection:^{
        [[AREmission sharedInstance] navigate:@"/fair/frieze-new-york-2019"];
    }];
}

- (ARCellData *)generateRestart
{
    return [self tappableCellDataWithTitle:@"Restart" selection:^{
        exit(0);
    }];
}

- (ARCellData *)generateRemoteDebug
{
    RCTDevSettings *devSettings = [[[AREmission sharedInstance] bridge] devSettings];
    devSettings.isShakeToShowDevMenuEnabled = YES;

    if (!devSettings.isRemoteDebuggingAvailable) {
        return [self tappableCellDataWithTitle:@"Remote JS Debugger Unavailable" selection:^{
            UIAlertController *alertController = [UIAlertController
                                                  alertControllerWithTitle:@"Remote JS Debugger Unavailable"
                                                  message:@"You need to include the RCTWebSocket library to enable remote JS debugging"
                                                  preferredStyle:UIAlertControllerStyleAlert];
            __weak typeof(alertController) weakAlertController = alertController;
            [alertController addAction:
             [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(__unused UIAlertAction *action){
                [weakAlertController dismissViewControllerAnimated:YES completion:nil];
            }]];
        }];
    } else {
        NSString *title = devSettings.isDebuggingRemotely ? @"Stop Remote JS Debugging" : @"Debug JS Remotely";

        return [self tappableCellDataWithTitle:title selection:^{
            devSettings.isDebuggingRemotely = !devSettings.isDebuggingRemotely;
            exit(0);
        }];
    }
}

- (ARCellData *)generateShowReactNativeDevMenu
{
    return [self tappableCellDataWithTitle:@"Show React Native Dev Menu" selection:^{
        // It'd be nice to use the constant here, but it won't compile on CI
        [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTShowDevMenuNotification" object:nil];
    }];
}

- (ARCellData *)generateShowAllLiveAuctions
{
    return [self tappableCellDataWithTitle:@"→ All Live Auctions" selection:^{

        NSURL *url = [NSURL URLWithString:@"https://live-staging.artsy.net"];
        ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:url];
        [self.navigationController pushViewController:webVC animated:YES];
    }];
}

- (ARCellData *)showConsignmentsFlow
{
    return [self tappableCellDataWithTitle:@"→ Consignments Flow" selection:^{
        [[AREmission sharedInstance] navigate:@"/consign/submission"];
    }];
}

- (ARCellData *)generateOnScreenMartsy
{
    NSString *message = [AROptions boolForOption:AROptionsShowMartsyOnScreen] ? @"Hide" : @"Show";
    NSString * title = NSStringWithFormat(@"%@ Red Dot for Martsy Views", message);

    return [self tappableCellDataWithTitle:title selection:^{
        BOOL current = [AROptions boolForOption:AROptionsShowMartsyOnScreen];
        [AROptions setBool:!current forOption:AROptionsShowMartsyOnScreen];
        exit(YES);
    }];
}

- (ARCellData *)generateEchoContents
{
    return [self tappableCellDataWithTitle:@"→ Echo Configuration" selection:^{
        [self.navigationController pushViewController:[[AREchoContentsViewController alloc] init] animated:YES];
    }];
}

#if !TARGET_IPHONE_SIMULATOR
- (ARCellData *)generateNotificationTokenPasteboardCopy;
{
    return [self tappableCellDataWithTitle:@"Copy Push Notification Token" selection:^{
        NSString *deviceToken = [[NSUserDefaults standardUserDefaults] valueForKey:ARAPNSDeviceTokenKey];
        [[UIPasteboard generalPasteboard] setValue:deviceToken forPasteboardType:(NSString *)kUTTypePlainText];
    }];
}

- (ARCellData *)requestNotificationsAlert;
{
    return [self tappableCellDataWithTitle:@"Request Receiving Notifications" selection:^{
        [[[ARAppNotificationsDelegate alloc] init] registerForDeviceNotificationsWithApple];
    }];
}
#endif


- (ARSectionData *)createLabsSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Labs";

    NSArray *options = [[AROptions labsOptions] sortedArrayUsingSelector:@selector(compare:)];
    for (NSInteger index = 0; index < options.count; index++) {
        NSString *key = options[index];
        NSString *title = [AROptions descriptionForOption:key];

        ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
        [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
            cell.textLabel.text = title;
            cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[AROptions boolForOption:key]];
        }];

        [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
            BOOL currentSelection = [AROptions boolForOption:key];
            [AROptions setBool:!currentSelection forOption:key];

            UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
            [(ARAnimatedTickView *)cell.accessoryView setSelected:!currentSelection animated:YES];
        }];

        [labsSectionData addCellData:cellData];
    }
    return labsSectionData;
}

- (ARSectionData *)createDeveloperSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Developer";

    return labsSectionData;
}

- (BOOL)shouldAutorotate
{
    return NO;
}

@end
