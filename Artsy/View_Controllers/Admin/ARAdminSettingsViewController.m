#import <HockeySDK_Source/HockeySDK.h>
#import <HockeySDK_Source/BITFeedbackManager.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <ReplayKit/ReplayKit.h>

#import "ARAdminSettingsViewController.h"
#import "ARQuicksilverViewController.h"
#import "AREchoContentsViewController.h"
#import "ARInternalMobileWebViewController.h"

#import "ARDefaults.h"
#import "ARAnimatedTickView.h"
#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARFileUtils.h"
#import "ARRouter.h"
#import "AROptions.h"

#import "ARAdminTableViewCell.h"
#import "ARTickedTableViewCell.h"

#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"
#import "ARAdminNetworkModel.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AppHub/AppHub.h>
#import <Emission/AREmission.h>
#import <Emission/ARInboxComponentViewController.h>

#if DEBUG
#import <VCRURLConnection/VCR.h>
#endif

NSString *const ARRecordingScreen = @"ARRecordingScreen";


@implementation ARAdminSettingsViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARTableViewData *tableViewData = [[ARTableViewData alloc] init];
    [self registerClass:[ARTickedTableViewCell class] forCellReuseIdentifier:ARLabOptionCell];
    [self registerClass:[ARAdminTableViewCell class] forCellReuseIdentifier:AROptionCell];

    ARSectionData *miscSectionData = [[ARSectionData alloc] init];
    NSString *name = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *gitCommitRevision = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitRev"];

    miscSectionData.headerTitle = [NSString stringWithFormat:@"%@ v%@, build %@ (%@)", name, version, build, gitCommitRevision];
    [miscSectionData addCellDataFromArray:@[
        [self generateLogOut],
        [self generateOnboarding],
        [self generateFeedback],
        [self generateRecording],
        [self generateRestart],
        [self generateStagingSwitch],
        [self generateQuicksilver],
        [self generateShowAllLiveAuctions],
        [self generateOnScreenAnalytics],
        [self generateOnScreenMartsy],
        [self generateEchoContents],
    ]];

#if !TARGET_IPHONE_SIMULATOR
    [miscSectionData addCellData:[self generateNotificationTokenPasteboardCopy]];
#endif

    [tableViewData addSectionData:miscSectionData];

    ARSectionData *rnSection = [self createReactNativeSection];
    [tableViewData addSectionData:rnSection];

    ARSectionData *labsSection = [self createLabsSection];
    [tableViewData addSectionData:labsSection];

    ARSectionData *vcrSection = [self createVCRSection];
    [tableViewData addSectionData:vcrSection];

    ARSectionData *developerSection = [self createDeveloperSection];
    [tableViewData addSectionData:developerSection];

    self.tableViewData = tableViewData;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (ARCellData *)generateLogOut
{
    return [self tappableCellDataWithTitle:@"Log Out" selection:^{
        [self showAlertViewWithTitle:@"Confirm Log Out" message:@"" actionTitle:@"Continue" actionHandler:^{
            [ARUserManager logout];
        }];
    }];
}

- (ARCellData *)generateOnboarding
{
    return [self tappableCellDataWithTitle:@"Show Onboarding" selection:^{
        [self showSlideshow];
    }];
}


- (ARCellData *)generateFeedback
{
    return [self tappableCellDataWithTitle:@"Provide Feedback" selection:^{
        ARHockeyFeedbackDelegate *feedback = [[ARHockeyFeedbackDelegate alloc] init];
        [feedback showFeedback:nil data:nil];
    }];
}


- (ARCellData *)generateRecording
{
    BOOL isRecording = [AROptions boolForOption:ARRecordingScreen];
    ARCellData *emailData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [emailData setCellConfigurationBlock:^(UITableViewCell *cell) {
        NSString *message = isRecording ? @"Stop Recording" : @"Create feedback Video";
        cell.textLabel.text = message;
    }];

    [emailData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        if(!isRecording) {
            [self.navigationController popViewControllerAnimated:FALSE];
            [[RPScreenRecorder sharedRecorder] startRecordingWithHandler:^(NSError * _Nullable error) {
                if (error) {
                    [self showAlertViewWithTitle:@"Error setting up recorder" message:error.localizedDescription actionTitle:@"Sorry..." actionHandler:nil];
                }
                [AROptions setBool:YES forOption:ARRecordingScreen];
            }];
        } else {
            [AROptions setBool:NO forOption:ARRecordingScreen];
            [[RPScreenRecorder sharedRecorder] stopRecordingWithHandler:^(RPPreviewViewController * _Nullable previewViewController, NSError * _Nullable error) {
                previewViewController.previewControllerDelegate = [ARHockeyFeedbackDelegate shared];
                [[ARTopMenuViewController sharedController] pushViewController:previewViewController];

            }];
        }
    }];
    return emailData;
}



