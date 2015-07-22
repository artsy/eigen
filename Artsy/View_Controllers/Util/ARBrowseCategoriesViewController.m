#import "ARBrowseCategoriesViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ORStackView+ArtsyViews.h"
#import "ARBrowseFeaturedLinksCollectionViewController.h"


@interface ARBrowseCategoriesViewController () <ARBrowseFeaturedLinksCollectionViewControllerDelegate>
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end


@implementation ARBrowseCategoriesViewController

@dynamic view;

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
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

    ARBrowseFeaturedLinksCollectionViewController *featureCollectionVC = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
    [self.view.stackView addViewController:featureCollectionVC toParent:self withTopMargin:@"30" sideMargin:@"0"];
    featureCollectionVC.selectionDelegate = self;

    [ArtsyAPI getFeaturedLinksForGenesWithSuccess:^(NSArray *genes) {
        featureCollectionVC.featuredLinks = genes;
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];

    } failure:^(NSError *error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    }];

    [ArtsyAPI getFeaturedLinkCategoriesForGenesWithSuccess:^(NSArray *orderedSets) {
        for (OrderedSet *orderedSet in orderedSets) {
            [self createCollectionViewWithOrderedSet:orderedSet];
        }
        [self.view.stackView layoutIfNeeded];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error getting Featured Link Categories for genes");
    }];

    [self ar_presentIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    [super viewDidLoad];
}

- (void)createCollectionViewWithOrderedSet:(OrderedSet *)orderedSet
{
    [self.view.stackView addPageSubtitleWithString:orderedSet.name];

    ARBrowseFeaturedLinksCollectionViewController *categoryCollectionVC = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutDoubleRow];
    categoryCollectionVC.selectionDelegate = self;
    [self.view.stackView addViewController:categoryCollectionVC toParent:self withTopMargin:@"20" sideMargin:@"0"];

    [orderedSet getItems:^(NSArray *items) {
        categoryCollectionVC.featuredLinks = items;
    }];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated && self.shouldAnimate];
    self.view.delegate = [ARScrollNavigationChief chief];
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.view.delegate = nil;

    [super viewWillDisappear:animated && self.shouldAnimate];
}

#pragma mark - ARBrowseFeaturedLinksCollectionViewControllerDelegate

- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:featuredLink.href];
    if (viewController) {
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
    }
}

@end
