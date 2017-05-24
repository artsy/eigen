#import "ARFavoritesViewController.h"

#import "Artist.h"
#import "ARAppConstants.h"
#import "ARArtworkMasonryModule.h"
#import "UIViewController+SimpleChildren.h"
#import "AREmbeddedModelsViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "ARHeartButton.h"
#import "ARArtworkSetViewController.h"
#import "ARArtworkFavoritesNetworkModel.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARArtistFavoritesNetworkModel.h"
#import "ARSwitchView+Favorites.h"
#import "ARFavoriteItemModule.h"
#import "ARArtistViewController.h"
#import "ARGeneViewController.h"
#import "ARFavoriteItemViewCell.h"
#import "ARFonts.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARScrollNavigationChief.h"
#import "ARDispatchManager.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

#import "UIDevice-Hardware.h"

@import Artsy_UILabels;
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARFavoritesViewController () <AREmbeddedModelsViewControllerDelegate, UIScrollViewDelegate, ARSwitchViewDelegate, ARArtworkMasonryLayoutProvider>

@property (nonatomic, strong, readonly) AREmbeddedModelsViewController *embeddedItemsVC;
@property (nonatomic, strong, readonly) UILabel *noFavoritesInfoLabel;
@property (nonatomic, strong, readonly) ORStackView *headerContainerView;
@property (nonatomic, weak) UIView *emptyStateView;

@property (nonatomic, strong, readwrite) ARFavoritesNetworkModel *activeNetworkModel;

@property (nonatomic, strong, readonly) ARArtworkFavoritesNetworkModel *artworkFavoritesNetworkModel;
@property (nonatomic, strong, readonly) ARArtworkMasonryModule *artworksModule;
@property (nonatomic, strong, readonly) ARArtistFavoritesNetworkModel *artistFavoritesNetworkModel;
@property (nonatomic, strong, readonly) ARFavoriteItemModule *artistsModule;
@property (nonatomic, strong, readonly) ARGeneFavoritesNetworkModel *geneFavoritesNetworkModel;
@property (nonatomic, strong, readonly) ARFavoriteItemModule *genesModule;

@property (nonatomic, strong) dispatch_queue_t artworkPageQueue;
@property (nonatomic, assign) BOOL artworkPageQueueSuspended;

@end


@implementation ARFavoritesViewController

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _embeddedItemsVC = [[AREmbeddedModelsViewController alloc] init];
    return self;
}

- (void)dealloc
{
    [self.collectionView setDelegate:nil];
    [self resumePageQueue];
}

- (void)resumePageQueue
{
    if (self.artworkPageQueue && self.artworkPageQueueSuspended) {
        dispatch_resume(self.artworkPageQueue);
        _artworkPageQueueSuspended = NO;
    }
}

- (void)suspendPageQueue
{
    if (self.artworkPageQueue && !self.artworkPageQueueSuspended) {
        dispatch_suspend(self.artworkPageQueue);
        _artworkPageQueueSuspended = YES;
    }
}

#pragma mark - UIViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.embeddedItemsVC.delegate = self;
    self.embeddedItemsVC.showTrailingLoadingIndicator = YES;

    _headerContainerView = [[ORStackView alloc] init];
    [self.headerContainerView addPageTitleWithString:@"FAVORITES"];
    [self.headerContainerView addWhiteSpaceWithHeight:[UIDevice isPad] ? @"42" : @"28"];
    self.headerContainerView.bottomMarginHeight = 23;
    ARSwitchView *switchView = [[ARSwitchView alloc] initWithButtonTitles:[ARSwitchView favoritesButtonsTitlesArray]];
    switchView.delegate = self;

    // Switch view width should be divisible by the number of items (in this case 3) for consistent rendering.

    NSString *switchViewWidth = [UIDevice isPad] ? @"399" : @"279";
    [switchView constrainWidth:switchViewWidth];

    [self.headerContainerView addSubview:switchView withTopMargin:@"0"];
    [switchView alignCenterXWithView:self.headerContainerView predicate:@"0"];

    self.embeddedItemsVC.headerView = self.headerContainerView;
    self.embeddedItemsVC.headerHeight = self.headerHeight;

    [self ar_addModernChildViewController:self.embeddedItemsVC];
    [self.embeddedItemsVC.view alignToView:self.view];

    self.collectionView.showsVerticalScrollIndicator = YES;

    if (!self.artworkPageQueue) {
        self.artworkPageQueue = dispatch_queue_create("Favorite Artworks Pages", NULL);
    } else {
        [self resumePageQueue];
    }

    _artworkFavoritesNetworkModel = [[ARArtworkFavoritesNetworkModel alloc] init];
    _artistFavoritesNetworkModel = [[ARArtistFavoritesNetworkModel alloc] init];
    _geneFavoritesNetworkModel = [[ARGeneFavoritesNetworkModel alloc] init];

    if (ARIsRunningInDemoMode) {
        _artworkFavoritesNetworkModel.useSampleFavorites = YES;
        _artistFavoritesNetworkModel.useSampleFavorites = YES;
        _geneFavoritesNetworkModel.useSampleFavorites = YES;
    }

    ARArtworkMasonryLayout layout = [self masonryLayoutForSize:self.view.frame.size];
    _artworksModule = [ARArtworkMasonryModule masonryModuleWithLayout:layout andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
    _artworksModule.layoutProvider = self;
    _artistsModule = [[ARFavoriteItemModule alloc] init];
    _genesModule = [[ARFavoriteItemModule alloc] init];

    self.displayMode = ARFavoritesDisplayModeArtworks;

    self.embeddedItemsVC.scrollDelegate = [ARScrollNavigationChief chief];

    [self.embeddedItemsVC.headerView updateConstraints];
    self.collectionView.scrollsToTop = YES;
    [self updateCellSizeForSize:self.view.frame.size layout:_genesModule.moduleLayout];
    [self updateCellSizeForSize:self.view.frame.size layout:_artistsModule.moduleLayout];
}