- (ARCellData *)generateRestart
{
    return [self tappableCellDataWithTitle:@"Restart" selection:^{
        exit(0);
    }];
}

- (ARCellData *)generateStagingSwitch
{
    BOOL useStaging = [AROptions boolForOption:ARUseStagingDefault];
    NSString *title = NSStringWithFormat(@"Switch to %@ (Logs out)", useStaging ? @"Production" : @"Staging");

    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = title;
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showAlertViewWithTitle:@"Confirm Logout" message:@"Switching servers requires logout. App will exit. Please re-open to log back in." actionTitle:@"Continue" actionHandler:^{
            [ARUserManager logoutAndSetUseStaging:!useStaging];
        }];
    }];
    return crashCellData;
}

- (ARCellData *)generateQuicksilver
{
    return [self tappableCellDataWithTitle:@"Quicksilver" selection:^{
        ARQuicksilverViewController *quicksilver = [[ARQuicksilverViewController alloc] init];
        [self.navigationController pushViewController:quicksilver animated:YES];
    }];
}

- (ARCellData *)generateShowAllLiveAuctions
{
    return [self tappableCellDataWithTitle:@"Show all live auctions" selection:^{

        NSURL *url = [NSURL URLWithString:@"https://live-staging.artsy.net"];
        ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:url];
        [self.navigationController pushViewController:webVC animated:YES];
    }];
}

- (ARCellData *)generateOnScreenAnalytics
{
    NSString *message = [AROptions boolForOption:AROptionsShowAnalyticsOnScreen] ? @"Start" : @"Stop";
    NSString * title = NSStringWithFormat(@"%@ on Screen Analytics", message);

    return [self tappableCellDataWithTitle:title selection:^{
        BOOL current = [AROptions boolForOption:AROptionsShowMartsyOnScreen];
        [AROptions setBool:!current forOption:AROptionsShowAnalyticsOnScreen];
        exit(YES);
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
    return [self tappableCellDataWithTitle:@"View Echo Configuration" selection:^{
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
#endif

- (ARSectionData *)createReactNativeSection
{
    ARSectionData *sectionData = [[ARSectionData alloc] init];
    sectionData.headerTitle = @"React Native";

    BOOL isStagingReact = [AROptions boolForOption:AROptionsStagingReactEnv];
    BOOL isDevReact = [AROptions boolForOption:AROptionsDevReactEnv];

    if (isStagingReact) {
        [sectionData addCellData:self.emissionInfo];
        [sectionData addCellData:self.emissionVersionUpdater];
    }
    if (!isDevReact) {
        [sectionData addCellData:self.toggleStagingReactNative];
    }
    if (!isStagingReact) {
        [sectionData addCellData:self.useDevReactNative];
    }
    return sectionData;
}

- (ARCellData *)emissionInfo
{
    NSString *emissionVersion = [[NSUserDefaults standardUserDefaults] valueForKey:AREmissionHeadVersionDefault];
    return [self informationCellDataWithTitle:[NSString stringWithFormat:@"Emission v%@", emissionVersion]];
}

- (ARCellData *)emissionVersionUpdater
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    cellData.keepSelection = YES;

    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        cell.textLabel.text = @"Update Emission to latest";
    };

    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        NSIndexPath *selection = tableView.indexPathForSelectedRow;
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:selection];
        cell.textLabel.text = @"Updating...";

        [self updateEmissionVersion:^() {
            exit(0);
        }];
    };
    return cellData;
}

- (void)updateEmissionVersion:(void (^)())completion;
{
    NSString *subtitle = @"A commit from master";
    ARAdminNetworkModel *model = [[ARAdminNetworkModel alloc] init];
    [model downloadJavaScriptForMasterCommit:^(NSString * _Nullable title, NSString * _Nullable subtitle) {
        subtitle = subtitle;

    } completion:^(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error) {
        if (error) {
            NSLog(@"Err: %@", error);
        } else {
            [self showAlertViewWithTitle:@"Restarting" message:subtitle actionTitle:@"Restart" actionHandler:^{
                completion();
            }];
        }
    }];
}

- (ARCellData *)toggleStagingReactNative
{
    NSString *message = [AROptions boolForOption:AROptionsStagingReactEnv] ? @"Embededed" : @"Staging";
    NSString *title = NSStringWithFormat(@"Use %@ React Native ENV (restarts)", message);

    return [self tappableCellDataWithTitle:title selection:^{
        [AROptions setBool: ![AROptions boolForOption:AROptionsStagingReactEnv] forOption:AROptionsStagingReactEnv];
        NSBundle *bundle = [NSBundle bundleForClass:AREmission.class];
        NSString *version = bundle.infoDictionary[@"CFBundleShortVersionString"];
        [[NSUserDefaults standardUserDefaults] setValue:version forKey:AREmissionHeadVersionDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];
        exit(0);
    }];
}

- (ARCellData *)useDevReactNative
{
    ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    BOOL isDevReact = [AROptions boolForOption:AROptionsDevReactEnv];

    cellData.cellConfigurationBlock = ^(UITableViewCell *cell) {
        if (isDevReact) {
            cell.textLabel.text = @"Use bundled Emission (restarts)";
        } else {
            cell.textLabel.text = @"Use local Emission packaging server (restarts)";
        }
    };
    cellData.cellSelectionBlock = ^(UITableView *tableView, NSIndexPath *indexPath) {
        [AROptions setBool: !isDevReact forOption:AROptionsDevReactEnv];

        // Bail quick if we're turning it off
        if (isDevReact) { exit(0); }

        // Warn to see the docs
        NSString *message = @"See the Emission docs on this, github.com/artsy/Emission/docs/running-emission-in-eigen.md";
        UIAlertController *controller = [UIAlertController alertControllerWithTitle:@"Note" message:message preferredStyle:UIAlertControllerStyleAlert];

        [controller addAction:[UIAlertAction actionWithTitle:@"Got it" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            [AROptions setBool: !isDevReact forOption:AROptionsDevReactEnv];
            exit(0);
        }]];
        [self presentViewController:controller animated:YES completion:nil];
    };
    return cellData;
}


