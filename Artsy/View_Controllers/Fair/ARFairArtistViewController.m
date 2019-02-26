#import "ARFairArtistViewController.h"

#import "Artist.h"
#import "Fair.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "ORStackView+ArtsyViews.h"
#import "ARAppConstants.h"
#import "ARNavigationButton.h"
#import "AREmbeddedModelsViewController.h"
#import "ARFollowableNetworkModel.h"
#import "ARFollowableButton.h"
#import "ARFairMapViewController.h"
#import "ARFairShowMapper.h"
#import "ARFairMapPreview.h"
#import "ARArtworkSetViewController.h"
#import "ARFairMapPreviewButton.h"
#import "ARFairArtistNetworkModel.h"
#import "ARFonts.h"
#import "User.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARSwitchboard+Eigen.h"
#import "ARScrollNavigationChief.h"
#import "ARAppNotificationsDelegate.h"

#import "UIDevice-Hardware.h"

#import <Artsy+UILabels/Artsy+UILabels.h>
#import <ORStackView/ORTagBasedAutoStackView.h>
#import <ORStackView/ORStackScrollView.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

#import "Artsy-Swift.h"

typedef NS_ENUM(NSInteger, ARFairArtistViewIndex) {
    ARFairArtistTitle = 1,
    ARFairArtistSubtitle,
    ARFairArtistMapPreview,
    ARFairArtistFollow,
    ARFairArtistShows,
    ARFairArtistOnArtsy = ARFairArtistShows + 3 * 42, // we don't expect more than 42 shows
    ARFairArtistWhitespaceGobbler
};

// This is a simple workaround to make the navigation buttons in ARNavigationButtonsViewControllers look mostly
// identical to what they were before.
@interface ARFairArtistNavigationButton : ARNavigationButton
@end
@implementation ARFairArtistNavigationButton
- (CGFloat)verticalPadding
{
    return 12;
}
@end


@interface ARFairArtistViewController () <AREmbeddedModelsViewControllerDelegate>
@property (nonatomic, strong, readonly) ORStackScrollView *view;
@property (nonatomic, strong, readonly) ARFollowableNetworkModel *followableNetwork;
@property (nonatomic, strong, readwrite) NSObject<FairArtistNeworkModel> *networkModel;
@property (nonatomic, strong, readonly) NSArray *partnerShows;
@property (nonatomic, strong, readwrite) Fair *fair;
@property (nonatomic, strong, readonly) NSString *header;
@end


@implementation ARFairArtistViewController

@dynamic view;

AR_VC_OVERRIDE_SUPER_DESIGNATED_INITIALIZERS;

- (instancetype)initWithArtistID:(NSString *)artistID fair:(Fair *)fair
{
    self = [super initWithNibName:nil bundle:nil];
    _fair = fair;
    _artist = [[Artist alloc] initWithArtistID:artistID];
    _networkModel = [[ARFairArtistNetworkModel alloc] init];
    return self;
}

- (void)loadView
{
    [self setupTaggedStackView];

    self.view.backgroundColor = [UIColor whiteColor];
    self.view.stackView.bottomMarginHeight = 20;

    __weak typeof(self) wself = self;
    [self.networkModel getArtistForArtistID:self.artist.artistID success:^(Artist *artist) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }
        sself->_artist = artist;
        [sself artistDidLoad];
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself artistDidLoad];
    }];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (void)artistDidLoad
{
    _header = NSStringWithFormat(@"%@ at %@", self.artist.name, self.fair.name ?: self.fair.fairID);

    [self.view.stackView addPageTitleWithString:self.header tag:ARFairArtistTitle];

    [self addSubtitle];

    __weak typeof(self) wself = self;
    [self.networkModel getShowsForArtistID:self.artist.artistID inFairID:self.fair.fairID success:^(NSArray *shows) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        sself->_partnerShows = shows;

        [sself addMapButton];
        [sself addFollowButton];
        [sself addArtistOnArtsyButton];

        [shows eachWithIndex:^(PartnerShow *show, NSUInteger index) {
            [sself.view.stackView addGenericSeparatorWithSideMargin:@"40" tag:ARFairArtistShows + index * 3];
            [sself addNavigationButtonForShowToStack:show tag:ARFairArtistShows + index * 3 + 1];
            [sself addArtworksForShowToStack:show tag:ARFairArtistShows + index * 3 + 2];
        }];
    } failure:nil];

    CGFloat parentHeight = CGRectGetHeight(self.parentViewController.view.bounds) ?: CGRectGetHeight([UIScreen mainScreen].bounds);
    [self.view.stackView ensureScrollingWithHeight:parentHeight tag:ARFairArtistWhitespaceGobbler];
}

