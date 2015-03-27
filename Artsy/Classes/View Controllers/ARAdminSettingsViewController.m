#import "ARAdminSettingsViewController.h"
#import "ARGroupedTableViewCell.h"
#import "ARAnimatedTickView.h"
#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARFileUtils.h"
#import "ARRouter.h"

#if DEBUG
#import <VCRURLConnection/VCR.h>
#endif

NSString *const AROptionCell = @"OptionCell";
NSString *const ARLabOptionCell = @"LabOptionCell";

@implementation ARAdminSettingsViewController

- (void)viewDidLoad {
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

    [miscSectionData addCellData:[self generateLogOut]];
    [miscSectionData addCellData:[self generateOnboarding]];
    [miscSectionData addCellData:[self generateEmailData]];
    [miscSectionData addCellData:[self generateRestart]];
    [miscSectionData addCellData:[self generateStagingSwitch]];

    [tableViewData addSectionData:miscSectionData];

    ARSectionData *labsSection = [self createLabsSection];
    [tableViewData addSectionData:labsSection];

    ARSectionData *vcrSection = [self createVCRSection];
    [tableViewData addSectionData:vcrSection];

    self.tableViewData = tableViewData;
    self.tableView.contentInset = UIEdgeInsetsMake(88, 0, 0, 0);
}

- (ARCellData *)generateLogOut
{
    ARCellData *onboardingData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [onboardingData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Log Out";
    }];

    [onboardingData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showAlertViewWithTitle:@"Confirm Logout" message:@"App will exit. Please re-open to log back in." actionTitle:@"Logout" actionHandler:^{
            [ARUserManager logout];
        }];
    }];
    return onboardingData;
}

- (ARCellData *)generateOnboarding
{
    ARCellData *onboardingData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [onboardingData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Show Onboarding";
    }];

    [onboardingData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self showSlideshow];
    }];
    return onboardingData;
}

- (ARCellData *)generateEmailData
{
    ARCellData *emailData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [emailData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Email Artsy Developers";
    }];

    [emailData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [self emailTapped];
    }];
    return emailData;
}

- (ARCellData *)generateRestart
{
    ARCellData *crashCellData = [[ARCellData alloc] initWithIdentifier:AROptionCell];
    [crashCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Restart";
    }];

    [crashCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        exit(YES);
    }];
    return crashCellData;
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

- (ARSectionData *)createLabsSection
{
    ARSectionData *labsSectionData = [[ARSectionData alloc] init];
    labsSectionData.headerTitle = @"Labs";

    NSArray *options = [AROptions labsOptions];
    for (NSInteger index = 0; index < options.count; index++) {
        NSString *title = options[index];

        ARCellData *cellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
        [cellData setCellConfigurationBlock:^(UITableViewCell *cell) {
            cell.textLabel.text = title;
            cell.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:[AROptions boolForOption:title]];
        }];

        [cellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
            BOOL currentSelection = [AROptions boolForOption:title];
            [AROptions setBool:!currentSelection forOption:title];

            UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
            [(ARAnimatedTickView *)cell.accessoryView setSelected:!currentSelection animated:YES];
        }];

        [labsSectionData addCellData:cellData];
    }
    return labsSectionData;
}

- (ARSectionData *)createVCRSection
{
    ARSectionData *vcrSectionData = [[ARSectionData alloc] init];
#if DEBUG
    vcrSectionData.headerTitle = @"Offline Recording Mode (Dev)";

    ARCellData *startCellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
    [startCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Start Recording, restarts";
    }];

    [startCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        NSString *oldFilePath = [ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"];
        [[NSFileManager defaultManager] removeItemAtPath:oldFilePath error:nil];

        [AROptions setBool:YES forOption:AROptionsUseVCR];
        exit(0);
    }];

    ARCellData *saveCellData = [[ARCellData alloc] initWithIdentifier:ARLabOptionCell];
    [saveCellData setCellConfigurationBlock:^(UITableViewCell *cell) {
        cell.textLabel.text = @"Saves Recording, restarts";
    }];

    [saveCellData setCellSelectionBlock:^(UITableView *tableView, NSIndexPath *indexPath) {
        [VCR save:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        exit(0);
    }];


    [vcrSectionData addCellData:startCellData];
    [vcrSectionData addCellData:saveCellData];
#endif

    return vcrSectionData;
}

- (void)showAlertViewWithTitle:(NSString *)title message:(NSString *)message actionTitle:(NSString *)actionTitle actionHandler:(void (^)())handler
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:UIAlertControllerStyleAlert];

    UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:actionTitle
                                                            style:UIAlertActionStyleDestructive
                                                          handler:^(UIAlertAction * action) {
                                                              handler();
                                                          }];
    
    [alert addAction:defaultAction];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showSlideshow
{
    ARAppDelegate *delegate = [ARAppDelegate sharedInstance];
    [delegate showTrialOnboardingWithState:ARInitialOnboardingStateSlideShow andContext:ARTrialContextNotTrial];

    [self.navigationController popViewControllerAnimated:NO];
}

#pragma mark -
#pragma mark Email functions

- (void)emailTapped
{
    NSString *path = [[NSBundle mainBundle] pathForResource: @"mail" ofType: @"html"];
    NSError *error = nil;
    NSString *body = [NSString stringWithContentsOfFile: path encoding: NSUTF8StringEncoding error: &error];
    body = [body stringByReplacingOccurrencesOfString:@"{{Device}}" withString:[[UIDevice currentDevice] platformString]];
    body = [body stringByReplacingOccurrencesOfString:@"{{iOS Version}}" withString:[[UIDevice currentDevice] systemVersion]];
    body = [body stringByReplacingOccurrencesOfString:@"{{Version}}" withString:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"]];
    [self sendMail:@[@"mobile@artsymail.com"] subject:@"Artsy Mobile Feedback" body:body];
}

- (void)sendMail:(NSArray *)toRecipients subject:(NSString *)subject body:(NSString*)body
{
    if ([MFMailComposeViewController canSendMail]) {
        MFMailComposeViewController *controller = [[MFMailComposeViewController alloc] init];
        [controller setToRecipients:toRecipients];
        [controller setSubject:subject];
        [controller setMessageBody:body isHTML:YES];
        controller.mailComposeDelegate = self;
        [self presentViewController:controller animated:YES completion:^{}];

    } else {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:nil message:@"Your device is unable to send email." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
    }
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error
{
    [self dismissViewControllerAnimated:YES completion:^{}];
}

-(BOOL)shouldAutorotate
{
    return NO;
}

@end
