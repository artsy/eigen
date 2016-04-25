#import "ARGeneViewController.h"

#import "ARAppConstants.h"
#import "ARHeartButton.h"
#import "ARTextView.h"
#import "AREmbeddedModelsViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARSharingController.h"
#import "ARCollapsableTextView.h"
#import "UIViewController+SimpleChildren.h"
#import "ARGeneArtworksNetworkModel.h"
#import "ARArtworkSetViewController.h"
#import "ORStackView+ArtsyViews.h"
#import "UIViewController+ARUserActivity.h"
#import "User.h"
#import "Gene.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARNetworkErrorManager.h"
#import "ARTrialController.h"
#import "ARScrollNavigationChief.h"

#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

#import "UILabel+Typography.h"
#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARGeneViewController () <AREmbeddedModelsViewControllerDelegate, UIScrollViewDelegate, ARTextViewDelegate, ARArtworkMasonryLayoutProvider>

@property (nonatomic, strong) ARGeneArtworksNetworkModel *artworkCollection;

@property (nonatomic, strong) ORStackView *headerContainerView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIView *titleSeparator;
@property (nonatomic, strong) ARTextView *descriptionTextView;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksViewController;
@end


@implementation ARGeneViewController

- (instancetype)initWithGeneID:(NSString *)geneID
{
    Gene *gene = [[Gene alloc] initWithGeneID:geneID];
    return [self initWithGene:gene];
}

- (instancetype)initWithGene:(Gene *)gene
{
    self = [self init];

    _gene = gene;
    _artworkCollection = [[ARGeneArtworksNetworkModel alloc] initWithGene:gene];
    return self;
}


- (void)dealloc
{
    [self.artworksViewController.collectionView setDelegate:nil];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

    [self createGeneArtworksViewController];

    ORStackView *headerContainerView = [[ORStackView alloc] init];
    headerContainerView.bottomMarginHeight = 20;

    [self loadGene];

    self.titleLabel = [headerContainerView addPageTitleWithString:self.gene.name];
    self.titleSeparator = [headerContainerView addWhiteSpaceWithHeight:@"20"];

    ARTextView *textView;
    if ([UIDevice isPad]) {
        textView = [[ARTextView alloc] init];
    } else {
        textView = [[ARCollapsableTextView alloc] init];
        [(ARCollapsableTextView *)textView setExpansionBlock:^(ARCollapsableTextView *textView) {
            [self viewDidLayoutSubviews];
        }];
    }
    textView.viewControllerDelegate = self;
    self.descriptionTextView = textView;
    [headerContainerView addSubview:textView withTopMargin:@"20" sideMargin:@"40"];


    UIView *actionsWrapper = [self createGeneActionsView];
    [headerContainerView addSubview:actionsWrapper withTopMargin:@"0" sideMargin:@"0"];

    self.headerContainerView = headerContainerView;
    self.artworksViewController.headerView = headerContainerView;

    [self updateBody];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    self.artworksViewController.collectionView.scrollsToTop = YES;
    [self.view setNeedsLayout];
    [self.view layoutIfNeeded];

    self.ar_userActivityEntity = self.gene;
}

- (void)viewWillDisappear:(BOOL)animated;
{
    [super viewWillDisappear:animated];
    [self.userActivity invalidate];
}

- (void)loadGene
{
    __weak typeof(self) wself = self;
    [self.gene updateGene:^{
        __strong typeof (wself) sself = wself;
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
        [sself updateBody];
        [sself ar_setDataLoaded];

        if (sself.gene.geneDescription.length == 0) {
            [sself.headerContainerView removeSubview:sself.descriptionTextView];
        } else {
            [sself.headerContainerView removeSubview:sself.titleSeparator];
        }

        [sself.view setNeedsLayout];
        [sself.view layoutIfNeeded];
    }];
}

