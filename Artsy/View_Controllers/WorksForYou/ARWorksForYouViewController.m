#import "ARWorksForYouViewController.h"
#import "ARLabelSubclasses.h"
#import "Artist.h"
#import "ARWorksForYouNetworkModel.h"
#import "ARDispatchManager.h"
#import "ARWorksForYouNotificationItem.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARFonts.h"
#import "ARReusableLoadingView.h"
#import "ARWorksForYouNotificationItemViewController.h"
#import "ARArtistViewController.h"
#import "ARScrollNavigationChief.h"
#import "Artsy-Swift.h"

#import <ORStackView/ORStackView.h>
#import <ORStackView/ORStackScrollView.h>
#import <ORStackView/ORSplitStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static int ARLoadingIndicatorView = 1;
#import "ORStackView+ArtsyViews.h"


@interface ARWorksForYouViewController () <UIScrollViewDelegate>

@property (nonatomic, strong) ORStackScrollView *view;

@property (nonatomic, strong, readwrite) id<ARWorksForYouNetworkModelable> worksForYouNetworkModel;

@end


@implementation ARWorksForYouViewController

@dynamic view;

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
    self.view.stackView.bottomMarginHeight = 20;
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.delegate = self;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    [self markNotificationsAsRead];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.worksForYouNetworkModel = self.worksForYouNetworkModel ?: [[ARWorksForYouNetworkModel alloc] init];

    ARSerifLabel *titleLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    // TODO: Localise / put strings elsewhere
    titleLabel.text = @"Works by Artists you follow";
    titleLabel.textColor = [UIColor blackColor];
    titleLabel.font = [UIFont serifFontWithSize:20];

    [self.view.stackView addSubview:titleLabel withTopMargin:@"25" sideMargin:@"45"];

    // this should probably be fancier
    [self updateView];
}


- (void)addSeparatorLine
{
    UIView *lineView = [[UIView alloc] init];
    lineView.backgroundColor = [UIColor lightGrayColor];
    [lineView constrainHeight:@"0.5"];

    if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
        [self.view.stackView addSubview:lineView withTopMargin:@"10" sideMargin:@"40"];
    } else {
        [self.view.stackView addSubview:lineView withTopMargin:@"10" sideMargin:@"0"];
    }
}

- (void)addNotificationItems:(NSArray *)items
{
    // network model will have incremented to page 2 after downloading first
    BOOL isFirstPage = (self.worksForYouNetworkModel.currentPage == 2);

    [items eachWithIndex:^(ARWorksForYouNotificationItem *item, NSUInteger index) {
        ARWorksForYouNotificationItemViewController *worksByArtistViewController = [[ARWorksForYouNotificationItemViewController alloc] initWithNotificationItem:item];
        
        NSString *topMargin = (isFirstPage && item == items.firstObject) ? @"25" : @"0";

        if (!isFirstPage || index) [self addSeparatorLine];
        [self.view.stackView addViewController:worksByArtistViewController toParent:self withTopMargin:topMargin sideMargin:@"20"];
    }];
}

- (void)updateView
{
    if (!self.worksForYouNetworkModel.allDownloaded) {
        [self getNextItemSet];
    } else if (!self.worksForYouNetworkModel.didReceiveNotifications) {
        [self showEmptyState];
    }
}

- (void)getNextItemSet
{
    [self addLoadingIndicator];

    __weak typeof(self) wself = self;
    [self.worksForYouNetworkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *notificationItems) {
        __strong typeof (wself) sself = wself;
        [sself removeLoadingIndicator];
        
        if (notificationItems.count) {
            [sself addNotificationItems:notificationItems];
        } else if (!sself.worksForYouNetworkModel.didReceiveNotifications) {
            [sself showEmptyState];
        }
    } failure:nil];
}

- (void)showEmptyState
{
    // remove top title
    if ([self.view.stackView.firstView isKindOfClass:UILabel.class]) {
        [self.view.stackView removeSubview:self.view.stackView.firstView];
    }

    ORStackView *emptyStateView = [[ORStackView alloc] init];
    [emptyStateView addSubview:self.emptyStateSeparator withTopMargin:@"0" sideMargin:@"40"];

    UILabel *mainEmptyStateLabel = [[ARSerifLabel alloc] init];
    mainEmptyStateLabel.text = @"You're not following any artists yet";
    mainEmptyStateLabel.textAlignment = NSTextAlignmentCenter;
    mainEmptyStateLabel.font = [UIFont serifFontWithSize:20];
    [emptyStateView addSubview:mainEmptyStateLabel withTopMargin:@"30" sideMargin:@"0"];

    UILabel *secondaryEmptyStateLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:5];
    secondaryEmptyStateLabel.font = [UIFont serifFontWithSize:16];
    secondaryEmptyStateLabel.textAlignment = NSTextAlignmentCenter;
    secondaryEmptyStateLabel.text = @"Follow artists to get updates about new works that become available";
    secondaryEmptyStateLabel.textColor = [UIColor artsyHeavyGrey];
    secondaryEmptyStateLabel.numberOfLines = 2;
    [emptyStateView addSubview:secondaryEmptyStateLabel withTopMargin:@"10" sideMargin:@"30"];

    [emptyStateView addSubview:self.emptyStateSeparator withTopMargin:@"20" sideMargin:@"40"];


    [self.view addSubview:emptyStateView];
    [emptyStateView constrainWidthToView:self.view predicate:@""];
    [emptyStateView alignCenterWithView:self.view];
}

- (UIView *)emptyStateSeparator
{
    UIView *line = [[UIView alloc] init];
    line.backgroundColor = [UIColor blackColor];
    [line constrainHeight:@"1.5"];
    return line;
}

- (void)markNotificationsAsRead
{
    [self.worksForYouNetworkModel markNotificationsRead];
}

#pragma mark - scrolling behavior

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    /// hides the search button
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    if ((scrollView.contentSize.height - scrollView.contentOffset.y) < scrollView.bounds.size.height) {
        [self updateView];
    }
}

- (void)addLoadingIndicator
{
    if (![self.view.stackView viewWithTag:ARLoadingIndicatorView]) {
        ARReusableLoadingView *loadingView = [[ARReusableLoadingView alloc] init];
        loadingView.tag = ARLoadingIndicatorView;
        [self.view.stackView addSubview:loadingView withTopMargin:@"40" sideMargin:@"0"];
        [loadingView startIndeterminateAnimated:YES];
    }
}

- (void)removeLoadingIndicator
{
    if ([self.view.stackView viewWithTag:ARLoadingIndicatorView]) {
        [self.view.stackView removeSubview:[self.view.stackView viewWithTag:ARLoadingIndicatorView]];
    }
}

- (BOOL)shouldAutorotate
{
    return self.traitDependentAutorotateSupport;
}

@end
