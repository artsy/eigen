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
#import "ARAppNotificationsDelegate.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import "AREmission.h"
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

    ARSectionData *launcherSections = [[ARSectionData alloc] initWithCellDataArray:@[
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

    self.tableViewData = tableViewData;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    // Let's keep this light-on-dark since it's an admin-only view.
    return UIStatusBarStyleLightContent;
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

- (BOOL)shouldAutorotate
{
    return NO;
}

@end