- (ARSectionData *)createLabsSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Labs";

    NSArray *options = [AROptions labsOptions];
    for (NSInteger index = 0; index < options.count; index++) {
        NSString *title = options[index];
        BOOL requiresRestart = [[AROptions labsOptionsThatRequireRestart] indexOfObject:title] != NSNotFound;

        ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
        [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
            cell.textLabel.text = requiresRestart ? [title stringByAppendingString:@" (restarts)"] : title;
            cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[AROptions boolForOption:title]];
        }];

        [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
            BOOL currentSelection = [AROptions boolForOption:title];
            [AROptions setBool:!currentSelection forOption:title];

            if (requiresRestart) {
                // Show checkmark.
                ar_dispatch_after(1, ^{
                    exit(0);
                });
            }

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

    [labsSectionData addCellDataFromArray:@[
        [self editableTextCellDataWithName:@"Gravity API" defaultKey:ARStagingAPIURLDefault],
        [self editableTextCellDataWithName:@"Web" defaultKey:ARStagingWebURLDefault],
        [self editableTextCellDataWithName:@"Metaphysics" defaultKey:ARStagingMetaphysicsURLDefault],
        [self editableTextCellDataWithName:@"Live Auctions Socket" defaultKey:ARStagingLiveAuctionSocketURLDefault],
    ]];
    return labsSectionData;
}


- (ARSectionData *)createVCRSection
{
    ARSectionData *vcrSectionData = [[ARSectionData alloc] init];
#if DEBUG
    vcrSectionData.headerTitle = @"Offline Recording Mode (Dev)";

    ARCellData *startCellData = [self tappableCellDataWithTitle:@"Start API Recording, restarts" selection:^{
        NSString *oldFilePath = [ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"];
        [[NSFileManager defaultManager] removeItemAtPath:oldFilePath error:nil];

        [AROptions setBool:YES forOption:AROptionsUseVCR];
        exit(0);
    }];

    ARCellData *saveCellData = [self tappableCellDataWithTitle:@"Saves API Recording, restarts" selection:^{
        [VCR save:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        exit(0);
    }];

    [vcrSectionData addCellData:startCellData];
    [vcrSectionData addCellData:saveCellData];
#endif

    return vcrSectionData;
}

- (void)showSlideshow
{
    ARAppDelegate *delegate = [ARAppDelegate sharedInstance];
    [delegate showOnboardingWithState:ARInitialOnboardingStateSlideShow];

    [self.navigationController popViewControllerAnimated:NO];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

@end