- (UIView *)createGeneActionsView
{
    UIView *actionsWrapper = [[UIView alloc] init];
    UIButton *shareButton = [[ARCircularActionButton alloc] initWithImageName:@"Artwork_Icon_Share"];
    [shareButton addTarget:self action:@selector(shareGene:) forControlEvents:UIControlEventTouchUpInside];
    [actionsWrapper addSubview:shareButton];

    ARHeartButton *favoriteButton = [[ARHeartButton alloc] init];
    [favoriteButton addTarget:self action:@selector(toggleFollowingGene:) forControlEvents:UIControlEventTouchUpInside];
    [actionsWrapper addSubview:favoriteButton];

    [self.gene getFollowState:^(ARHeartStatus status) {
        [favoriteButton setStatus:status animated:ARPerformWorkAsynchronously];
    } failure:^(NSError *error) {
        [favoriteButton setStatus:ARHeartStatusNo];
    }];

    [actionsWrapper addSubview:favoriteButton];
    [favoriteButton alignCenterXWithView:actionsWrapper predicate:@"-30"];
    [shareButton alignCenterXWithView:actionsWrapper predicate:@"30"];
    [UIView alignTopAndBottomEdgesOfViews:@[ actionsWrapper, favoriteButton, shareButton ]];
    return actionsWrapper;
}

- (void)createGeneArtworksViewController
{
    ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:[self masonryLayoutForSize:self.view.frame.size] andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];

    module.layoutProvider = self;
    self.artworksViewController = [[AREmbeddedModelsViewController alloc] init];
    self.artworksViewController.activeModule = module;
    self.artworksViewController.delegate = self;
    self.artworksViewController.scrollDelegate = self;
    self.artworksViewController.showTrailingLoadingIndicator = YES;

    [self ar_addModernChildViewController:self.artworksViewController];

    [self.artworksViewController.view constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];
    [self.artworksViewController.view alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.artworksViewController.view alignBottomEdgeWithView:self.view predicate:@"0"];

    self.artworksViewController.collectionView.showsVerticalScrollIndicator = YES;
}

- (void)getNextGeneArtworks
{
    [self.artworkCollection getNextArtworkPage:^(NSArray *artworks) {
        if (artworks.count > 0) {
            [self.artworksViewController appendItems:artworks];
        } else {
            self.artworksViewController.showTrailingLoadingIndicator = NO;
        }
        [self.view setNeedsLayout];
        [self.view layoutIfNeeded];
    }];
}

- (void)toggleFollowingGene:(ARHeartButton *)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteGene success:^(BOOL newUser) {
            [self toggleFollowingGene:sender];
        }];
        return;
    }

    BOOL hearted = !sender.hearted;
    [sender setHearted:hearted animated:ARPerformWorkAsynchronously];

    [self.gene setFollowState:hearted success:nil failure:^(NSError *error) {
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow category."];
        [sender setHearted:!hearted animated:ARPerformWorkAsynchronously];
    }];
}

- (void)updateBody
{
    [self.titleLabel setText:self.gene.name.uppercaseString withLetterSpacing:0.5];

    // For now we're doing the simplest model possible

    if (self.gene.geneDescription.length) {
        [self.descriptionTextView setMarkdownString:self.gene.geneDescription];
    }
    self.artworksViewController.collectionView.scrollsToTop = YES;
    [self.headerContainerView setNeedsLayout];
    [self.headerContainerView layoutIfNeeded];
    [self.view setNeedsLayout];
    [self.view layoutIfNeeded];
    [self getNextGeneArtworks];
}

- (void)shareGene:(UIButton *)sender
{
    ARSharingController *sharingController = [ARSharingController sharingControllerWithObject:self.gene
                                                                            thumbnailImageURL:self.gene.smallImageURL];
    [sharingController presentActivityViewControllerFromView:sender];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self.view setNeedsLayout];
}

- (void)viewDidLayoutSubviews
{
    CGFloat height = CGRectGetHeight(self.headerContainerView.bounds);
    self.artworksViewController.headerHeight = height;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    if (scrollView.contentSize.height > scrollView.bounds.size.height) {
        [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    }
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.gene) {
        return @{ @"gene" : self.gene.geneID,
                  @"type" : @"gene" };
    }

    return nil;
}

#pragma mark - ARArtworkMasonryLayoutProvider

- (ARArtworkMasonryLayout)masonryLayoutForSize:(CGSize)size
{
    if ([UIDevice isPad]) {
        return (size.width > size.height) ? ARArtworkMasonryLayout4Column : ARArtworkMasonryLayout3Column;
    } else {
        return ARArtworkMasonryLayout2Column;
    }
}

#pragma mark - AREmbeddedModelsViewControllerDelegate

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.artworksViewController.items inFair:nil atIndex:index];
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)embeddedModelsViewControllerDidScrollPastEdge:(AREmbeddedModelsViewController *)controller
{
    [self getNextGeneArtworks];
}

#pragma mark - ARTextViewDelegate

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
