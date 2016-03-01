#import "ARWorksForYouViewController.h"
#import "ARLabelSubclasses.h"
#import "Artist.h"
#import "ARWorksForYouNetworkModel.h"
#import "ARDispatchManager.h"
#import "ARWorksForYouNotificationItem.h"
#import "ARArtworkSetViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARFonts.h"
#import "ARReusableLoadingView.h"
#import "ARWorksForYouNotificationView.h"
#import "ARArtistViewController.h"

#import <ORStackView/ORStackView.h>
#import <ORStackView/ORStackScrollView.h>
#import <ORStackView/ORSplitStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static int ARLoadingIndicatorView = 1;
#import "ORStackView+ArtsyViews.h"


@interface ARWorksForYouViewController () <AREmbeddedModelsViewControllerDelegate, UIScrollViewDelegate>

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

    // mark as viewed upon loading
    [self markNotificationsAsRead];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    _worksForYouNetworkModel = _worksForYouNetworkModel ?: [[ARWorksForYouNetworkModel alloc] init];


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
        
        // since this view controller will be handling all navigation, it should be the embedded VC delegate
        AREmbeddedModelsViewController *worksVC = [[AREmbeddedModelsViewController alloc] init];
        worksVC.delegate = self;
        
        // the embedded artworks view controller will then be added to the notification view stack
        ARWorksForYouNotificationView *worksByArtistView = [[ARWorksForYouNotificationView alloc] initWithNotificationItem:item artworksViewController:worksVC];
        worksByArtistView.delegate = self;
        
        [worksByArtistView setupSubviews];
        
        [self.view.stackView addSubview:worksByArtistView withTopMargin:@"0" sideMargin:@"20"];
        
        // TODO: allDownloaded not set to YES yet at this stage, need to figure out where to do this
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
    // PUT /api/v1/me/notifications
    // will go in network model
}

- (void)artistTapped:(UIGestureRecognizer *)recognizer
{
    //    recognizer
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
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

- (void)didSelectArtist:(Artist *)artist
{
    [self didSelectArtist:artist animated:YES];
}

- (void)didSelectArtist:(Artist *)artist animated:(BOOL)animated
{
    ARArtistViewController *artistVC = [ARSwitchBoard.sharedInstance loadArtistWithID:artist.artistID];
    [self.navigationController pushViewController:artistVC animated:animated];
}

#pragma mark - AREmbeddedViewController delegate methods

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:controller.items inFair:nil atIndex:index];
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
