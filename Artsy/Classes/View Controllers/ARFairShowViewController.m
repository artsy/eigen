#import "ARFairShowViewController.h"
#import "ARImagePageViewController.h"
#import "ARFollowableNetworkModel.h"
#import "ARFollowableButton.h"
#import "AREmbeddedModelsViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARActionButtonsView.h"
#import "ARSharingController.h"
#import "ARWhitespaceGobbler.h"
#import "ARFairMapViewController.h"
#import "ARFairMapPreview.h"
#import "ARArtworkSetViewController.h"
#import "ARShowNetworkModel.h"

NS_ENUM(NSInteger, ARFairShowViewIndex){
    ARFairShowViewHeader = 1,
    ARFairShowViewActionButtons,
    ARFairShowViewPartnerLabel,
    ARFairShowViewPartnerLabelFollowButton,
    ARFairShowViewPartnerName,
    ARFairShowViewBoothLocation,
    ARFairShowViewMapPreview,
    ARFairShowViewFollowPartner,
    ARFairShowViewWhitespaceAboveArtworks,
    ARFairShowViewArtworks
};

static const NSInteger ARFairShowMaximumNumberOfHeadlineImages = 5;

@interface ARFairShowViewController () <AREmbeddedModelsDelegate, ARArtworkMasonryLayoutProvider>
@property (nonatomic, strong, readonly) ORStackScrollView *view;
@property (nonatomic, strong, readonly) ARImagePageViewController *imagePageViewController;
@property (nonatomic, strong, readonly) ARFollowableNetworkModel *followableNetwork;
@property (nonatomic, strong, readonly) AREmbeddedModelsViewController *showArtworksViewController;
@property (nonatomic, strong, readonly) ARActionButtonsView *actionButtonsView;
@property (nonatomic, strong, readwrite) Fair *fair;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;

@property (nonatomic, strong) NSLayoutConstraint *followButtonWidthConstraint;
@property (nonatomic, strong) NSLayoutConstraint *headerImageHeightConstraint;
@property (nonatomic, strong) ARShowNetworkModel *showNetworkModel;

@end

@implementation ARFairShowViewController

+ (CGFloat)followButtonWidthForInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return UIInterfaceOrientationIsPortrait(interfaceOrientation) ? 315 : 281;
}

+ (CGFloat)headerImageHeightForInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if ([UIDevice isPhone]) {
        return 213;
    } else {
        return UIInterfaceOrientationIsPortrait(interfaceOrientation) ? 413 : 511;
    }
}

-(instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

- (instancetype)initWithShowID:(NSString *)showID fair:(Fair *)fair
{
    PartnerShow *show = [[PartnerShow alloc] initWithShowID:showID];
    return [self initWithShow:show fair:fair];
}

- (instancetype)initWithShow:(PartnerShow *)show fair:(Fair *)fair
{
    self = [self init];

    _show = show;
    _fair = fair ? fair : show.fair;

    return self;
}

- (NSString *)sideMarginPredicate
{
    return [UIDevice isPad] ? @"100" : @"40";
}

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] initWithStackViewClass:[ORTagBasedAutoStackView class]];
    self.view.backgroundColor = [UIColor blackColor];
    self.view.stackView.backgroundColor = [UIColor whiteColor];
    self.view.delegate = [ARScrollNavigationChief chief];
}

- (void)fairDidLoad
{
    [self addImagePagingViewToStack];
    [self getShowHeaderImages];
    [self addActionButtonsToStack];
    [self addPartnerLabelAndFollowButtonToStack];
    [self addPartnerMetadataToStack];
    [self addMapPreview];
    [self addFairArtworksToStack];

    [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];

    // Create a "be full screen with a low priority" constraint
    CGFloat height = CGRectGetHeight(self.parentViewController.parentViewController.view.bounds);
    NSString *heightConstraint = [NSString stringWithFormat:@">=%.0f@800", height -19];
    [self.view.stackView constrainHeight:heightConstraint];

    [self setConstraintConstantsForOrientation:[UIApplication sharedApplication].statusBarOrientation];
}

