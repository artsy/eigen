#import "ARLogger.h"
#import "ARArtistViewController.h"

#import "Artist.h"
#import "ARAppConstants.h"
#import "ARNavigationButton.h"
#import "ARSwitchView.h"
#import "ARSwitchView+Artist.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARHeartButton.h"
#import "ARSharingController.h"
#import "ARArtistBiographyViewController.h"
#import "ARPostsViewController.h"
#import "ARRelatedArtistsViewController.h"
#import "AREmbeddedModelsViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARArtworkSetViewController.h"
#import "ARTextView.h"
#import "ARArtistNetworkModel.h"
#import "ARSpotlight.h"
#import "User.h"
#import "ARTheme.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARNetworkErrorManager.h"
#import "ARTrialController.h"
#import "ARScrollNavigationChief.h"

#import "UIViewController+ARUserActivity.h"
#import "UIDevice-Hardware.h"
#import "Artsy-Swift.h"

#import <ORStackView/ORTagBasedAutoStackView.h>
#import <ORStackView/ORStackScrollView.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

static const NSInteger ARMinimumArtworksFor2Column = 5;

typedef NS_ENUM(NSInteger, ARArtistViewIndex) {
    ARArtistViewArtistName = 1,
    ARArtistViewArtistInfo,
    ARArtistViewBioTextPad,
    ARArtistViewActionButtons,
    ARArtistViewArtworksToggle,
    ARArtistViewArtworks,
    ARArtistViewBioButtonPhone,
    ARArtistViewRelatedTitle,
    ARArtistViewRelatedArtists,
    ARArtistViewRelatedPosts,
    ARArtistViewWhitepsaceGobbler
};

typedef NS_ENUM(NSInteger, ARArtistArtworksDisplayMode) {
    ARArtistArtworksDisplayAll,
    ARArtistArtworksDisplayForSale
};

// TODO: Add ARFollowableNetworkModel for following status


@interface ARArtistViewController () <UIScrollViewDelegate, AREmbeddedModelsViewControllerDelegate, ARPostsViewControllerDelegate, ARSwitchViewDelegate>
@property (nonatomic, strong) ORStackScrollView *view;
@property (nonatomic, assign) enum ARArtistArtworksDisplayMode displayMode;

@property (nonatomic, strong) id<ARArtistNetworkModelable> networkModel;

@property (nonatomic, assign) NSInteger allArtworksLastPage;
@property (nonatomic, assign) NSInteger forSaleArtworksLastPage;

@property (nonatomic, assign) BOOL isGettingAllArtworks;
@property (nonatomic, assign) BOOL isGettingForSaleArtworks;

@property (nonatomic, strong) NSMutableOrderedSet *allArtworks;
@property (nonatomic, strong) NSOrderedSet *forSaleFilteredArtworks;

@property (nonatomic, strong) UILabel *infoLabel;
@property (nonatomic, strong) UILabel *nameLabel;
@property (nonatomic, strong) UILabel *relatedTitle;

@property (nonatomic, strong) ARSwitchView *switchView;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworkVC;
@property (nonatomic, strong) NSLayoutConstraint *artworksVCConstraint;
@property (nonatomic, strong) ARRelatedArtistsViewController *relatedArtistsVC;

@property (nonatomic, strong) ARPostsViewController *postsVC;

@end


@implementation ARArtistViewController

@dynamic view;

- (instancetype)initWithArtistID:(NSString *)artistID
{
    self = [self init];

    _artist = [[Artist alloc] initWithArtistID:artistID];
    _allArtworks = [[NSMutableOrderedSet alloc] init];
    _forSaleFilteredArtworks = [[NSMutableOrderedSet alloc] init];

    return self;
}

- (void)loadView
{
    [super loadView];

    [self setupTaggedStackView];

    self.view.scrollsToTop = NO;
    self.view.scrollEnabled = YES;
    self.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    self.view.stackView.bottomMarginHeight = 20;

    [self.view.stackView constrainHeightToView:self.view predicate:@">=-20"];
}

