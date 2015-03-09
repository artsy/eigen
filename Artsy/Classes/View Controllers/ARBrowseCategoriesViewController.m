#import "ARBrowseCategoriesViewController.h"
#import "ARBrowseFeaturedLinksCollectionView.h"
#import "UIViewController+FullScreenLoading.h"
#import "ORStackView+ArtsyViews.h"

@interface ARBrowseCategoriesViewController () <ARBrowseFeaturedLinksCollectionViewDelegate>

@property (nonatomic, strong) NSMutableArray *collectionViews;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

@implementation ARBrowseCategoriesViewController

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

#pragma mark - UIViewController

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] init];
    self.view.stackView.bottomMarginHeight = 20;
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.delegate = [ARScrollNavigationChief chief];
}

- (void)viewDidLoad
{
    [self.view.stackView addPageTitleWithString:@"Featured Categories"];
    self.collectionViews = [NSMutableArray array];

    ARBrowseFeaturedLinksCollectionView *featureCollectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
    [self.view.stackView addSubview:featureCollectionView withTopMargin:@"30" sideMargin:@"0"];
    [self.collectionViews addObject: featureCollectionView];
    featureCollectionView.selectionDelegate = self;

    [ArtsyAPI getFeaturedLinksForGenesWithSuccess:^(NSArray *genes) {
        featureCollectionView.featuredLinks = genes;
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];

    } failure:^(NSError *error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    }];

    [ArtsyAPI getFeaturedLinkCategoriesForGenesWithSuccess:^(NSArray *orderedSets) {
        for (OrderedSet *orderedSet in orderedSets) {
            [self createCollectionViewWithOrderedSet:orderedSet];
        }
    } failure:^(NSError *error) {
        NSLog(@"error");
    }];

    [self ar_presentIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    [super viewDidLoad];
}

- (void)createCollectionViewWithOrderedSet:(OrderedSet *)orderedSet
{
    [self.view.stackView addPageSubtitleWithString:orderedSet.name];

    ARBrowseFeaturedLinksCollectionView *categoryCollectionView = [[ARBrowseFeaturedLinksCollectionView alloc] initWithStyle:ARFeaturedLinkLayoutDoubleRow];
    categoryCollectionView.selectionDelegate = self;
    [self.view.stackView addSubview:categoryCollectionView withTopMargin:@"20" sideMargin:@"0"];
    [self.collectionViews addObject:categoryCollectionView];

    [orderedSet getItems:^(NSArray *items) {
        categoryCollectionView.featuredLinks = items;
    }];
}

-(BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)invalidateCollectionViews
{
    for (ARBrowseFeaturedLinksCollectionView *collectionView in self.collectionViews) {
        [collectionView.collectionViewLayout invalidateLayout];
        [collectionView invalidateIntrinsicContentSize];
    }
}

- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration {
    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
    [self invalidateCollectionViews];
}

- (void)viewWillAppear:(BOOL)animated
{
    self.view.delegate = [ARScrollNavigationChief chief];
    [self invalidateCollectionViews];
    [super viewWillAppear:animated && self.shouldAnimate];
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.view.delegate = nil;

    [super viewWillDisappear:animated && self.shouldAnimate];
}

#pragma mark - ARBrowseFeaturedLinksCollectionViewDelegate

- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:featuredLink.href];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
    }
}

@end
