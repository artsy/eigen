#import "ARUserSettingsViewController.h"

#import <FODFormKit/FODForm.h>
#import <FODFormKit/FODFormBuilder.h>

#import "ARUserManager.h"


@interface ARUserSettingsViewController () <FODFormViewControllerDelegate, ARMenuAwareViewController>
@property (nonatomic, strong) User *user;
@end


@implementation ARUserSettingsViewController

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesBackButton
{
    return NO;
}

- (BOOL)hidesToolbarMenu
{
    return YES;
}

- (instancetype)initWithUser:(User *)user
{
    FODForm *form = [ARUserSettingsViewController setUpFormWithUser:user];
    self = [super initWithForm:form userInfo:nil];
    if (!self) {
        return nil;
    }

    NSDictionary *nibOverrides = @{
        @"TextInputCellWithTitle" : @"ARTextInputCellWithTitle",
        @"SwitchCell" : @"ARSwitchCell"
    };

    self.cellFactory = [[FODCellFactory alloc] initWithOverridesDict:nibOverrides];
    _user = user;

    return self;
}

- (void)createSaveAndCancelButtons
{
    // don't create these buttons
}

- (void)createTableView
{
    CGRect frame = self.view.frame;
    frame.origin.y += 20;

    self.tableView = [[UITableView alloc] initWithFrame:frame style:UITableViewStyleGrouped];
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;

    UIEdgeInsets insetCopy = self.tableView.separatorInset;
    insetCopy.right = insetCopy.left;
    [self.tableView setSeparatorInset:insetCopy];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.tableView.backgroundColor = [UIColor whiteColor];
}

+ (FODForm *)setUpFormWithUser:(User *)user
{
    FODFormBuilder *builder = [[FODFormBuilder alloc] init];

    [builder startFormWithTitle:@""];

    [builder section:@"Settings"];

    [builder rowWithKey:@"name"
                ofClass:[FODTextInputRow class]
               andTitle:@"Full Name"
               andValue:user.name];

    [builder rowWithKey:@"defaultProfileID"
                ofClass:[FODTextInputRow class]
               andTitle:@"Username"
               andValue:user.defaultProfileID];

    [builder rowWithKey:@"email"
                ofClass:[FODTextInputRow class]
               andTitle:@"Email"
               andValue:user.email];

    [builder rowWithKey:@"phone"
                ofClass:[FODTextInputRow class]
               andTitle:@"Phone"
               andValue:user.phone];

    [builder section:@"Email Me"];

    [builder rowWithKey:@"receiveWeeklyEmail"
                ofClass:[FODBooleanRow class]
               andTitle:@"Weekly featured content"
               andValue:@(user.receiveWeeklyEmail)];

    [builder rowWithKey:@"receiveFollowArtistsEmail"
                ofClass:[FODBooleanRow class]
               andTitle:@"About artists I follow"
               andValue:@(user.receiveFollowArtistsEmail)];

    [builder rowWithKey:@"receiveFollowUsersEmail"
                ofClass:[FODBooleanRow class]
               andTitle:@"When someone follows me"
               andValue:@(user.receiveFollowUsersEmail)];

    FODForm *form = [builder finishForm];
    return form;
}

- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    [ARUserSettingsViewController tableView:tableView addSeparatorToViewElement:cell];
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    CGFloat headerWidth = tableView.frame.size.width;
    CGFloat headerHeight = [self tableView:tableView heightForHeaderInSection:section];
    UIView *header = [[UIView alloc] initWithFrame:CGRectMake(0, 0, headerWidth, headerHeight)];

    UILabel *label = [ARThemedFactory labelForViewSubHeaders];
    label.frame = header.frame;
    NSString *labelText = [self.form.sections[section] title].uppercaseString;
    [label setText:labelText withLetterSpacing:0.5];
    label.font = [label.font fontWithSize:14];
    label.backgroundColor = [UIColor clearColor];

    [ARUserSettingsViewController tableView:tableView addSeparatorToViewElement:header];
    [header addSubview:label];
    return header;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 44;
}

+ (void)tableView:(UITableView *)tableView addSeparatorToViewElement:(UIView *)view
{
    CGFloat height = 1;
    // Check to see if we have already added a separator subview
    if ([view viewWithTag:ARSeparatorTag]) {
        return;
    }

    CGFloat width = tableView.frame.size.width - tableView.separatorInset.left - tableView.separatorInset.right;
    CGFloat xOrigin = tableView.separatorInset.left;
    CGFloat yOrigin = view.frame.size.height - height;

    UIView *separator = [[UIView alloc] initWithFrame:CGRectMake(xOrigin, yOrigin, width, height)];
    separator.tag = ARSeparatorTag;
    separator.backgroundColor = [UIColor artsyLightGrey];
    [view addSubview:separator];
}

- (void)switchValueChangedTo:(BOOL)newValue userInfo:(id)userInfo
{
    [super switchValueChangedTo:newValue userInfo:userInfo];
    FODFormRow *row = (FODFormRow *)userInfo;

    @weakify(row);
    [ArtsyAPI updateCurrentUserProperty:[User JSONKeyPathsByPropertyKey][row.key]
        toValue:row.workingValue
        success:^(User *user) {
            @strongify(row);
            [[User currentUser] setValue:[user valueForKey:row.key] forKey:row.key];
            [[ARUserManager sharedManager] storeUserData];
        }
        failure:^(NSError *error) {
            @strongify(row);
            row.workingValue = row.initialValue;
            [self.tableView reloadRowsAtIndexPaths:@[row.indexPath] withRowAnimation:UITableViewRowAnimationNone];
        }];
}

- (void)valueChangedTo:(NSString *)newValue userInfo:(id)userInfo
{
    [super valueChangedTo:newValue userInfo:userInfo];

    FODFormRow *row = (FODFormRow *)userInfo;
    if ([(NSString *)row.workingValue isEqualToString:(NSString *)row.initialValue]) {
        return;
    }

    @weakify(row);
    [ArtsyAPI updateCurrentUserProperty:[User JSONKeyPathsByPropertyKey][row.key] toValue:row.workingValue
        success:^(User *user) {
            @strongify(row);
            [[User currentUser] setValue:[user valueForKey:row.key] forKey:row.key];
            [[ARUserManager sharedManager] storeUserData];
        }
        failure:^(NSError *error) {
            @strongify(row);
            row.workingValue = row.initialValue;
            [self.tableView reloadRowsAtIndexPaths:@[row.indexPath] withRowAnimation:UITableViewRowAnimationNone];
        }];
}

- (void)formCancelled:(FODForm *)form userInfo:(id)userInfo
{
}

- (void)formSaved:(FODForm *)form userInfo:(id)userInfo
{
}

@end