- (void)updateArtistInfo
{
    __weak typeof(self) wself = self;
    [self.networkModel getArtistInfoWithSuccess:^(Artist *artist) {

        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        if (!artist) {
            ARErrorLog(@"Failed to update artist information: missing artist");
            return;
        }

        sself->_artist = artist;
        [sself updateWithArtist];
        [sself artistIsReady];

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        ARErrorLog(@"Could not update artist information: %@", error.localizedDescription);
        [sself setIsGettingArtworks:NO displayMode:self.displayMode];
    }];
}

- (NSString *)sideMarginString
{
    return [UIDevice isPad] ? @"100" : @"40";
}

- (void)viewDidLoad
{
    self.nameLabel = [self.view.stackView addPageTitleWithString:@"" tag:ARArtistViewArtistName];
    self.infoLabel = [ARThemedFactory labelForBodyText];
    self.infoLabel.textAlignment = NSTextAlignmentCenter;
    [self.infoLabel constrainHeight:@"16"];
    self.infoLabel.tag = ARArtistViewArtistInfo;
    [self.view.stackView addSubview:self.infoLabel withTopMargin:@"4" sideMargin:[self sideMarginString]];

    UIView *actionsWrapper = [[UIView alloc] init];
    UIButton *shareButton = [[ARCircularActionButton alloc] initWithImageName:@"Artwork_Icon_Share"];
    [shareButton addTarget:self action:@selector(shareArtist:) forControlEvents:UIControlEventTouchUpInside];
    [actionsWrapper addSubview:shareButton];

    ARHeartButton *favoriteButton = [[ARHeartButton alloc] init];
    [favoriteButton addTarget:self action:@selector(toggleFollowingArtist:) forControlEvents:UIControlEventTouchUpInside];

    [self.networkModel getFollowState:^(ARHeartStatus status) {
        [favoriteButton setStatus:status animated:ARPerformWorkAsynchronously];
    } failure:^(NSError *error) {
        [favoriteButton setStatus:ARHeartStatusNo];
    }];

    [actionsWrapper addSubview:favoriteButton];
    [favoriteButton alignCenterXWithView:actionsWrapper predicate:@"-30"];
    [shareButton alignCenterXWithView:actionsWrapper predicate:@"30"];
    [UIView alignTopAndBottomEdgesOfViews:@[ actionsWrapper, favoriteButton, shareButton ]];
    actionsWrapper.tag = ARArtistViewActionButtons;
    [self.view.stackView addSubview:actionsWrapper withTopMargin:@"20" sideMargin:@"40"];

    self.switchView = [[ARSwitchView alloc] initWithButtonTitles:[ARSwitchView artistButtonTitlesArray]];
    [self.switchView constrainWidth:@"280"];
    self.switchView.delegate = self;
    self.switchView.tag = ARArtistViewArtworksToggle;
    [self.view.stackView addSubview:self.switchView withTopMargin:@"20" sideMargin:NSStringWithFormat(@">=%@", [self sideMarginString])];

    self.artworkVC = [[AREmbeddedModelsViewController alloc] init];
    self.artworkVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:[self masonryLayout]];
    self.artworkVC.delegate = self;
    self.artworkVC.view.tag = ARArtistViewArtworks;
    [self.view.stackView addViewController:self.artworkVC toParent:self withTopMargin:@"20" sideMargin:@"0"];

    self.relatedTitle = [ARThemedFactory labelForViewSubHeaders];
    self.relatedTitle.text = @"RELATED ARTISTS";
    self.relatedTitle.tag = ARArtistViewRelatedTitle;
    self.relatedTitle.alpha = 0;
    [self.view.stackView addSubview:self.relatedTitle withTopMargin:@"48" sideMargin:[self sideMarginString]];

    self.relatedArtistsVC = [[ARRelatedArtistsViewController alloc] init];
    self.relatedArtistsVC.view.tag = ARArtistViewRelatedArtists;
    [self.view.stackView addViewController:self.relatedArtistsVC toParent:self withTopMargin:@"20" sideMargin:@"0"];

    self.postsVC = [[ARPostsViewController alloc] init];
    self.postsVC.delegate = self;
    self.postsVC.view.tag = ARArtistViewRelatedPosts;

    CGFloat parentHeight = CGRectGetHeight(self.parentViewController.view.bounds) ?: CGRectGetHeight([UIScreen mainScreen].bounds);
    [self.view.stackView ensureScrollingWithHeight:parentHeight tag:ARArtistViewWhitepsaceGobbler];

    [self getRelatedArtists];
    [self getRelatedPosts];

    [self updateArtistInfo];

    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    // TODO Figure out why on iOS 9 the view never gets autoresized when opened from a search result.
    //      The parentViewController check is really only for tests, which currently still run on iOS 8 and thus work as expected.
    if (self.parentViewController) {
        self.view.frame = self.parentViewController.view.bounds;
    }

    // Ensure that the related artists VC has the correct dimensions to lay out its content BEFORE it appears.
    [self.relatedArtistsVC.view layoutIfNeeded];
    [self setArtworksHeight];
}

