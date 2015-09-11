#import "ARFairViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARNavigationButtonsViewController.h"
#import "ARFairPostsViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARFairMapViewController.h"
#import "ARButtonWithImage.h"
#import "ARButtonWithCircularImage.h"
#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "ARFairSearchViewController.h"
#import "ARSearchFieldButton.h"
#import "UIViewController+SimpleChildren.h"
#import "ARShowViewController.h"
#import "ARArtworkSetViewController.h"
#import "ARGeneViewController.h"
#import "ARParallaxHeaderViewController.h"
#import "ARUserActivity.h"

NSString *const ARFairRefreshFavoritesNotification = @"ARFairRefreshFavoritesNotification";
NSString *const ARFairHighlightArtworkIDKey = @"ARFairHighlightArtworkIDKey";
NSString *const ARFairHighlightArtistIDKey = @"ARFairHighlightArtistIDKey";
NSString *const ARFairHighlightShowsKey = @"ARFairHighlightShowsKey";
NSString *const ARFairHighlightPartnersKey = @"ARFairHighlightPartnersKey";
NSString *const ARFairHighlightFocusMapKey = @"ARFairHighlightFocusMapKey";
NSString *const ARFairMapSetFavoritePartnersKey = @"ARFairMapSetFavoritePartnersKey";
NSString *const ARFairHighlightFavoritePartnersKey = @"ARFairHighlightFavoritePartnersKey";


@interface ARFairViewController () <ARBrowseFeaturedLinksCollectionViewControllerDelegate, ARFairPostsViewControllerDelegate, ARSearchFieldButtonDelegate, ARFairSearchViewControllerDelegate>

@property (nonatomic, strong) ORStackScrollView *stackView;
@property (nonatomic, strong) ARParallaxHeaderViewController *headerViewController;
@property (nonatomic, strong) ARSearchFieldButton *searchButton;
@property (nonatomic, strong) ARFairSearchViewController *searchVC;
@property (nonatomic, strong) ARNavigationButtonsViewController *primaryNavigationVC;
@property (nonatomic, strong) ARFairSectionViewController *categoryCollectionVC;
@property (nonatomic, strong) ARNavigationButtonsViewController *curatorVC;
@property (nonatomic, strong) ARNavigationButtonsViewController *editorialVC;
@property (nonatomic, strong) ARFairPostsViewController *fairPostsVC;
@property (nonatomic, strong) NSLayoutConstraint *searchConstraint;
@property (nonatomic, strong) ARUserActivity *userActivity;

@property (nonatomic, assign) BOOL hasMap;
@property (nonatomic, assign) BOOL displayingSearch;

@property (nonatomic, assign) BOOL hidesNavigationButtons;
@property (nonatomic, assign) BOOL hidesToolbarMenu;

@end


@implementation ARFairViewController

- (instancetype)initWithFair:(Fair *)fair
{
    return [self initWithFair:fair andProfile:nil];
}

- (instancetype)initWithFair:(Fair *)fair andProfile:(Profile *)profile
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _fair = fair;
    _fairProfile = profile;
    _animatesSearchBehavior = YES;

    RAC(self, hasMap) = [RACObserve(_fair, maps) map:^id(NSArray *maps) {
        return @(maps.count > 0);
    }];
    RAC(self, displayingSearch) = [RACObserve(self, searchVC) map:^id(id viewController) {
        return @(viewController != nil);
    }];
    RAC(self, hidesNavigationButtons) = RACObserve(self, displayingSearch);
    RAC(self, hidesToolbarMenu) = RACObserve(self, displayingSearch);

    return self;
}

