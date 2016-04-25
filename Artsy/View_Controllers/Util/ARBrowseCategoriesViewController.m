#import "ARBrowseCategoriesViewController.h"

#import "ArtsyAPI+Genes.h"
#import "ARAppConstants.h"
#import "UIViewController+FullScreenLoading.h"
#import "ORStackView+ArtsyViews.h"
#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "FeaturedLink.h"
#import "OrderedSet.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARScrollNavigationChief.h"
#import "ARLogger.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

#import "UIDevice-Hardware.h"

@interface ARBrowseCategoriesViewController () <ARBrowseFeaturedLinksCollectionViewControllerDelegate>
@end


@implementation ARBrowseCategoriesViewController

@dynamic view;

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
    [super viewDidLoad];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

    [self.view.stackView addPageTitleWithString:@"Featured Categories"];

    ARBrowseFeaturedLinksCollectionViewController *featureCollectionVC = [[ARBrowseFeaturedLinksCollectionViewController alloc] initWithStyle:ARFeaturedLinkLayoutSingleRow];
    [self.view.stackView addViewController:featureCollectionVC toParent:self withTopMargin:@"30" sideMargin:@"0"];
    featureCollectionVC.selectionDelegate = self;

    [ArtsyAPI getFeaturedLinksForGenesWithSuccess:^(NSArray *genes) {
        featureCollectionVC.featuredLinks = genes;
        [self ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

    } failure:^(NSError *error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
    }];

    [ArtsyAPI getFeaturedLinkCategoriesForGenesWithSuccess:^(NSArray *orderedSets) {
        for (OrderedSet *orderedSet in orderedSets) {
            [self createCollectionViewWithOrderedSet:orderedSet];
        }
        [self.view.stackView layoutIfNeeded];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error getting Featured Link Categories for genes");
    }];
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
    [super viewWillAppear:animated && ARPerformWorkAsynchronously];
    self.view.delegate = [ARScrollNavigationChief chief];
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.view.delegate = nil;

    [super viewWillDisappear:animated && ARPerformWorkAsynchronously];
}

#pragma mark - ARBrowseFeaturedLinksCollectionViewControllerDelegate

- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:featuredLink.href];
    if (viewController) {
        [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
    }
}

@end