- (UICollectionView *)collectionView
{
    return self.embeddedItemsVC.collectionView;
}

- (CGFloat)headerHeight
{
    return [UIDevice isPad] ? 193 : 127;
}

- (ARArtworkMasonryLayout)masonryLayoutForSize:(CGSize)size
{
    if ([UIDevice isPad]) {
        return (size.width > size.height) ? ARArtworkMasonryLayout4Column : ARArtworkMasonryLayout3Column;
    } else {
        return ARArtworkMasonryLayout2Column;
    }
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self updateCellSizeForSize:size layout:self.artistsModule.moduleLayout];
    [self updateCellSizeForSize:size layout:self.genesModule.moduleLayout];

    [self.embeddedItemsVC.collectionView.collectionViewLayout invalidateLayout];
}

- (void)updateCellSizeForSize:(CGSize)size layout:(UICollectionViewFlowLayout *)layout
{
    UIEdgeInsets insets = layout.sectionInset;
    CGSize itemSize = [ARFavoriteItemViewCell sizeForCellwithSize:size insets:insets];
    layout.itemSize = itemSize;
}

- (void)viewWillDisappear:(BOOL)animated
{
    [self suspendPageQueue];
    self.embeddedItemsVC.scrollDelegate = nil;

    [super viewWillDisappear:animated];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.embeddedItemsVC.collectionView.collectionViewLayout invalidateLayout];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self.view layoutIfNeeded];
    [self updateView];
}

- (void)hideEmptyState
{
    if (self.emptyStateView) {
        self.emptyStateView.hidden = YES;
        self.embeddedItemsVC.headerHeight = self.headerHeight;
    }
}

- (void)showEmptyState
{
    if (self.emptyStateView) {
        self.emptyStateView.hidden = NO;
    } else {
        CGFloat emptyStateWidth = 270;
        UIView *emptyStateView = [[UIView alloc] init];
        _emptyStateView = emptyStateView;

        UILabel *infoLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:4];
        infoLabel.font = [UIFont serifFontWithSize:20];
        infoLabel.textAlignment = NSTextAlignmentCenter;
        infoLabel.numberOfLines = 3;
        infoLabel.text = @"Favorite artworks, artists and categories by tapping the heart icon throughout Artsy.";
        [emptyStateView addSubview:infoLabel];
        _noFavoritesInfoLabel = infoLabel;
        [infoLabel alignTopEdgeWithView:emptyStateView predicate:[UIDevice isPad] ? @"40" : @"0"];
        [infoLabel alignLeading:@"0" trailing:@"0" toView:emptyStateView];
        [infoLabel constrainWidthToView:emptyStateView predicate:@"0"];
        infoLabel.preferredMaxLayoutWidth = emptyStateWidth;

        ARHeartButton *heartButton = [[ARHeartButton alloc] init];
        [emptyStateView addSubview:heartButton];
        [heartButton constrainTopSpaceToView:infoLabel predicate:@"20"];
        [heartButton alignCenterXWithView:emptyStateView predicate:@"0"];
        [heartButton addTarget:self action:@selector(tappedNoArtworksHeart:) forControlEvents:UIControlEventTouchUpInside];
        [heartButton setStatus:ARHeartStatusNo];
        [emptyStateView alignBottomEdgeWithView:heartButton predicate:@"0"];

        [self.headerContainerView addSubview:emptyStateView withTopMargin:@"40"];
        [emptyStateView constrainWidth:@(emptyStateWidth).stringValue];
        [emptyStateView alignCenterXWithView:self.headerContainerView predicate:@"0"];
    }

    [self.headerContainerView layoutIfNeeded];
    self.embeddedItemsVC.headerHeight = CGRectGetHeight(self.headerContainerView.frame);
}

