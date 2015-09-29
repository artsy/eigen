#import "ARFairArtistViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARNavigationButton.h"
#import "ARShowViewController.h"
#import "AREmbeddedModelsViewController.h"
#import "ARFollowableNetworkModel.h"
#import "ARFollowableButton.h"
#import "ARFairMapViewController.h"
#import "ARFairShowMapper.h"
#import "ARFairMapPreview.h"
#import "ARArtworkSetViewController.h"
#import "ARFairMapPreviewButton.h"
#import "ARFairArtistNetworkModel.h"

typedef NS_ENUM(NSInteger, ARFairArtistViewIndex) {
    ARFairArtistTitle = 1,
    ARFairArtistSubtitle,
    ARFairArtistMapPreview,
    ARFairArtistFollow,
    ARFairArtistShows,
    ARFairArtistOnArtsy = ARFairArtistShows + 3 * 42, // we don't expect more than 42 shows
    ARFairArtistWhitespaceGobbler
};


@interface ARFairArtistViewController () <AREmbeddedModelsDelegate>
@property (nonatomic, strong, readonly) ORStackScrollView *view;
@property (nonatomic, strong, readonly) ARFollowableNetworkModel *followableNetwork;
@property (nonatomic, strong, readwrite) NSObject<FairArtistNeworkModel> *networkModel;
@property (nonatomic, strong, readonly) NSArray *partnerShows;
@property (nonatomic, strong, readwrite) Fair *fair;
@property (nonatomic, strong, readonly) NSString *header;
@end


@implementation ARFairArtistViewController

@dynamic view;

- (instancetype)initWithArtistID:(NSString *)artistID fair:(Fair *)fair
{
    self = [super init];
    _fair = fair;
    _artist = [[Artist alloc] initWithArtistID:artistID];
    _networkModel = [[ARFairArtistNetworkModel alloc] init];
    return self;
}

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] initWithStackViewClass:[ORTagBasedAutoStackView class]];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.stackView.bottomMarginHeight = 20;
    self.view.delegate = [ARScrollNavigationChief chief];

    @_weakify(self);
    [self.networkModel getArtistForArtistID:self.artist.artistID success:^(Artist *artist) {
        @_strongify(self);
        if (!self) { return; }
        self->_artist = artist;
        [self artistDidLoad];
    } failure:^(NSError *error) {
        @_strongify(self);
        [self artistDidLoad];
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

    @_weakify(self);
    [self.networkModel getShowsForArtistID:self.artist.artistID inFairID:self.fair.fairID success:^(NSArray *shows) {
        @_strongify(self);
        if (!self) { return; }

        self->_partnerShows = shows;

        [self addMapButton];
        [self addFollowButton];
        [self addArtistOnArtsyButton];

        [shows eachWithIndex:^(PartnerShow *show, NSUInteger index) {
            [self.view.stackView addGenericSeparatorWithSideMargin:@"40" tag:ARFairArtistShows + index * 3];
            [self addNavigationButtonForShowToStack:show tag:ARFairArtistShows + index * 3 + 1];
            [self addArtworksForShowToStack:show tag:ARFairArtistShows + index * 3 + 2];
        }];
    } failure:nil];

    CGFloat parentHeight = CGRectGetHeight(self.parentViewController.view.bounds) ?: CGRectGetHeight([UIScreen mainScreen].bounds);
    [self.view.stackView ensureScrollingWithHeight:parentHeight tag:ARFairArtistWhitespaceGobbler];
}

- (void)addArtistOnArtsyButton
{
    NSString *title = NSStringWithFormat(@"%@ on Artsy", self.artist.name);
    ARNavigationButton *button = [[ARNavigationButton alloc] initWithTitle:title];
    button.tag = ARFairArtistOnArtsy;
    button.onTap = ^(UIButton *tappedButton) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadArtistWithID:self.artist.artistID inFair:nil];
        [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
    };
    [self.view.stackView addSubview:button withTopMargin:@"20" sideMargin:@"40"];
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
    ARNavigationButton *button = [[ARSerifNavigationButton alloc] initWithTitle:show.partner.name andSubtitle:show.locationInFair withBorder:0];
    button.tag = tag;
    button.onTap = ^(UIButton *tappedButton) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadShow:show fair:self.fair];
        [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
    };
    [self.view.stackView addSubview:button withTopMargin:@"0" sideMargin:@"40"];
}

- (void)addSubtitle
{
    if (self.artist.nationality.length && self.artist.birthday.length) {
        UILabel *titleLabel = [[ARSerifLabel alloc] init];
        titleLabel.tag = ARFairArtistSubtitle;
        titleLabel.textColor = [UIColor artsyHeavyGrey];
        titleLabel.textAlignment = NSTextAlignmentCenter;
        titleLabel.text = [NSString stringWithFormat:@"%@ Born %@", self.artist.nationality, self.artist.birthday];
        [self.view.stackView addSubview:titleLabel withTopMargin:@"10" sideMargin:@"40"];
    }
}

- (void)addMapButton
{
    @_weakify(self);
    [self.fair getFairMaps:^(NSArray *maps) {
        @_strongify(self);

        Map *map = maps.firstObject;
        if (!map) { return; }

        // Reset follow button to have a top-margin of just 10 now that there will be a map.
        for (UIView *stackEntry in self.view.stackView.subviews) {
          if (stackEntry.tag == ARFairArtistFollow) {
            [self.view.stackView removeSubview:stackEntry];
            [self.view.stackView addSubview:stackEntry withTopMargin:@"10" sideMargin:@"40"];
            break;
          }
        }

        CGRect frame = CGRectMake(0, 0, CGRectGetWidth(self.view.frame), 85);
        ARFairMapPreviewButton *mapButton = [[ARFairMapPreviewButton alloc] initWithFrame:frame map:map];
        mapButton.tag = ARFairArtistMapPreview;
        [mapButton.mapPreview addShows:self.partnerShows animated:NO];
        [mapButton addTarget:self action:@selector(mapButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
        [self.view.stackView addSubview:mapButton withTopMargin:@"30" sideMargin:@"40"];
    }];
}

- (void)mapButtonTapped:(id)mapButtonTapped
{
    @_weakify(self);
    [self.fair getFairMaps:^(NSArray *maps) {
        @_strongify(self);
        ARFairMapViewController *viewController = [[ARSwitchBoard sharedInstance] loadMapInFair:self.fair title:self.header selectedPartnerShows:self.partnerShows];
        [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
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
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtist success:^(BOOL newUser) {
            [self toggleFollowArtist:sender];
        }];
        return;
    }
    self.followableNetwork.following = !self.followableNetwork.following;
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
