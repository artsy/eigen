#import "ARFairArtistViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARNavigationButton.h"
#import "ARFairShowViewController.h"
#import "AREmbeddedModelsViewController.h"
#import "ARFollowableNetworkModel.h"
#import "ARFollowableButton.h"
#import "ARFairMapViewController.h"
#import "ARFairShowMapper.h"
#import "ARFairMapPreview.h"
#import "ARArtworkSetViewController.h"

NS_ENUM(NSInteger, ARFairArtistViewIndex){
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
@property (nonatomic, strong, readonly) NSArray *partnerShows;
@property (nonatomic, strong, readwrite) Fair *fair;
@property (nonatomic, strong, readonly) NSString *header;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

@implementation ARFairArtistViewController

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

- (instancetype)initWithArtistID:(NSString *)artistID fair:(Fair *)fair
{
    self = [self init];
    _fair = fair;
    _artist = [[Artist alloc] initWithArtistID:artistID];
    return self;
}

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] initWithStackViewClass:[ORTagBasedAutoStackView class]];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.stackView.bottomMarginHeight = 20;
    self.view.delegate = [ARScrollNavigationChief chief];

    @weakify(self);
    [ArtsyAPI getArtistForArtistID:self.artist.artistID success:^(Artist *artist) {
        @strongify(self);
        if (!self) { return; }
        self->_artist = artist;
        [self artistDidLoad];
    } failure:^(NSError *error) {
        @strongify(self);
        [self artistDidLoad];
    }];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (void)artistDidLoad
{
    _header = NSStringWithFormat(@"%@ at %@", self.artist.name, self.fair.name);

    [self.view.stackView addPageTitleWithString:self.header tag:ARFairArtistTitle];

    [self addTitle];

    @weakify(self);
    [ArtsyAPI getShowsForArtistID:self.artist.artistID inFairID:self.fair.fairID success:^(NSArray *shows) {
        @strongify(self);
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
    button.onTap = ^(UIButton *tappedButton){
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadArtistWithID:self.artist.artistID inFair:nil];
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
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
    button.onTap = ^(UIButton *tappedButton){
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadShow:show fair:self.fair];
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
    };
    [self.view.stackView addSubview:button withTopMargin:@"0" sideMargin:@"40"];
}

- (void)addTitle
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
    @weakify(self);
    [self.fair getFairMaps:^(NSArray *maps) {
        @strongify(self);

        Map *map = maps.firstObject;
        if (!map) { return; }

        ARClearFlatButton *mapViewContainer = [[ARClearFlatButton alloc] init];
        [mapViewContainer setBorderColor:[UIColor artsyMediumGrey] forState:UIControlStateNormal];
        mapViewContainer.tag = ARFairArtistMapPreview;
        [mapViewContainer constrainHeight:@"85"];
        CGRect frame = CGRectMake(0, 0, CGRectGetWidth(self.view.frame), 85);
        ARFairMapPreview *mapPreview = [[ARFairMapPreview alloc] initWithFairMap:map andFrame:frame];
        [mapViewContainer addSubview:mapPreview];
        [mapPreview alignToView:mapViewContainer];
        [mapPreview setZoomScale:mapPreview.minimumZoomScale animated:NO];
        [mapPreview addShows:self.partnerShows animated:NO];
        [mapViewContainer addTarget:self action:@selector(mapButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
        [self.view.stackView addSubview:mapViewContainer withTopMargin:@"30" sideMargin:@"40"];
    }];
}

- (void)mapButtonTapped:(id)mapButtonTapped
{
    @weakify(self);
    [self.fair getFairMaps:^(NSArray * maps) {
        @strongify(self);
        ARFairMapViewController *viewController = [[ARSwitchBoard sharedInstance] loadMapInFair:self.fair title:self.header selectedPartnerShows:self.partnerShows];
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
    }];
}

- (void)addFollowButton
{
    ARFollowableButton *followButton = [[ARFollowableButton alloc] init];
    followButton.tag = ARFairArtistFollow;
    followButton.toFollowTitle = @"Follow Artist";
    followButton.toUnfollowTitle = @"Following Artist";
    [self.view.stackView addSubview:followButton withTopMargin:@"10" sideMargin:@"40"];
    [followButton addTarget:self action:@selector(toggleFollowArtist:) forControlEvents:UIControlEventTouchUpInside];

    _followableNetwork = [[ARFollowableNetworkModel alloc] initWithFollowableObject:self.artist];
    [followButton setupKVOOnNetworkModel:self.followableNetwork];
}

- (void)toggleFollowArtist:(id)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtist fromTarget:self selector:_cmd];
        return;
    }
    self.followableNetwork.following = !self.followableNetwork.following;
}

#pragma mark - Public Methods

- (BOOL)isFollowingArtist
{
    return self.followableNetwork.following;
}

-(void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtwork:controller.items[index] inFair:self.fair];
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

@end