- (void)tappedNoArtworksHeart:(ARHeartButton *)button
{
    if (button.hearted) {
        self.noFavoritesInfoLabel.text = @"Favorite artworks, artists and categories by tapping the heart icon throughout Artsy.";
    } else {
        self.noFavoritesInfoLabel.text = @"You got it!\nNow go favorite some artworks, artists and categories.";
    }

    BOOL hearted = !button.hearted;
    [button setHearted:hearted animated:YES];
}

- (void)setDisplayMode:(ARFavoritesDisplayMode)displayMode
{
    _displayMode = displayMode;

    if (displayMode == ARFavoritesDisplayModeArtworks) {
        self.embeddedItemsVC.activeModule = self.artworksModule;
        self.activeNetworkModel = self.artworkFavoritesNetworkModel;
    } else if (displayMode == ARFavoritesDisplayModeArtists) {
        self.embeddedItemsVC.activeModule = self.artistsModule;
        self.activeNetworkModel = self.artistFavoritesNetworkModel;
    } else if (displayMode == ARFavoritesDisplayModeGenes) {
        self.embeddedItemsVC.activeModule = self.genesModule;
        self.activeNetworkModel = self.geneFavoritesNetworkModel;
    }
}

- (void)updateView
{
    BOOL allDownloaded = self.activeNetworkModel.allDownloaded;
    self.embeddedItemsVC.showTrailingLoadingIndicator = !allDownloaded;
    [self.collectionView reloadData];
    if (!allDownloaded) {
        [self checkContentSize];
    } else if (self.embeddedItemsVC.activeModule.items.count <= 0) {
        [self showEmptyState];
    }
}

- (void)checkContentSize
{
    CGFloat contentHeight = self.collectionView.contentSize.height;
    CGFloat frameHeight = self.collectionView.frame.size.height;
    // This will only be true the first time a tab is loaded. Get enough items to fill the height of the view.
    if (contentHeight < frameHeight) {
        [self getNextItemSet];
    }
}

- (void)getNextItemSet
{
    ARFavoritesNetworkModel *networkModel = self.activeNetworkModel;
    ARModelCollectionViewModule *module = self.embeddedItemsVC.activeModule;
    if (networkModel.allDownloaded) {
        return;
    };
    __weak typeof(self) wself = self;
    ar_dispatch_on_queue(self.artworkPageQueue, ^{
        [self.activeNetworkModel getFavorites:^(NSArray *items){
            __strong typeof (wself) sself = wself;
            [sself addItems:items toModule:module];
        } failure:nil];
    });
}

- (void)addItems:(NSArray *)items toModule:(ARModelCollectionViewModule *)module
{
    if (items.count > 0) {
        module.items = [module.items arrayByAddingObjectsFromArray:items];
    }
    if (module == self.embeddedItemsVC.activeModule) {
        [self updateView];
    }
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

#pragma mark - AREmbeddedModelsViewControllerDelegate

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    UIViewController *newViewController = nil;

    if (self.displayMode == ARFavoritesDisplayModeArtworks) {
        newViewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.embeddedItemsVC.items inFair:nil atIndex:index];

    } else if (self.displayMode == ARFavoritesDisplayModeArtists) {
        Artist *artist = self.embeddedItemsVC.items[index];
        newViewController = [ARSwitchBoard.sharedInstance loadArtistWithID:artist.artistID];

    } else if (self.displayMode == ARFavoritesDisplayModeGenes) {
        Gene *gene = self.embeddedItemsVC.items[index];
        newViewController = [ARSwitchBoard.sharedInstance loadGene:gene];
    }

    if (newViewController) {
        [self.ar_TopMenuViewController pushViewController:newViewController animated:ARPerformWorkAsynchronously];
    }
}

- (void)embeddedModelsViewControllerDidScrollPastEdge:(AREmbeddedModelsViewController *)embeddedModelsViewController
{
    [self getNextItemSet];
}

#pragma mark - ARSwitchViewDelegate


- (void)switchView:(ARSwitchView *)switchView didPressButtonAtIndex:(NSInteger)buttonIndex animated:(BOOL)animated
{
    if (buttonIndex == ARSwitchViewFavoriteArtworksIndex) {
        self.displayMode = ARFavoritesDisplayModeArtworks;
    } else if (buttonIndex == ARSwitchViewFavoriteArtistsIndex) {
        self.displayMode = ARFavoritesDisplayModeArtists;
    } else if (buttonIndex == ARSwitchViewFavoriteCategoriesIndex) {
        self.displayMode = ARFavoritesDisplayModeGenes;
    }
    [self hideEmptyState];
    [self updateView];
}

#pragma mark - ARRootViewController

- (BOOL)isRootViewController
{
    return YES;
}

@end