- (void)viewDidAppear:(BOOL)animated;
{
    [super viewDidAppear:animated];
    self.ar_userActivityEntity = self.artist;
}

- (void)viewWillDisappear:(BOOL)animated;
{
    [super viewWillDisappear:animated];
    [self.userActivity invalidate];
}

- (void)updateWithArtist
{
    [self.nameLabel setText:self.artist.name];

    self.infoLabel.text = self.artist.nationality;

    if (self.artist.nationality.length && self.artist.years.length) {
        self.infoLabel.text = [NSString stringWithFormat:@"%@, %@", self.artist.nationality, self.artist.years];
    }

    NSString *artworks = [NSStringWithFormat(@"%@ %@", self.artist.publishedArtworksCount ?: @(0), @"Artworks") uppercaseString];
    NSString *artworksForSale = [NSStringWithFormat(@"%@ %@", self.artist.forSaleArtworksCount ?: @(0), @"For Sale") uppercaseString];

    [self.switchView setTitle:artworks forButtonAtIndex:ARSwitchViewArtistButtonIndex];
    [self.switchView setTitle:artworksForSale forButtonAtIndex:ARSwitchViewForSaleButtonIndex];

    [self.view setNeedsLayout];
}

- (void)artistIsReady
{
    NSInteger artworkCount = self.artist.publishedArtworksCount.integerValue;

    if (self.artist.forSaleArtworksCount.integerValue == 0) {
        [self.switchView disableForSale];
    }

    if (artworkCount == 0) {
        [self prepareForNoArtworks];
    } else {
        ARArtworkMasonryModule *module = (ARArtworkMasonryModule *)self.artworkVC.activeModule;
        ARArtworkMasonryLayout newLayout = [self masonryLayout];
        if (newLayout != module.layout) {
            ARArtworkMasonryModule *newModule = [ARArtworkMasonryModule masonryModuleWithLayout:newLayout andStyle:AREmbeddedArtworkPresentationStyleArtworkOnly];
            self.artworkVC.activeModule = newModule;
            [self setArtworksHeight];
            [self.view setNeedsUpdateConstraints];
            [self.view updateConstraintsIfNeeded];
            [self.artworkVC.collectionView reloadData];
        }
        [self getMoreArtworks];
    }

    if (self.artist.blurb.length > 0) {
        if ([UIDevice isPad]) {
            ARTextView *bioView = [[ARTextView alloc] init];
            [bioView setMarkdownString:self.artist.blurb];
            bioView.tag = ARArtistViewBioTextPad;
            [self.view.stackView addSubview:bioView withTopMargin:@"20" sideMargin:[self sideMarginString]];
        } else {
            ARNavigationButton *bioButton = [[ARNavigationButton alloc] initWithTitle:@"Biography"];
            [bioButton addTarget:self action:@selector(loadBioViewController) forControlEvents:UIControlEventTouchUpInside];
            bioButton.tag = ARArtistViewBioButtonPhone;
            [self.view.stackView addSubview:bioButton withTopMargin:@"20" sideMargin:[self sideMarginString]];
        }
    }

    [self ar_setDataLoaded];
}