- (void)addActionButtonsToStack
{
    _actionButtonsView = [[ARActionButtonsView alloc] init];
    self.actionButtonsView.tag = ARFairShowViewActionButtons;
    [self.view.stackView addSubview:self.actionButtonsView withTopMargin:@"20" sideMargin:[self sideMarginPredicate]];

    NSMutableArray *descriptions = [NSMutableArray array];

    [descriptions addObject:@{
        ARActionButtonImageKey: @"Artwork_Icon_Share",
        ARActionButtonHandlerKey: ^(ARCircularActionButton *sender) {
            NSURL *imageURL = nil;
            if (self.imagePageViewController.images.count) {
                imageURL = [(Image *)self.imagePageViewController.images[0] urlForThumbnailImage];
            }
            [ARSharingController shareObject:self.show withThumbnailImageURL:imageURL];
        }
    }];

    if (self.show.hasMapLocation && self.fair) {
        [descriptions addObject:self.descriptionForMapButton];
    }

    self.actionButtonsView.actionButtonDescriptions = descriptions;
}

- (NSDictionary *)descriptionForMapButton
{
    @weakify(self);
    return @{
        ARActionButtonImageKey: @"MapButtonAction",
        ARActionButtonHandlerKey: ^(ARCircularActionButton *sender) {
            @strongify(self);
            [self handleMapButtonPress:sender];
        }
    };
}

- (void)handleMapButtonPress:(ARCircularActionButton *)sender
{
    @weakify(self);
    [self.showNetworkModel getFairMaps:^(NSArray *maps) {
        @strongify(self);
        ARFairMapViewController *viewController = [[ARSwitchBoard sharedInstance] loadMapInFair:self.fair title:self.show.title selectedPartnerShows:@[self.show]];
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
    }];
}

- (void)addPartnerLabelAndFollowButtonToStack
{
    UIView *partnerLabel = [self partnerLabel];
    UIView *followButton = [self followButton];

    if ([UIDevice isPhone]) {
        [self.view.stackView addSubview:partnerLabel withTopMargin:@"0" sideMargin:[self sideMarginPredicate]];
        if (followButton) {
            [self.view.stackView addSubview:followButton withTopMargin:@"32" sideMargin:[self sideMarginPredicate]];
        }
    } else {
        UIView *containerView = [[UIView alloc] init];
        containerView.tag = ARFairShowViewPartnerLabelFollowButton;


        [containerView addSubview:partnerLabel];
        [containerView addSubview:followButton];

        [containerView constrainHeight:@"40"];
        [partnerLabel alignTop:@"0" bottom:@"0" toView:containerView];
        if (followButton) {
            [partnerLabel alignLeading:@"0" trailing:nil toView:containerView];
            [followButton alignLeading:nil trailing:@"0" toView:containerView];
            [followButton alignTop:@"0" bottom:@"0" toView:containerView];
            [UIView alignAttribute:NSLayoutAttributeRight ofViews:@[partnerLabel] toAttribute:NSLayoutAttributeLeft ofViews:@[followButton] predicate:nil];
            CGFloat followButtonWidth = [[self class] followButtonWidthForInterfaceOrientation:self.interfaceOrientation];
            self.followButtonWidthConstraint = [[followButton constrainWidth:@(followButtonWidth).stringValue] firstObject];
        } else {
            [partnerLabel alignLeading:@"0" trailing:@"0" toView:containerView];
        }

        [self.view.stackView addSubview:containerView withTopMargin:@"20" sideMargin:[self sideMarginPredicate]];
    }
}

- (void)viewDidLoad{
    [super viewDidLoad];

    [self ar_presentIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];

    @weakify(self);
    [self.showNetworkModel getShowInfo:^(PartnerShow *show) {
        @strongify(self);
        if (!self) { return; }

        [self.show mergeValuesForKeysFromModel:show];

        if (!self.fair) {
            self->_fair = show.fair;
        }

        [self fairDidLoad];
    } failure:^(NSError *error) {
        @strongify(self);

        [self fairDidLoad];
    }];
}

- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
    [self setConstraintConstantsForOrientation:toInterfaceOrientation];
}

- (void)setConstraintConstantsForOrientation:(UIInterfaceOrientation)orientation
{
    self.followButtonWidthConstraint.constant = [[self class] followButtonWidthForInterfaceOrientation:orientation];
    self.headerImageHeightConstraint.constant = [[self class] headerImageHeightForInterfaceOrientation:orientation];
}

- (UILabel *)partnerLabel
{
    ARItalicsSerifLabelWithChevron *partnerLabel = [[ARItalicsSerifLabelWithChevron alloc] init];
    partnerLabel.font = [UIFont sansSerifFontWithSize:16];
    partnerLabel.tag = ARFairShowViewPartnerLabel;
    BOOL showChevron = (self.show.partner.profileID && self.show.partner.defaultProfilePublic);

    partnerLabel.chevronDelta = 6;
    partnerLabel.text = self.show.partner.name.uppercaseString;
    partnerLabel.chevronHidden = !showChevron;

    if (showChevron) {
        partnerLabel.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openArtworkPartner:)];
        [partnerLabel addGestureRecognizer:tapGesture];
    }

    [partnerLabel constrainHeight:@"40"];
    return partnerLabel;
}