- (void)viewDidLoad
{
    self.stackView = [[ORStackScrollView alloc] init];
    [self.view addSubview:self.stackView];
    [self.stackView alignToView:self.view];
    self.stackView.backgroundColor = [UIColor whiteColor];
    self.stackView.delegate = [ARScrollNavigationChief chief];

    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    @_weakify(self);

    [_fair updateFair:^{
        @_strongify(self);
        [self fairDidLoad];
    }];

    [super viewDidLoad];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (void)fairDidLoad
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];

    if ([self hasSufficientDataForParallaxHeader]) {
        self.headerViewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:self.stackView fair:self.fair profile:self.fairProfile];
        [self.stackView.stackView addSubview:self.headerViewController.view withTopMargin:nil sideMargin:nil];
    } else {
        [self.stackView.stackView addSerifPageTitle:self.fair.name subtitle:self.fair.ausstellungsdauer];
        [self.stackView.stackView addGenericSeparatorWithSideMargin:@"40"];
    }

    self.searchButton = [[ARSearchFieldButton alloc] init];
    self.searchButton.delegate = self;
    [self.stackView.stackView addSubview:self.searchButton withTopMargin:@"24" sideMargin:@"40"];

    self.primaryNavigationVC = [[ARNavigationButtonsViewController alloc] init];
    self.primaryNavigationVC.view.hidden = YES;
    [self.stackView.stackView addSubview:self.primaryNavigationVC.view withTopMargin:@"12" sideMargin:@"20"];

    self.editorialVC = [[ARNavigationButtonsViewController alloc] init];
    [(ORStackView *)self.editorialVC.view addPageTitleWithString:@"Fair Highlights"];
    [(ORStackView *)self.editorialVC.view addGenericSeparatorWithSideMargin:@"20"];
    self.editorialVC.view.hidden = YES;
    [self.stackView.stackView addSubview:self.editorialVC.view withTopMargin:@"60" sideMargin:@"20"];

    self.curatorVC = [[ARNavigationButtonsViewController alloc] init];
    [(ORStackView *)self.curatorVC.view addPageTitleWithString:@"Insider's Picks"];
    [(ORStackView *)self.curatorVC.view addGenericSeparatorWithSideMargin:@"20"];
    self.curatorVC.view.hidden = YES;
    [self.stackView.stackView addSubview:self.curatorVC.view withTopMargin:@"60" sideMargin:@"20"];

    BOOL (^displayOnMobile)(FeaturedLink *) = ^(FeaturedLink *link) {
        return link.displayOnMobile;
    };

    @_weakify(self)
        [self.fair getFairMaps:^(NSArray *maps) {
        [self.fair getOrderedSets:^(NSMutableDictionary *orderedSets) {
            for (OrderedSet *primarySet in orderedSets[@"primary"]) {
                [primarySet getItems:^(NSArray *items) {
                    @_strongify(self);
                    NSArray *buttonDescriptions = [[items ?: @[]
                        select:displayOnMobile]
                        map:^(FeaturedLink *link) {
                            return [self buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithImage class]];
                    }];

                    if (self.hasMap) {
                        NSMutableArray *mutableArray = [buttonDescriptions mutableCopy];
                        if (mutableArray.count > 0) {
                            mutableArray[1] = [self buttonDescriptionForMapLink];
                        } else {
                            mutableArray[0] = [self buttonDescriptionForMapLink];
                        }
                        buttonDescriptions = [NSArray arrayWithArray:mutableArray];
                    }

                    self.primaryNavigationVC.buttonDescriptions = buttonDescriptions;
                    self.primaryNavigationVC.view.hidden = NO;
                }];

                break;
            };

            for (OrderedSet *curatorSet in orderedSets[@"editorial"]) {
              [curatorSet getItems:^(NSArray *items) {
                @_strongify(self);
                self.editorialVC.buttonDescriptions = [[items select:displayOnMobile] map:^(FeaturedLink *link) {
                  return [self buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithImage class]];
                }];
                self.editorialVC.view.hidden = NO;
                if (self.editorialVC.buttonDescriptions.count == 0) {
                  [self.stackView.stackView removeSubview:self.editorialVC.view];
                }
              }];
              // TODO why always break after the first set and not just get the first set?
              break;
            }

            for (OrderedSet *curatorSet in orderedSets[@"curator"]) {
                [curatorSet getItems:^(NSArray *items) {
                    @_strongify(self);
                    self.curatorVC.buttonDescriptions = [[items select:displayOnMobile] map:^(FeaturedLink *link) {
                        return [self buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithCircularImage class]];
                    }];
                    self.curatorVC.view.hidden = NO;
                    if (self.curatorVC.buttonDescriptions.count == 0) {
                        [self.stackView.stackView removeSubview:self.curatorVC.view];
                    }
                }];

                break;
            }

        }];
        }];

    if (self.fair.organizer) {
        self.fairPostsVC = [[ARFairPostsViewController alloc] initWithFair:[self fair]];
        self.fairPostsVC.selectionDelegate = self;
        [self.stackView.stackView addSubview:self.fairPostsVC.view withTopMargin:@"60" sideMargin:@"20"];
    }

    [self.stackView.stackView addWhiteSpaceWithHeight:@"20"];
    [self viewDidLayoutSubviews];

    self.userActivity = [ARUserActivity activityWithFair:self.fair andProfile:self.fairProfile becomeCurrent:YES];
}

#pragma mark - Private

- (BOOL)hasSufficientDataForParallaxHeader
{
    return self.fair.bannerAddress.length > 0 || self.fairProfile.iconURL.length > 0;
}

- (NSDictionary *)buttonDescriptionForMapLink
{
    @_weakify(self);
    return @{
        ARNavigationButtonClassKey : [ARButtonWithImage class],
        ARNavigationButtonPropertiesKey : @{
            @keypath(ARButtonWithImage.new, title) : @"Map",
            @keypath(ARButtonWithImage.new, subtitle) : @"Find your way",
            @keypath(ARButtonWithImage.new, image) : [UIImage imageNamed:@"MapIcon"]
        },
        ARNavigationButtonHandlerKey : ^(ARButtonWithImage *button){
            @_strongify(self);
    ARFairMapViewController *viewController = [[ARSwitchBoard sharedInstance] loadMapInFair:self.fair];
    [self.navigationController pushViewController:viewController animated:YES];
}
}
;
}