- (void)prepareForNoArtworks
{
    self.switchView.hidden = YES;
    [self.switchView constrainHeight:@"5"];
    self.artworksVCConstraint.constant = 60;

    UILabel *noWorksLabel = [ARThemedFactory labelForBodyText];
    noWorksLabel.textAlignment = NSTextAlignmentCenter;
    noWorksLabel.text = [NSString stringWithFormat:@"There are no works by %@ on Artsy yet.", self.artist.name];
    [self.artworkVC.view addSubview:noWorksLabel];
    [noWorksLabel constrainWidthToView:self.artworkVC.view predicate:@"-80"];
    [noWorksLabel alignTopEdgeWithView:self.artworkVC.view predicate:@"0"];
    [noWorksLabel alignCenterXWithView:self.artworkVC.view predicate:@"0"];

    [self.artworkVC ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
}

- (void)setArtworksHeight
{
    CGFloat height = [self.artworkVC.activeModule intrinsicSize].height;
    if (!self.artworksVCConstraint) {
        self.artworksVCConstraint = [self.artworkVC.view constrainHeight:@(height).stringValue];
    } else {
        self.artworksVCConstraint.constant = height;
    }
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self setArtworksHeight];
}

- (void)toggleFollowingArtist:(ARHeartButton *)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtist success:^(BOOL newUser) {
            [self toggleFollowingArtist:sender];
        }];
        return;
    }

    BOOL hearted = !sender.hearted;
    [sender setHearted:hearted animated:ARPerformWorkAsynchronously];

    Artist *artist = self.artist;
    [self.networkModel setFavoriteStatus:hearted
        success:^(id _) {
        [ARSpotlight addToSpotlightIndex:hearted entity:artist];
        }
        failure:^(NSError *error) {
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow artist."];
        [sender setHearted:!hearted animated:ARPerformWorkAsynchronously];
    }];
}

#pragma mark - Switch Navigation

- (void)allArtworksTapped
{
    [self switchToDisplayMode:ARArtistArtworksDisplayAll animated:ARPerformWorkAsynchronously];
}

- (void)forSaleOnlyArtworksTapped
{
    [self switchToDisplayMode:ARArtistArtworksDisplayForSale animated:ARPerformWorkAsynchronously];
}