- (void)addPartnerMetadataToStack
{
    ARItalicsSerifLabelWithChevron *partnerName = [[ARItalicsSerifLabelWithChevron alloc] init];
    partnerName.tag = ARFairShowViewPartnerName;
    partnerName.font = [UIFont serifFontWithSize:16];
    partnerName.text = self.show.fair ? self.show.fair.name : self.show.name;
    [self.view.stackView addSubview:partnerName withTopMargin:@"12" sideMargin:[self sideMarginPredicate]];

    if (self.show.fair && !self.fair){
        partnerName.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openShowFair:)];
        [partnerName addGestureRecognizer:tapGesture];
        partnerName.chevronHidden = NO;
    } else {
        partnerName.chevronHidden = YES;
    }

    ARSerifLabel *boothLocation = [[ARSerifLabel alloc] init];
    boothLocation.tag = ARFairShowViewBoothLocation;
    boothLocation.textColor = [UIColor blackColor];
    boothLocation.font = [UIFont serifFontWithSize:14];
    boothLocation.text = self.show.ausstellungsdauerAndLocation;
    [self.view.stackView addSubview:boothLocation withTopMargin:@"6" sideMargin:[self sideMarginPredicate]];
}

- (void)openShowFair:(id)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance routeProfileWithID:self.show.fair.organizer.profileID];
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)addFairArtworksToStack
{
    // We use a view that takes up the required whitespace to hit the full height

    // TODO: this should only load more artworks on scroll (like favorites)

    __block ARWhitespaceGobbler *whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    whitespaceGobbler.backgroundColor = [UIColor whiteColor];
    whitespaceGobbler.tag = ARFairShowViewWhitespaceAboveArtworks;
    [self.view.stackView addSubview:whitespaceGobbler withTopMargin:nil sideMargin:nil];

    ARArtworkMasonryLayout layout;
    if ([UIDevice isPad]) {
        layout = [self masonryLayoutForPadWithOrientation:[[UIApplication sharedApplication] statusBarOrientation]];
    } else {
        layout = ARArtworkMasonryLayout2Column;
    }

    ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:layout andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
    module.layoutProvider = self;
    _showArtworksViewController = [[AREmbeddedModelsViewController alloc] init];
    self.showArtworksViewController.view.tag = ARFairShowViewArtworks;
    self.showArtworksViewController.delegate = self;
    self.showArtworksViewController.activeModule = module;
    self.showArtworksViewController.constrainHeightAutomatically = YES;
    self.showArtworksViewController.showTrailingLoadingIndicator = YES;
    [self.view.stackView addSubview:self.showArtworksViewController.view withTopMargin:@"0" sideMargin:nil];

    @weakify(self);
    [self getArtworksAtPage:1 onArtworks:^(NSArray * artworks) {
        @strongify(self);
        if (artworks.count > 0) {
            if (whitespaceGobbler) {
                [self.view.stackView removeSubview:whitespaceGobbler];
                [self.showArtworksViewController appendItems:artworks];
                whitespaceGobbler = nil;
            } else {
                [self.showArtworksViewController appendItems:artworks];
            }
        } else {
            self.showArtworksViewController.showTrailingLoadingIndicator = NO;
            [self.showArtworksViewController.view invalidateIntrinsicContentSize];
        }
    }];
}

- (void)getArtworksAtPage:(NSInteger)page onArtworks:(void (^)(NSArray *))onArtworks
{
    NSParameterAssert(onArtworks);

    @weakify(self);
    [self.showNetworkModel getArtworksAtPage:page success:^(NSArray *artworks) {
        @strongify(self);
        onArtworks(artworks);
        if (artworks.count > 0) {
            [self getArtworksAtPage:page + 1 onArtworks:onArtworks];
        }
    } failure:nil];
}

- (UIView *)followButton
{
    if(!self.show.partner.defaultProfilePublic) return nil;

    ARFollowableButton *followButton = [[ARFollowableButton alloc] init];
    followButton.tag = ARFairShowViewFollowPartner;
    followButton.toFollowTitle = @"Follow Gallery";
    followButton.toUnfollowTitle = @"Following Gallery";
    [followButton addTarget:self action:@selector(toggleFollowShow:) forControlEvents:UIControlEventTouchUpInside];

    Profile *profile = [[Profile alloc] initWithProfileID:self.show.partner.profileID];
    _followableNetwork = [[ARFollowableNetworkModel alloc] initWithFollowableObject:profile];
    [followButton setupKVOOnNetworkModel:self.followableNetwork];

    return followButton;
}

