// MARK: Formatter Exempt

#import "ARFairViewController.h"

#import "Artist.h"
#import "Artwork.h"
#import "Fair.h"
#import "FeaturedLink.h"
#import "Gene.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "ORStackView+ArtsyViews.h"
#import "ARNavigationButtonsViewController.h"
#import "ARFairPostsViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARFairMapViewController.h"
#import "ARButtonWithImage.h"
#import "ARButtonWithCircularImage.h"
#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "ARFairSearchViewController.h"
#import "UIViewController+Search.h"
#import "ARSearchFieldButton.h"
#import "UIViewController+SimpleChildren.h"
#import "ARShowViewController.h"
#import "ARArtworkSetViewController.h"
#import "ARParallaxHeaderViewController.h"
#import "SiteFeature.h"
#import "UIViewController+ARUserActivity.h"
#import "OrderedSet.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARScrollNavigationChief.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"
#import "SearchResult.h"

#import "UIDevice-Hardware.h"

#import <ORStackView/ORStackScrollView.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <ReactiveObjC/ReactiveObjC.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

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
    __weak typeof(self) wself = self;

    [_fair updateFair:^{
        __strong typeof (wself) sself = wself;
        [sself fairDidLoad];
    }];

    [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated;
{
    [super viewDidAppear:animated];
    self.ar_userActivityEntity = [[ARFairSpotlightMetadataProvider alloc] initWithFair:self.fair profile:self.fairProfile];
}

- (void)viewWillDisappear:(BOOL)animated;
{
    [super viewWillDisappear:animated];
    [self.userActivity invalidate];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
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

    __weak typeof(self) wself = self;

    [self.fair getFairMaps:^(NSArray *maps) {
        [self.fair getOrderedSets:^(NSMutableDictionary *orderedSets) {
            for (OrderedSet *primarySet in orderedSets[@"primary"]) {
                [primarySet getItems:^(NSArray *items) {
                    __strong typeof (wself) sself = wself;

                    NSArray *buttonDescriptions = [[items ?: @[]
                        select:displayOnMobile]
                        map:^(FeaturedLink *link) {
                            return [sself buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithImage class]];
                    }];

                    if (sself.hasMap) {
                        NSMutableArray *mutableArray = [buttonDescriptions mutableCopy];
                        if (mutableArray.count > 0) {
                            mutableArray[1] = [sself buttonDescriptionForMapLink];
                        } else {
                            mutableArray[0] = [sself buttonDescriptionForMapLink];
                        }
                        buttonDescriptions = [NSArray arrayWithArray:mutableArray];
                    }

                    sself.primaryNavigationVC.buttonDescriptions = buttonDescriptions;
                    sself.primaryNavigationVC.view.hidden = NO;
                }];

                break;
            };

            for (OrderedSet *curatorSet in orderedSets[@"editorial"]) {
              [curatorSet getItems:^(NSArray *items) {
                __strong typeof (wself) sself = wself;
                sself.editorialVC.buttonDescriptions = [[items select:displayOnMobile] map:^(FeaturedLink *link) {
                  return [sself buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithImage class]];
                }];
                sself.editorialVC.view.hidden = NO;
                if (sself.editorialVC.buttonDescriptions.count == 0) {
                  [sself.stackView.stackView removeSubview:sself.editorialVC.view];
                }
              }];
              // TODO why always break after the first set and not just get the first set?
              break;
            }

            for (OrderedSet *curatorSet in orderedSets[@"curator"]) {
                [curatorSet getItems:^(NSArray *items) {
                    __strong typeof (wself) sself = wself;
                    sself.curatorVC.buttonDescriptions = [[items select:displayOnMobile] map:^(FeaturedLink *link) {
                        return [sself buttonDescriptionForFeaturedLink:link buttonClass:[ARButtonWithCircularImage class]];
                    }];
                    sself.curatorVC.view.hidden = NO;
                    if (sself.curatorVC.buttonDescriptions.count == 0) {
                        [sself.stackView.stackView removeSubview:self.curatorVC.view];
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

    [self ar_setDataLoaded];
}

#pragma mark - Private

- (BOOL)hasSufficientDataForParallaxHeader
{
    return self.fair.bannerAddress.length > 0 || self.fairProfile.iconURL.length > 0;
}

- (NSDictionary *)buttonDescriptionForMapLink
{
    __weak typeof(self) wself = self;
    return @{
        ARNavigationButtonClassKey : [ARButtonWithImage class],
        ARNavigationButtonPropertiesKey : @{
            ar_keypath(ARButtonWithImage.new, title) : @"Map",
            ar_keypath(ARButtonWithImage.new, subtitle) : @"Find your way",
            ar_keypath(ARButtonWithImage.new, image) : [UIImage imageNamed:@"MapIcon"]
        },
        ARNavigationButtonHandlerKey : ^(ARButtonWithImage *button){
            __strong typeof(wself) sself = wself;
            ARFairMapViewController *viewController = [ARSwitchBoard.sharedInstance loadMapInFair:self.fair];
            [sself.navigationController pushViewController:viewController animated:YES];
       }
    };
}

- (NSDictionary *)buttonDescriptionForFeaturedLink:(FeaturedLink *)featuredLink buttonClass:(Class)buttonClass
{
    __weak typeof(self) wself = self;
    return @{
        ARNavigationButtonClassKey : buttonClass,
        ARNavigationButtonPropertiesKey : @{
            ar_keypath(ARButtonWithImage.new, title) : featuredLink.title ?: NSNull.null,
            ar_keypath(ARButtonWithImage.new, subtitle) : featuredLink.subtitle ?: NSNull.null,
            ar_keypath(ARButtonWithImage.new, imageURL) : featuredLink.smallSquareImageURL ?: NSNull.null,
            ar_keypath(ARButtonWithImage.new, targetURL) : [NSURL URLWithString:featuredLink.href] ?: NSNull.null
        },
        ARNavigationButtonHandlerKey : ^(UIButton *button){
            __strong typeof(wself) sself = wself;
            if ([button isKindOfClass:[ARButtonWithImage class]]) {
                ARButtonWithImage *buttonWithImage = (ARButtonWithImage *)button;
                [sself buttonPressed:buttonWithImage];
            }
        }
    };
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
    [self presentSearchResult:result fair:self.fair];
}

- (void)cancelledSearch:(ARFairSearchViewController *)controller
{
    self.stackView.scrollEnabled = YES;
    [UIView animateIf:self.animatesSearchBehavior duration:ARAnimationDuration:^{
        self.searchVC.view.alpha = 0.0;
    } completion:^(BOOL finished) {
        [self ar_removeChildViewController:self.searchVC];
        self.searchVC = nil;
    }];
}

@end
