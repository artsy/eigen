#import "ARGeneViewController.h"
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

@interface ARGeneViewController () <AREmbeddedModelsDelegate, UIScrollViewDelegate, ARTextViewDelegate, ARArtworkMasonryLayoutProvider>

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

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
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
    [self ar_presentIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];

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
        [(ARCollapsableTextView *)textView setExpansionBlock: ^(ARCollapsableTextView *textView){
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


- (void)loadGene
{
    @weakify(self);
    [self.gene updateGene:^{
        @strongify(self);
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
        [self updateBody];

        if (self.gene.geneDescription.length == 0) {
            [self.headerContainerView removeSubview:self.descriptionTextView];
        } else {
            [self.headerContainerView removeSubview:self.titleSeparator];
        }

        [self.view setNeedsLayout];
        [self.view layoutIfNeeded];
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
        [favoriteButton setStatus:status animated:self.shouldAnimate];
    } failure:^(NSError *error) {
        [favoriteButton setStatus:ARHeartStatusNo];
    }];

    [actionsWrapper addSubview:favoriteButton];
    [favoriteButton alignCenterXWithView:actionsWrapper predicate:@"-30"];
    [shareButton alignCenterXWithView:actionsWrapper predicate:@"30"];
    [UIView alignTopAndBottomEdgesOfViews:@[actionsWrapper, favoriteButton, shareButton]];
    return actionsWrapper;
}

- (void)createGeneArtworksViewController
{
    ARArtworkMasonryLayout layout = [UIDevice isPad] ? [self masonryLayoutForPadWithSize:self.view.frame.size] : ARArtworkMasonryLayout2Column;

    ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:layout andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];

    module.layoutProvider = self;
    self.artworksViewController = [[AREmbeddedModelsViewController alloc] init];
    self.artworksViewController.shouldAnimate = self.shouldAnimate;
    self.artworksViewController.activeModule = module;
    self.artworksViewController.delegate = self;
    self.artworksViewController.showTrailingLoadingIndicator = YES;

    [self ar_addModernChildViewController:self.artworksViewController];

    [self.artworksViewController.view constrainTopSpaceToView:(UIView *)self.topLayoutGuide predicate:nil];
    [self.artworksViewController.view alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];

    self.artworksViewController.collectionView.showsVerticalScrollIndicator = YES;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    self.artworksViewController.collectionView.scrollsToTop = YES;
    [self.view setNeedsLayout];
    [self.view layoutIfNeeded];
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
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteGene fromTarget:self selector:_cmd];
        return;
    }

    BOOL hearted = !sender.hearted;
    [sender setHearted:hearted animated:self.shouldAnimate];

    [ArtsyAPI setFavoriteStatus:sender.isHearted forGene:self.gene success:^(id response) {}
    failure:^(NSError *error) {
        [ARNetworkErrorManager presentActiveErrorModalWithError:error];
        [sender setHearted:!hearted animated:self.shouldAnimate];
    }];
}

- (void)updateBody
{
    [self.titleLabel setText:self.gene.name.uppercaseString withLetterSpacing:0.5];

    // For now we're doing the simplest model possible

    if (self.gene.geneDescription.length ) {
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

-(BOOL)shouldAutorotate
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
    if ( scrollView.contentSize.height > scrollView.bounds.size.height) {
        [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    }
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.gene) {
        return @{ @"gene" : self.gene.geneID, @"type" : @"gene" };
    }

    return nil;
}

#pragma mark - ARArtworkMasonryLayoutProvider

-(ARArtworkMasonryLayout)masonryLayoutForPadWithOrientation:(UIInterfaceOrientation)orientation
{
    if (UIInterfaceOrientationIsLandscape(orientation)) {
        return ARArtworkMasonryLayout4Column;
    } else {
        return ARArtworkMasonryLayout3Column;
    }
}
#pragma mark - AREmbeddedModelsDelegate

-(void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.artworksViewController.items inFair:nil atIndex:index];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewControllerDidScrollPastEdge:(AREmbeddedModelsViewController *)controller
{
    [self getNextGeneArtworks];
}

#pragma mark - ARTextViewDelegate

-(void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