- (void)switchToDisplayMode:(ARArtistArtworksDisplayMode)displayMode animated:(BOOL)animated
{
    ARArtistArtworksDisplayMode oldDisplayMode = self.displayMode;
    self.displayMode = displayMode;


    NSOrderedSet *artworks = [self artworksForDisplayMode:displayMode];
    if (![artworks isEqualToOrderedSet:[self artworksForDisplayMode:oldDisplayMode]]) {
        [UIView animateTwoStepIf:ARPerformWorkAsynchronously && animated duration:ARAnimationDuration * 1.5:^{
            self.artworkVC.view.alpha = 0;
        } midway:^{
            self.artworkVC.collectionView.contentOffset = CGPointZero;
            // TODO Clearing this array and then appending truly violates SRP and probably needs to be looked into why
            // it needed to work this way.
            self.artworkVC.activeModule.items = @[];

            if (artworks.count > 0) {
                [self.artworkVC appendItems:artworks.array];
            } else {
                [self.artworkVC ar_presentIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
            }

            // Ensure that the user can never get to see any stale cells from the previous tab. E.g. if we ever
            // introduce a regression that would make the spinner be removed before artworks for this tab were ever
            // loaded. See https://github.com/artsy/eigen/issues/623.
            [self.artworkVC.collectionView reloadData];

            [self getMoreArtworks];
            self.artworkVC.view.alpha = 1;

        } completion:^(BOOL finished) {
            if (artworks.count > 0) {
                [self.artworkVC ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
            }
            [self.view setNeedsUpdateConstraints];
        }];
    }
}

- (void)checkForAdditionalArtworksToFillView
{
    if ([self.artworkVC currentContentFillsView] == NO) {
        [self getMoreArtworks];
    }
}

- (void)getMoreArtworks
{
    if (![self shouldFetchArtworks]) {
        return;
    }

    ARArtistArtworksDisplayMode displayMode = self.displayMode;
    [self setIsGettingArtworks:YES displayMode:displayMode];

    NSInteger lastPage = [self lastPageForDisplayMode:displayMode];
    BOOL showingForSale = (displayMode == ARArtistArtworksDisplayForSale);
    NSDictionary *params = (showingForSale) ? @{ @"filter[]" : @"for_sale" } : nil;

    __weak typeof(self) wself = self;
    [self.networkModel getArtistArtworksAtPage:lastPage + 1 params:params success:^(NSArray *artworks) {
        __strong typeof (wself) sself = wself;
        [sself.artworkVC ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
        [sself handleFetchedArtworks:artworks displayMode:self.displayMode];
        [sself checkForAdditionalArtworksToFillView];
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        ARErrorLog(@"Could not get Artist Artworks: %@", error.localizedDescription);
        [sself.artworkVC ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
        [sself setIsGettingArtworks:NO displayMode:displayMode];
    }];
}

- (void)setIsGettingArtworks:(BOOL)isGetting displayMode:(ARArtistArtworksDisplayMode)displayMode
{
    if (displayMode == ARArtistArtworksDisplayAll) {
        self.isGettingAllArtworks = isGetting;

    } else if (displayMode == ARArtistArtworksDisplayForSale) {
        self.isGettingForSaleArtworks = isGetting;
    }
}

- (void)handleFetchedArtworks:(NSArray *)artworks displayMode:(ARArtistArtworksDisplayMode)displayMode
{
    [self setIsGettingArtworks:NO displayMode:displayMode];

    if (!artworks.count) {
        return;
    }

    if (displayMode == ARArtistArtworksDisplayAll) {
        self.allArtworksLastPage++;

    } else if (displayMode == ARArtistArtworksDisplayForSale) {
        self.forSaleArtworksLastPage++;
    }

    [self.allArtworks addObjectsFromArray:artworks];

    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"forSale == YES"];
    NSOrderedSet *filteredResults = [self.allArtworks filteredOrderedSetUsingPredicate:predicate];
    self.forSaleFilteredArtworks = filteredResults;

    if (displayMode == self.displayMode) {
        [self.artworkVC appendItems:artworks];
    }

    [self.view layoutSubviews];
}

#pragma mark - datasource

- (NSOrderedSet *)artworksForDisplayMode:(ARArtistArtworksDisplayMode)displayMode
{
    switch (displayMode) {
        case ARArtistArtworksDisplayAll:
            return self.allArtworks;

        case ARArtistArtworksDisplayForSale:
            return self.forSaleFilteredArtworks;
    }

    return nil;
}

- (BOOL)shouldFetchArtworks
{
    BOOL displayMode = self.displayMode;

    if ([self isFetchingDataForDisplayMode:displayMode]) {
        return NO;
    }

    // At this point we have an artist stub, so grab with the
    // artist ID.
    if (self.artist.name == nil) {
        return YES;
    }

    NSOrderedSet *artworks = [self artworksForDisplayMode:displayMode];
    NSInteger maxCount = 0;

    if (displayMode == ARArtistArtworksDisplayAll) {
        maxCount = [self.artist.publishedArtworksCount integerValue];

    } else if (displayMode == ARArtistArtworksDisplayForSale) {
        maxCount = [self.artist.forSaleArtworksCount integerValue];
    }

    return ([artworks count] < maxCount);
}

- (BOOL)isFetchingDataForDisplayMode:(ARArtistArtworksDisplayMode)displayMode
{
    BOOL fetching = NO;
    if (displayMode == ARArtistArtworksDisplayAll) {
        fetching = self.isGettingAllArtworks;
    } else if (displayMode == ARArtistArtworksDisplayForSale) {
        fetching = self.isGettingForSaleArtworks;
    }

    return fetching;
}

- (NSInteger)lastPageForDisplayMode:(ARArtistArtworksDisplayMode)displayMode
{
    if (displayMode == ARArtistArtworksDisplayAll) {
        return self.allArtworksLastPage;
    } else if (displayMode == ARArtistArtworksDisplayForSale) {
        return self.forSaleArtworksLastPage;
    }

    return 0;
}

- (void)shareArtist:(UIButton *)sender
{
    ARSharingController *sharingController = [ARSharingController sharingControllerWithObject:self.artist
                                                                            thumbnailImageURL:self.artist.squareImageURL];
    [sharingController presentActivityViewControllerFromView:sender];
}

- (void)loadBioViewController
{
    ARArtistBiographyViewController *artistBioVC = [[ARArtistBiographyViewController alloc] initWithArtist:self.artist];
    [self.navigationController pushViewController:artistBioVC animated:ARPerformWorkAsynchronously];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.artist) {
        return @{ @"artist" : self.artist.artistID,
                  @"type" : @"artist" };
    }

    return nil;
}

- (BOOL)artworksShouldBeSingleRow
{
    // in case we have some artworks but no artist info
    NSInteger count = MAX([self.artist.publishedArtworksCount integerValue], [self artworksForDisplayMode:self.displayMode].count);
    return count < ARMinimumArtworksFor2Column;
}

- (ARArtworkMasonryLayout)masonryLayout
{
    if ([self artworksShouldBeSingleRow]) {
        return ARArtworkMasonryLayout1Row;
    } else {
        return ARArtworkMasonryLayout2Row;
    }
}

- (void)getRelatedArtists
{
    __weak typeof(self) wself = self;
    [self.networkModel getRelatedArtists:^(NSArray *artists) {
        __strong typeof (wself) sself = wself;
        if (artists.count > 0 ) {
            [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
                sself.relatedTitle.alpha = 1;
            }];
            artists = [artists filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"publishedArtworksCount != 0"]];
            sself.relatedArtistsVC.relatedArtists = artists;
        }
    }];
}

