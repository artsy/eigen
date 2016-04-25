#import "ARHeroUnitViewController.h"
#import "ARSiteHeroUnitView.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "UIDevice-Hardware.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ReactiveCocoa/ReactiveCocoa.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

const static CGFloat ARHeroUnitDotsHeight = 30;
const static CGFloat ARCarouselDelay = 10;


@interface ARHeroUnitViewController () <UIPageViewControllerDataSource, UIPageViewControllerDelegate>
@property (nonatomic, strong) UIPageControl *pageControl;
@property (nonatomic) CAGradientLayer *shadowLayer;
@property (nonatomic, strong) UIPageViewController *pageViewController;
@property (nonatomic, strong) NSTimer *timer;
@end


@interface ARSiteHeroUnitViewController ()
@property (nonatomic, assign) NSInteger index;
@property (nonatomic, strong, readwrite) SiteHeroUnit *heroUnit;
@end


@implementation ARHeroUnitViewController

+ (CGFloat)heroUnitHeight
{
    return [UIDevice isPad] ? 380 : 252;
}

- (void)loadView
{
    [super loadView];
    [self.view constrainHeight:@([self.class heroUnitHeight]).stringValue];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.userInteractionEnabled = NO;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.pageViewController = [[UIPageViewController alloc] initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];
    self.pageViewController.dataSource = self;
    self.pageViewController.delegate = self;
    [self addChildViewController:self.pageViewController];
    [self.view addSubview:self.pageViewController.view];
    [self.pageViewController didMoveToParentViewController:self];

    self.pageControl = [[UIPageControl alloc] init];
    self.pageControl.frame = CGRectMake(0, [self.class heroUnitHeight] - ARHeroUnitDotsHeight, CGRectGetWidth(self.view.bounds), ARHeroUnitDotsHeight);
    self.pageControl.hidesForSinglePage = YES;
    self.pageControl.pageIndicatorTintColor = [UIColor colorWithWhite:1 alpha:0.5];
    self.pageControl.currentPageIndicatorTintColor = [UIColor whiteColor];

    [self.pageControl addTarget:self action:@selector(pageControlTapped:) forControlEvents:UIControlEventValueChanged];

    CAGradientLayer *shadowLayer = [CAGradientLayer layer];
    shadowLayer.colors = @[ (id)[UIColor colorWithWhite:0 alpha:.4].CGColor,
                            (id)[UIColor colorWithWhite:0 alpha:.12].CGColor,
                            (id)[UIColor colorWithWhite:0 alpha:0].CGColor ];

    shadowLayer.startPoint = CGPointMake(0, 1);
    shadowLayer.endPoint = CGPointMake(0, 0.8);
    shadowLayer.shouldRasterize = YES;

    [self.view.layer insertSublayer:shadowLayer below:self.pageControl.layer];
    self.shadowLayer = shadowLayer;

    [self.view insertSubview:self.pageControl aboveSubview:self.pageViewController.view];

    [RACObserve(self.heroUnitNetworkModel, heroUnits) subscribeNext:^(NSArray *heroUnits) {
        [self handleHeroUnits:heroUnits];
    }];
}

- (void)pageControlTapped:(UIPageControl *)sender
{
    NSInteger newIndex = sender.currentPage;
    UIPageViewControllerNavigationDirection direction = newIndex < [self currentViewController].index ? UIPageViewControllerNavigationDirectionReverse : UIPageViewControllerNavigationDirectionForward;
    [self goToHeroUnit:[self viewControllerForIndex:newIndex] withDirection:direction];
}

- (void)viewDidLayoutSubviews
{
    self.shadowLayer.frame = self.view.bounds;
    [super viewDidLayoutSubviews];
}

- (void)handleHeroUnits:(NSArray *)heroUnits
{
    [self cancelTimer];

    if (heroUnits.count > 0) {
        self.view.userInteractionEnabled = YES;
        [self updateViewWithHeroUnits:heroUnits];
        [self startTimer];
    } else {
        self.view.userInteractionEnabled = NO;
    }
}

- (void)updateViewWithHeroUnits:(NSArray *)heroUnits
{
    self.pageControl.numberOfPages = heroUnits.count;
    ARSiteHeroUnitViewController *initialVC = [self viewControllerForIndex:0];
    if (!initialVC) {
        return;
    }
    NSArray *initialVCs = @[ initialVC ];
    [self.pageViewController setViewControllers:initialVCs direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self startTimer];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self cancelTimer];
}