- (NSDictionary *)buttonDescriptionForFeaturedLink:(FeaturedLink *)featuredLink buttonClass:(Class)buttonClass
{
    @_weakify(self);
    return @{
        ARNavigationButtonClassKey : buttonClass,
        ARNavigationButtonPropertiesKey : @{
            @keypath(ARButtonWithImage.new, title) : featuredLink.title ?: NSNull.null,
            @keypath(ARButtonWithImage.new, subtitle) : featuredLink.subtitle ?: NSNull.null,
            @keypath(ARButtonWithImage.new, imageURL) : featuredLink.smallSquareImageURL ?: NSNull.null,
            @keypath(ARButtonWithImage.new, targetURL) : [NSURL URLWithString:featuredLink.href] ?: NSNull.null
        },
        ARNavigationButtonHandlerKey : ^(UIButton *button){
            @_strongify(self);
    if ([button isKindOfClass:[ARButtonWithImage class]]) {
        ARButtonWithImage *buttonWithImage = (ARButtonWithImage *)button;
        [self buttonPressed:buttonWithImage];
    }
}
}
;
}

- (void)buttonPressed:(ARButtonWithImage *)buttonWithImage
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:buttonWithImage.targetURL fair:self.fair];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark ARBrowseFeaturedLinksCollectionViewDelegate

- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:featuredLink.href];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark ARFairPostsViewControllerDelegate

- (void)didSelectPost:(NSString *)postURL
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:postURL];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark - ARSearchFieldButtonDelegate

- (void)searchFieldButtonWasPressed:(ARSearchFieldButton *)sender
{
    NSAssert(self.searchVC == nil, @"Trying to replace existing search view controller. ");

    self.searchVC = [[ARFairSearchViewController alloc] initWithFair:self.fair];
    self.searchVC.delegate = self;
    self.searchVC.view.alpha = 0.0f;
    [self ar_addModernChildViewController:self.searchVC];
    [self.searchVC.view constrainWidthToView:self.view predicate:@"0@1000"];
    [self.searchVC.view constrainHeightToView:self.view predicate:@"0@1000"];
    [self.searchVC.view alignCenterWithView:self.view];
    self.stackView.scrollEnabled = NO;

    [UIView animateIf:self.animatesSearchBehavior duration:ARAnimationDuration:^{
        self.searchVC.view.alpha = 1.0;
    }];
}

#pragma mark - ARFairSearchViewControllerDelegate

- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    ARSwitchBoard *switchBoard = [ARSwitchBoard sharedInstance];
    if (result.model == [Artwork class]) {
        UIViewController *controller = [switchBoard loadArtworkWithID:result.modelID inFair:self.fair];
        [self.navigationController pushViewController:controller animated:YES];

    } else if (result.model == [Artist class]) {
        Artist *artist = [[Artist alloc] initWithArtistID:result.modelID];
        UIViewController *controller = [switchBoard loadArtistWithID:artist.artistID inFair:self.fair];
        [self.navigationController pushViewController:controller animated:YES];

    } else if (result.model == [Gene class]) {
        UIViewController *controller = [switchBoard loadGeneWithID:result.modelID];
        [self.navigationController pushViewController:controller animated:YES];

    } else if (result.model == [Profile class]) {
        UIViewController *controller = [ARSwitchBoard.sharedInstance routeProfileWithID:result.modelID];
        [self.navigationController pushViewController:controller animated:YES];

    } else if (result.model == [SiteFeature class]) {
        NSString *path = NSStringWithFormat(@"/feature/%@", result.modelID);
        UIViewController *controller = [[ARSwitchBoard sharedInstance] loadPath:path];
        [self.navigationController pushViewController:controller animated:YES];

    } else if (result.model == [PartnerShow class]) {
        PartnerShow *partnerShow = [[PartnerShow alloc] initWithShowID:result.modelID];
        UIViewController *controller = [switchBoard loadShowWithID:partnerShow.showID fair:self.fair];
        [self.navigationController pushViewController:controller animated:YES];
    }
}

- (void)cancelledSearch:(ARFairSearchViewController *)controller
{
    self.stackView.scrollEnabled = YES;
    [UIView animateIf:self.animatesSearchBehavior duration:ARAnimationDuration:^{
        self.searchVC.view.alpha = 0.0;
    } completion:^(BOOL finished) {
        [self ar_removeChildViewController:self.searchVC], self.searchVC = nil;
    }];
}

@end
