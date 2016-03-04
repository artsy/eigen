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
#import "UIDevice-Hardware.h"

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
    titleLabel.text = @"Works by artists you follow";
    titleLabel.textColor = [UIColor blackColor];
    titleLabel.font = [UIFont serifFontWithSize:20];

    [self.view.stackView addSubview:titleLabel withTopMargin:@"20" sideMargin:@"45"];

    // this should probably be fancier
    [self getNextItemSet];
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
    [items each:^(ARWorksForYouNotificationItem *item) {
        
        ARWorksForYouNotificationItemViewController *worksByArtistViewController = [[ARWorksForYouNotificationItemViewController alloc] initWithNotificationItem:item];
        [self.view.stackView addViewController:worksByArtistViewController toParent:self withTopMargin:(item == items.firstObject) ? @"25" : @"0" sideMargin:@"20"];
        
        if (!(item == items.lastObject && self.worksForYouNetworkModel.allDownloaded)) {
            [self addSeparatorLine];
        }
    }];
}

- (void)getNextItemSet
{
    if (self.worksForYouNetworkModel.allDownloaded) {
        return;
    };

    [self addLoadingIndicator];

    __weak typeof(self) wself = self;
    [self.worksForYouNetworkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *notificationItems) {
        __strong typeof (wself) sself = wself;
        [sself removeLoadingIndicator];
        [sself addNotificationItems:notificationItems];
    } failure:nil];
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
        [self getNextItemSet];
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
    return [UIDevice isPad];
}

@end