- (void)addMapPreview
{
    @weakify(self);
    [self.showNetworkModel getFairMaps:^(NSArray *maps) {
        @strongify(self);

        Map *map = maps.firstObject;
        if (!map) { return; }

        UIButton *mapViewContainer = [[UIButton alloc] init];
        mapViewContainer.tag = ARFairShowViewMapPreview;
        CGRect frame = CGRectMake(0, 0, CGRectGetWidth(self.view.frame), 150);

        ARFairMapPreview *mapPreview = [[ARFairMapPreview alloc] initWithFairMap:map andFrame:frame];
        [mapViewContainer addSubview:mapPreview];
        [mapPreview alignToView:mapViewContainer];
        [mapViewContainer constrainHeight:@"150"];

        [mapPreview setZoomScale:mapPreview.minimumZoomScale animated:self.shouldAnimate];
        [mapPreview addShow:self.show animated:self.shouldAnimate];
        [mapViewContainer addTarget:self action:@selector(handleMapButtonPress:) forControlEvents:UIControlEventTouchUpInside];
        [self.view.stackView addSubview:mapViewContainer withTopMargin:@"20" sideMargin:@"20"];
    }];
}

- (void)toggleFollowShow:(id)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteProfile fromTarget:self selector:_cmd];
        return;
    }

    self.followableNetwork.following = !self.followableNetwork.following;
}

- (void)addImagePagingViewToStack
{
    _imagePageViewController = [[ARImagePageViewController alloc] init];
    self.imagePageViewController.imageContentMode = UIViewContentModeScaleAspectFill;
    self.imagePageViewController.view.tag = ARFairShowViewHeader;
    [self.view.stackView addSubview:self.imagePageViewController.view withTopMargin:@"0" sideMargin:@"0"];
    CGFloat headerImageHeight = [[self class] headerImageHeightForInterfaceOrientation:self.interfaceOrientation];
    self.headerImageHeightConstraint = [[self.imagePageViewController.view constrainHeight:@(headerImageHeight).stringValue] firstObject];
}

- (void)getShowHeaderImages
{
    [self.showNetworkModel getFairBoothArtworksAndInstallShots:self.show gotInstallImages:^(NSArray *images) {
        if (images.count == 1) {
            [self setSingleInstallShot:images.firstObject];
        } else {
            self.imagePageViewController.images = [images take:ARFairShowMaximumNumberOfHeadlineImages];
        }

    } gotArtworks:^(NSArray *images) {
        if (self.imagePageViewController.images.count) return;
        [self setSingleInstallShot:images.firstObject];

    } noImages:^{
        Image *blankImage = [Image modelWithJSON:@{ @"image_url" : @"" }];
        [self setSingleInstallShot:blankImage];
    }];
}

- (void)setSingleInstallShot:(Image *)image
{
    self.imagePageViewController.images = @[image];
    self.imagePageViewController.view.userInteractionEnabled = NO;
    [self.imagePageViewController setHidesPageIndicators:YES];
}

- (void)openArtworkPartner:(UITapGestureRecognizer *)gestureRecognizer
{
    Partner *partner = self.show.partner;
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPartnerWithID:partner.profileID];
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

-(BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

-(NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

#pragma mark - DI

- (ARShowNetworkModel *)showNetworkModel
{
    if (_showNetworkModel == nil) {
        _showNetworkModel = [[ARShowNetworkModel alloc] initWithFair:self.fair show:self.show];
    }

    return _showNetworkModel;
}

#pragma mark - AREmbeddedModelsDelegate

-(void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController {
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.showArtworksViewController.items inFair:self.fair atIndex:index];
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

#pragma mark - Public Methods

- (BOOL)isFollowing
{
    return self.followableNetwork.isFollowing;
}

- (NSDictionary *)dictionaryForAnalytics {
    return @{
        @"partner_show_id" : self.show.showID ?: @"",
        @"partner_id" : self.show.partner.partnerID ?: @"",
        @"profile_id" : self.show.partner.profileID ?: @"",
        @"fair_id" : self.fair.fairID ?: @""
    };
}

#pragma mark - ARArtworkMasonryLayoutProvider
- (ARArtworkMasonryLayout)masonryLayoutForPadWithOrientation:(UIInterfaceOrientation)orientation
{
    return UIInterfaceOrientationIsLandscape(orientation) ? ARArtworkMasonryLayout3Column : ARArtworkMasonryLayout2Column;
}

@end