- (void)addArtistOnArtsyButton
{
    NSString *title = NSStringWithFormat(@"%@ on Artsy", self.artist.name);

    NSArray *artistOnArtsyButtonDescription = @[@{ ARNavigationButtonClassKey : ARFairArtistNavigationButton.class,
                                                   ARNavigationButtonPropertiesKey : @{
                                                           ar_keypath(ARNavigationButton.new, title) : title
                                                           },
                                                   ARNavigationButtonHandlerKey : ^(UIButton *sender) {
                                                       UIViewController *viewController = [ARSwitchBoard.sharedInstance loadArtistWithID:self.artist.artistID inFair:nil];
                                                       [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
                                                   }
                                                   }];

    ARNavigationButtonsViewController* artistOnArstyNavigationButtonVC = [[ARNavigationButtonsViewController alloc] init];
    [artistOnArstyNavigationButtonVC addButtonDescriptions:artistOnArtsyButtonDescription unique:YES];
    artistOnArstyNavigationButtonVC.view.tag = ARFairArtistOnArtsy;
    [artistOnArstyNavigationButtonVC.view constrainHeight:@"39"];

    [self.view.stackView addViewController:artistOnArstyNavigationButtonVC toParent:self withTopMargin:@"20" sideMargin:@"40"];
}

- (void)addArtworksForShowToStack:(PartnerShow *)show tag:(NSInteger)tag
{
    ARArtworkMasonryLayout layout = show.artworks.count > 1 ? ARArtworkMasonryLayout2Column : ARArtworkMasonryLayout1Column;
    ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:layout andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
    AREmbeddedModelsViewController *artworkController = [[AREmbeddedModelsViewController alloc] init];
    artworkController.delegate = self;
    artworkController.activeModule = module;
    [artworkController appendItems:show.artworks];
    artworkController.constrainHeightAutomatically = YES;
    artworkController.view.tag = tag;

    [self.view.stackView addViewController:artworkController toParent:self withTopMargin:@"0" sideMargin:@"0"];
}

- (void)addNavigationButtonForShowToStack:(PartnerShow *)show tag:(NSInteger)tag
{
    NSArray *showButtonDescription = @[@{ ARNavigationButtonClassKey : ARFairArtistNavigationButton.class,
                                          ARNavigationButtonPropertiesKey : @{
                                                  ar_keypath(ARNavigationButton.new, title) : show.partner.name,
                                                  ar_keypath(ARNavigationButton.new, subtitle) : show.locationInFair
                                                  },
                                          ARNavigationButtonHandlerKey : ^(UIButton *sender) {
                                              UIViewController *viewController = [ARSwitchBoard.sharedInstance loadShow:show fair:self.fair];
                                              [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
                                          }
                                          }];

    ARNavigationButtonsViewController* showNavigationButtonVC = [[ARNavigationButtonsViewController alloc] init];
    [showNavigationButtonVC addButtonDescriptions:showButtonDescription unique:YES];
    showNavigationButtonVC.view.tag = tag;

    [self.view.stackView addViewController:showNavigationButtonVC toParent:self withTopMargin:@"0" sideMargin:@"40"];
}

- (void)addSubtitle
{
    if (self.artist.nationality.length && self.artist.birthday.length) {
        UILabel *titleLabel = [[ARSerifLabel alloc] init];
        titleLabel.tag = ARFairArtistSubtitle;
        titleLabel.textColor = [UIColor artsyGraySemibold];
        titleLabel.textAlignment = NSTextAlignmentCenter;
        titleLabel.text = [NSString stringWithFormat:@"%@ Born %@", self.artist.nationality, self.artist.birthday];
        [self.view.stackView addSubview:titleLabel withTopMargin:@"10" sideMargin:@"40"];
    }
}

- (void)addMapButton
{
    __weak typeof(self) wself = self;
    [self.fair getFairMaps:^(NSArray *maps) {
        __strong typeof (wself) sself = wself;

        Map *map = maps.firstObject;
        if (!map) { return; }

        // Reset follow button to have a top-margin of just 10 now that there will be a map.
        for (UIView *stackEntry in sself.view.stackView.subviews) {
          if (stackEntry.tag == ARFairArtistFollow) {
            [sself.view.stackView removeSubview:stackEntry];
            [sself.view.stackView addSubview:stackEntry withTopMargin:@"10" sideMargin:@"40"];
            break;
          }
        }

        CGRect frame = CGRectMake(0, 0, CGRectGetWidth(sself.view.frame), 85);
        ARFairMapPreviewButton *mapButton = [[ARFairMapPreviewButton alloc] initWithFrame:frame map:map];
        mapButton.tag = ARFairArtistMapPreview;
        [mapButton.mapPreview addShows:sself.partnerShows animated:NO];
        [mapButton addTarget:self action:@selector(mapButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
        [sself.view.stackView addSubview:mapButton withTopMargin:@"30" sideMargin:@"40"];
    }];
}

- (void)mapButtonTapped:(id)mapButtonTapped
{
    __weak typeof(self) wself = self;
    [self.fair getFairMaps:^(NSArray *maps) {
        __strong typeof (wself) sself = wself;
        ARFairMapViewController *viewController = [ARSwitchBoard.sharedInstance loadMapInFair:sself.fair title:sself.header selectedPartnerShows:sself.partnerShows];
        [sself.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
    }];
}

- (void)addFollowButton
{
    ARFollowableButton *followButton = [[ARFollowableButton alloc] init];
    followButton.tag = ARFairArtistFollow;
    followButton.toFollowTitle = @"Follow Artist";
    followButton.toUnfollowTitle = @"Following Artist";
    // The top-margin will get reduced to just 10 if and when a map gets added in `addMapButton`.
    [self.view.stackView addSubview:followButton withTopMargin:@"30" sideMargin:@"40"];
    [followButton addTarget:self action:@selector(toggleFollowArtist:) forControlEvents:UIControlEventTouchUpInside];

    _followableNetwork = [[ARFollowableNetworkModel alloc] initWithFollowableObject:self.artist];
    [followButton setupKVOOnNetworkModel:self.followableNetwork];
}

- (void)toggleFollowArtist:(id)sender
{
    self.followableNetwork.following = !self.followableNetwork.following;

    // If we're now following the artist, show push notification prompt if needed
    if (self.followableNetwork.following) {
        ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
        [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextArtistFollow];
    }
}

#pragma mark - Public Methods

- (BOOL)isFollowingArtist
{
    return self.followableNetwork.following;
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtwork:controller.items[index] inFair:self.fair];
    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

@end