- (CGSize)preferredContentSize
{
    return (CGSize){UIViewNoIntrinsicMetric, [self.class heroUnitHeight]};
}

- (ARSiteHeroUnitViewController *)currentViewController
{
    return self.pageViewController.viewControllers.count > 0 ? self.pageViewController.viewControllers[0] : nil;
}

- (void)startTimer
{
    if (self.heroUnitNetworkModel.heroUnits.count <= 1) {
        return;
    }
    [self cancelTimer];
    self.timer = [NSTimer scheduledTimerWithTimeInterval:ARCarouselDelay target:self selector:@selector(goToNextHeroUnit) userInfo:nil repeats:YES];
}

- (void)cancelTimer
{
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

- (void)goToHeroUnit:(UIViewController *)vc withDirection:(UIPageViewControllerNavigationDirection)direction
{
    self.pageViewController.view.userInteractionEnabled = NO;
    __weak typeof(self) wself = self;
    [self.pageViewController setViewControllers:@[ vc ] direction:direction animated:YES completion:^(BOOL finished) {
        __strong typeof (wself) sself = wself;
        [sself.pageControl setCurrentPage:[sself currentViewController].index];
        sself.pageViewController.view.userInteractionEnabled = YES;

    }];
}

- (void)goToNextHeroUnit
{
    UIViewController *nextVC = [self pageViewController:self.pageViewController viewControllerAfterViewController:[self currentViewController]];
    [self goToHeroUnit:nextVC withDirection:UIPageViewControllerNavigationDirectionForward];
}

#pragma mark - UIPageViewControllerDataSource

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(ARSiteHeroUnitViewController *)viewController
{
    if (self.heroUnitNetworkModel.heroUnits.count == 1) {
        return nil;
    }

    NSInteger newIndex = viewController.index - 1;
    if (newIndex < 0) {
        newIndex = self.heroUnitNetworkModel.heroUnits.count - 1;
    }

    return [self viewControllerForIndex:newIndex ?: 0];
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(ARSiteHeroUnitViewController *)viewController
{
    if (self.heroUnitNetworkModel.heroUnits.count == 1) {
        return nil;
    }

    NSInteger newIndex = (viewController.index + 1) % self.heroUnitNetworkModel.heroUnits.count;
    return [self viewControllerForIndex:newIndex ?: 0];
}

- (ARSiteHeroUnitViewController *)viewControllerForIndex:(NSInteger)index
{
    if (index < 0 || index >= self.heroUnitNetworkModel.heroUnits.count) {
        return nil;
    }

    SiteHeroUnit *heroUnit = self.heroUnitNetworkModel.heroUnits[index];
    ARSiteHeroUnitViewController *viewController = [[ARSiteHeroUnitViewController alloc] initWithHeroUnit:heroUnit andIndex:index];
    return viewController;
}

#pragma mark - UIPageViewController

- (void)pageViewController:(UIPageViewController *)pageViewController willTransitionToViewControllers:(NSArray *)pendingViewControllers
{
    [self cancelTimer];
}

- (void)pageViewController:(UIPageViewController *)pageViewController didFinishAnimating:(BOOL)finished previousViewControllers:(NSArray *)previousViewControllers transitionCompleted:(BOOL)completed
{
    if (completed) {
        [self.pageControl setCurrentPage:[self currentViewController].index];
    }
    [self startTimer];
}

@end


@implementation ARSiteHeroUnitViewController

- (instancetype)initWithHeroUnit:(SiteHeroUnit *)heroUnit andIndex:(NSInteger)index
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _heroUnit = heroUnit;
    _index = index;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tappedUnit:)];
    tapGesture.cancelsTouchesInView = NO;
    [self.view addGestureRecognizer:tapGesture];

    ARSiteHeroUnitView *heroUnitView = [[ARSiteHeroUnitView alloc] initWithFrame:self.view.bounds unit:self.heroUnit];

    // We can't use autoresizing masks in a view controller contained in a UIPageViewController
    // See: http://stackoverflow.com/questions/17729336/uipageviewcontroller-auto-layout-rotation-issue
    heroUnitView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:heroUnitView];
}

- (void)tappedUnit:(id)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:self.heroUnit.link];
    if (viewController) {
        [ARTopMenuViewController.sharedController pushViewController:viewController animated:YES];
    }
}

@end
