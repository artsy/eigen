#import "ARWorksForYouViewController.h"
#import "ARLabelSubclasses.h"
#import "Artist.h"
#import "ARWorksForYouNetworkModel.h"
#import "ARDispatchManager.h"
#import "ARWorksForYouNotificationItem.h"
#import "ARArtworkSetViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARFonts.h"

#import <ORStackView/ORStackView.h>
#import <ORStackView/ORStackScrollView.h>
#import <ORStackView/ORSplitStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARWorksForYouViewController () <AREmbeddedModelsViewControllerDelegate, UIScrollViewDelegate>

@property (nonatomic, strong) ORStackScrollView *view;

@property (nonatomic, strong, readonly) ARWorksForYouNetworkModel *worksForYouNetworkModel;

@end


@implementation ARWorksForYouViewController

@dynamic view;

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
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

    self.view.backgroundColor = [UIColor whiteColor];
    self.view.directionalLockEnabled = YES;
    self.view.alwaysBounceHorizontal = NO;
    self.view.showsHorizontalScrollIndicator = NO;
    self.view.delegate = self;

    _worksForYouNetworkModel = [[ARWorksForYouNetworkModel alloc] init];

    [self.view.stackView alignLeading:@"20" trailing:@"-20" toView:self.view];
    [self.view.stackView alignTopEdgeWithView:self.view predicate:@"20"];


    ARSerifLabel *titleLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    // TODO: Localise / put strings elsewhere
    titleLabel.text = @"Works by artists you follow";
    titleLabel.textColor = [UIColor blackColor];
    [self.view.stackView addSubview:titleLabel withTopMargin:@"50" sideMargin:@"20"];

    // this should probably be fancier
    [self getNextItemSet];
}

- (UIView *)viewBasedOnNotificationItem:(ARWorksForYouNotificationItem *)notificationItem
{
    ORStackView *worksByArtistView = [[ORStackView alloc] init];

    ARSansSerifLabelWithChevron *artistNameLabel = [[ARSansSerifLabelWithChevron alloc] initWithFrame:CGRectZero];
    artistNameLabel.text = notificationItem.artist.name;
    artistNameLabel.textColor = [UIColor blackColor];

    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    [df setDateFormat:@"MMM dd"];

    // this is currently nil - TODO: fix
    ARSansSerifLabel *dateLabel = [[ARSansSerifLabel alloc] initWithFrame:CGRectZero];
    dateLabel.text = [df stringFromDate:notificationItem.date];
    dateLabel.textColor = [UIColor lightGrayColor];
    dateLabel.textAlignment = NSTextAlignmentRight;
    dateLabel.font = [UIFont sansSerifFontWithSize:dateLabel.font.pointSize - 3];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = notificationItem.formattedNumberOfWorks;
    numberOfWorksAddedLabel.textColor = [UIColor lightGrayColor];

    ORSplitStackView *ssv = [[ORSplitStackView alloc] initWithLeftPredicate:@"200" rightPredicate:@"100"];
    [ssv.leftStack addSubview:artistNameLabel withTopMargin:@"10" sideMargin:@"0"];
    [ssv.rightStack addSubview:dateLabel withTopMargin:@"10" sideMargin:@"0"];

    [worksByArtistView addSubview:ssv withTopMargin:@"10" sideMargin:@"0"];
    [worksByArtistView addSubview:numberOfWorksAddedLabel withTopMargin:@"10" sideMargin:@"0"];

    AREmbeddedModelsViewController *worksVC = [[AREmbeddedModelsViewController alloc] init];
    [worksByArtistView addViewController:worksVC toParent:self withTopMargin:@"20" sideMargin:@"0"];

    worksVC.delegate = self;
    [worksVC setConstrainHeightAutomatically:YES];

    // TODO: Make this 3 column for iPad
    if (notificationItem.artworks.count > 1) {
        worksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout2Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
    } else {
        worksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout1Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
    }

    [worksVC appendItems:notificationItem.artworks];

    return worksByArtistView;
}

- (void)addNotificationItems:(NSArray *)items
{
    [items each:^(ARWorksForYouNotificationItem *item) {
        UIView *viewItem = [self viewBasedOnNotificationItem:item];
        [self.view.stackView addSubview:viewItem withTopMargin:@"30" sideMargin:@"20"];
    }];
}

- (void)getNextItemSet
{
    if (self.worksForYouNetworkModel.allDownloaded) {
        return;
    };

    __weak typeof(self) wself = self;
    [self.worksForYouNetworkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *notificationItems) {
        __strong typeof (wself) sself = wself;
        [sself addNotificationItems:notificationItems];
    } failure:nil];
}


- (void)markNotificationsAsRead
{
    // PUT /api/v1/me/notifications
    // will go in network model
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    if ((scrollView.contentSize.height - scrollView.contentOffset.y) < scrollView.bounds.size.height) {
        [self getNextItemSet];
    }
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