- (void)getRelatedPosts
{
    __weak typeof(self) wself = self;
    [self.networkModel getRelatedPosts:^(NSArray *posts) {
        __strong typeof (wself) sself = wself;
        if (posts.count > 0) {
            sself.postsVC.posts = posts;
            [sself.view.stackView addSubview:sself.postsVC.view withTopMargin:@"20" sideMargin:@"40"];
        }
    }];
}

#pragma mark - AREmbeddedModelsViewControllerDelegate

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.artworkVC.items inFair:nil atIndex:index];

    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)embeddedModelsViewControllerDidScrollPastEdge:(AREmbeddedModelsViewController *)controller
{
    [self getMoreArtworks];
}

#pragma mark - ARPostsViewControllerDelegate

- (void)postViewController:(ARPostsViewController *)postViewController shouldShowViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

#pragma mark - ARSwitchViewDelegate


- (void)switchView:(ARSwitchView *)switchView didPressButtonAtIndex:(NSInteger)buttonIndex animated:(BOOL)animated
{
    if (buttonIndex == ARSwitchViewArtistButtonIndex) {
        [self allArtworksTapped];
    } else if (buttonIndex == ARSwitchViewForSaleButtonIndex) {
        [self forSaleOnlyArtworksTapped];
    }
}

#pragma mark - DI

- (ARArtistNetworkModel *)networkModel
{
    return _networkModel ?: [[ARArtistNetworkModel alloc] initWithArtist:self.artist];
}


@end
