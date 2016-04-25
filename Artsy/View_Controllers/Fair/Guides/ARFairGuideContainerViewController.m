#import "ARFairGuideContainerViewController.h"
#import "ARFairGuideViewController.h"
#import "ARFairMapViewController.h"
#import "Fair.h"
#import "User.h"
#import "ARNavigationController.h"
#import "ARScrollNavigationChief.h"

#import "UIViewController+SimpleChildren.h"
#import "UIViewController+FullScreenLoading.h"

#import "UIView+HitTestExpansion.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <ReactiveCocoa/ReactiveCocoa.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARFairGuideContainerViewController () <ARFairGuideViewControllerDelegate, UIScrollViewDelegate>

@property (nonatomic, readonly) ARNavigationController *parentViewController;

@property (nonatomic, strong) UIButton *backButton;

@property (nonatomic, assign) BOOL mapsLoaded;
@property (nonatomic, assign) BOOL fairLoaded;

@property (nonatomic, strong) ARFairGuideViewController *fairGuideViewController;
@property (nonatomic, strong) ARFairMapViewController *fairMapViewController;
@property (nonatomic, strong) UIView *fairGuideBackgroundView;

@property (nonatomic, strong) UIView *clickInterceptorView;

@property (nonatomic, assign) BOOL mapCollapsed;
@property (nonatomic, strong) NSMutableArray *subviewsConstraintsArray;
@property (nonatomic, weak) NSLayoutConstraint *fairGuideTopLayoutConstraint;
@property (nonatomic, weak) NSLayoutConstraint *fairBackgroundViewTopLayoutConstraint;
@property (readwrite, nonatomic, assign) CGFloat topHeight;

@end


@implementation ARFairGuideContainerViewController

@dynamic parentViewController;

const CGFloat kClosedMapHeight = 180.0f;

AR_VC_OVERRIDE_SUPER_DESIGNATED_INITIALIZERS;

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super initWithNibName:nil bundle:nil];
    if (!self) return nil;

    _fair = fair;
    _mapCollapsed = YES;
    _subviewsConstraintsArray = [NSMutableArray array];
    _animatedTransitions = YES;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    self.view.backgroundColor = [UIColor whiteColor];

   __weak typeof (self) wself = self;
    [[[self rac_signalForSelector:@selector(viewWillAppear:)] take:1] subscribeNext:^(id _) {
        __strong typeof (wself) sself = wself;
        [sself downloadContent];
    }];

    [[RACSignal combineLatest:@[ RACObserve(self, mapsLoaded), RACObserve(self, fairLoaded) ]] subscribeNext:^(id x) {
        __strong typeof (wself) sself = wself;
        [sself checkForDataLoaded];
    }];

    // Every time the mapCollapsed property changes, we want to setup the constraints.
    // We skip the first time because we don't want to fire immediately.
    [[[RACObserve(self, mapCollapsed) skip:1] distinctUntilChanged] subscribeNext:^(id _) {
        __strong typeof (wself) sself = wself;

        CGFloat height = 0;
        if (sself.mapCollapsed) {
            height = kClosedMapHeight;
        }
        [sself.fairMapViewController centerMap:0.5 inFrameOfHeight:height animated:YES];

        BOOL parentButtonsVisible = (sself.mapCollapsed == YES);
        if (parentButtonsVisible == NO) {
            // We want to swap the visibility of our back button and the parent one
            // immediately if it's disappearing, but after the animation if it's appearing
            [sself updateBackButtonAlpha];
        }

        [UIView animateIf:sself.animatedTransitions
             duration:0.3f :^{
                 sself.fairMapViewController.titleHidden = self.mapCollapsed;
                 [sself setupContraints];
                 [sself setBackButtonRotation];

             } completion:^(BOOL finished) {
                 if (parentButtonsVisible) {
                     [sself updateBackButtonAlpha];
                 }
             }];
    }];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    self.fairGuideViewController.view.delegate = self;
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

#pragma mark - User Interaction

- (void)back:(id)sender
{
    self.mapCollapsed = YES;
}

#pragma mark - Private Methods

- (void)downloadContent
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    [self.fair updateFair:^{
        self.fairLoaded = YES;
    }];

    [self.fair getFairMaps:^(NSArray *maps) {
        self.mapsLoaded = YES;
    }];
}

- (void)updateBackButtonAlpha
{
    self.backButton.alpha = self.mapCollapsed ? 0.0f : 1.0f;
    [self.parentViewController showBackButton:self.mapCollapsed animated:NO];
}

- (void)setBackButtonRotation
{
    if (self.mapCollapsed) {
        self.backButton.transform = CGAffineTransformIdentity;
    } else {
        self.backButton.transform = CGAffineTransformMakeRotation(M_PI_2);
    }
}

- (void)checkForDataLoaded
{
    if (self.mapsLoaded && self.fairLoaded) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];

        [self ar_addModernChildViewController:self.fairMapViewController];
        [self.view addSubview:self.clickInterceptorView];
        [self.view addSubview:self.fairGuideBackgroundView];
        [self ar_addModernChildViewController:self.fairGuideViewController];
        [self.fairMapViewController centerMap:0.5 inFrameOfHeight:kClosedMapHeight animated:NO];

        [self setupContraints];

        [self.view addSubview:self.backButton];

        NSNumber *topNumber = @(12 + CGRectGetHeight([[UIApplication sharedApplication] statusBarFrame]));
        NSString *top = topNumber.stringValue;
        [self.backButton alignTop:top leading:@"12" toView:self.view];

        [self setBackButtonRotation];
        [self updateBackButtonAlpha];
        self.fairMapViewController.titleHidden = self.mapCollapsed;

        [self.fairGuideViewController fairDidLoad];

        [self updateParallaxConstraints];
    }
}

- (void)setupContraints
{
    [self.view removeConstraints:self.subviewsConstraintsArray];
    [self.subviewsConstraintsArray removeAllObjects];

    CGFloat mapTopMargin = self.topLayoutGuide.length;

    NSString *topLayoutGuide = @(mapTopMargin).stringValue;

    if (self.mapCollapsed) {
        if (self.hasMap) {
            mapTopMargin += kClosedMapHeight;
        }

        self.topHeight = mapTopMargin;

        NSString *mapBottomString = @(CGRectGetHeight(self.view.bounds) - mapTopMargin).stringValue;
        NSString *mapTopString = @(mapTopMargin).stringValue;

        // @"-64" is statusbar + nav bar, to hide the map VC's title view
        [self alignViewToSelf:self.fairMapViewController.view top:@"-64" leading:@"0" bottom:mapBottomString trailing:@"0"];
        [self alignViewToSelf:self.clickInterceptorView top:@"0" leading:@"0" bottom:mapBottomString trailing:@"0"];
        [self alignViewToSelf:self.fairGuideViewController.view top:mapBottomString leading:@"0" bottom:@"0" trailing:@"0"];
        [self alignViewToSelf:self.fairGuideBackgroundView top:mapBottomString leading:@"0" bottom:@"0" trailing:@"0"];

        self.fairGuideTopLayoutConstraint = [self.fairGuideViewController.view alignTopEdgeWithView:self.view predicate:mapTopString];
        [self.subviewsConstraintsArray addObject:self.fairGuideTopLayoutConstraint];


        self.fairBackgroundViewTopLayoutConstraint = [self.fairGuideBackgroundView alignTopEdgeWithView:self.view predicate:mapTopString];
        [self.subviewsConstraintsArray addObject:self.fairBackgroundViewTopLayoutConstraint];

    } else {
        NSString *hiddenTop = @(CGRectGetHeight(self.view.bounds)).stringValue;
        NSString *hiddenBottom = @(-CGRectGetHeight(self.view.bounds)).stringValue;
        [self alignViewToSelf:self.fairMapViewController.view top:topLayoutGuide leading:@"0" bottom:@"0" trailing:@"0"];
        [self alignViewToSelf:self.clickInterceptorView top:hiddenTop leading:@"0" bottom:hiddenBottom trailing:@"0"];
        [self alignViewToSelf:self.fairGuideViewController.view top:hiddenTop leading:@"0" bottom:hiddenBottom trailing:@"0"];
        [self alignViewToSelf:self.fairGuideBackgroundView top:hiddenTop leading:@"0" bottom:hiddenBottom trailing:@"0"];
    }

    [self.view layoutIfNeeded];
}

- (void)updateParallaxConstraints
{
    UIScrollView *scrollView = (UIScrollView *)self.fairGuideViewController.view;

    CGPoint contentOffset = scrollView.contentOffset;
    CGFloat oldTopHeight = self.topHeight;
    self.topHeight -= contentOffset.y;

    if (contentOffset.y < -86) {
        self.mapCollapsed = NO;
        return;
    }

    dispatch_block_t updateConstraints = ^{
        self.fairGuideTopLayoutConstraint.constant = self.topHeight;
        [self.view setNeedsLayout];
    };

    if (oldTopHeight > 0 && self.topHeight < kClosedMapHeight) { // Collapsing to map preview
        CGFloat heightRatio = ((1.0 - self.topHeight / kClosedMapHeight) + 1.0) / 2.0;
        [self.fairMapViewController centerMap:heightRatio inFrameOfHeight:kClosedMapHeight animated:NO];
        self.fairBackgroundViewTopLayoutConstraint.constant = self.topHeight;
        updateConstraints();
        scrollView.contentOffset = contentOffset.y > 0 ? CGPointZero : contentOffset;

    } else if (contentOffset.y < 0 && oldTopHeight != 0) { // Expanding to fullscreen map
        // We check for oldTopHeight != 0 to prevent the controller from executing this branch when beginning to scroll down from contentOffset.y ~= 0.
        CGFloat heightRatio = ((contentOffset.y + kClosedMapHeight) / kClosedMapHeight) / 2.0;
        [self.fairMapViewController centerMap:heightRatio inFrameOfHeight:kClosedMapHeight animated:NO];
        self.fairBackgroundViewTopLayoutConstraint.constant = fabs(contentOffset.y) + kClosedMapHeight;
        updateConstraints();
    }
}

// TODO make these predicates _Nonnull when/if we decide to make FLKAutoLayout work that way.
- (void)alignViewToSelf:(UIView *)view top:(NSString *)top leading:(NSString *)leading bottom:(NSString *)bottom trailing:(NSString *)trailing
{
    [self.subviewsConstraintsArray addObjectsFromArray:[view alignTop:top leading:leading bottom:bottom trailing:trailing toView:self.view]];
}

- (BOOL)hasMap
{
    return self.fair.maps.count != 0;
}

#pragma mark - UIGestureRecognizer

- (void)didReceiveTap:(UITapGestureRecognizer *)recognizer
{
    self.mapCollapsed = !self.mapCollapsed;
}

#pragma mark - Overridden Properties

- (UIView *)clickInterceptorView
{
    if (_clickInterceptorView == nil) {
        _clickInterceptorView = [[UIView alloc] init];
        UITapGestureRecognizer *tapRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(didReceiveTap:)];
        [_clickInterceptorView addGestureRecognizer:tapRecognizer];
    }

    return _clickInterceptorView;
}

- (ARFairGuideViewController *)fairGuideViewController
{
    if (_fairGuideViewController == nil) {
        _fairGuideViewController = [[ARFairGuideViewController alloc] initWithFair:self.fair];
        _fairGuideViewController.delegate = self;
        _fairGuideViewController.showTopBorder = self.hasMap;
        _fairGuideViewController.view.backgroundColor = [UIColor clearColor];
    }

    return _fairGuideViewController;
}

- (ARFairMapViewController *)fairMapViewController
{
    if (_fairMapViewController == nil) {
        NSString *title = [User currentUser].name ? NSStringWithFormat(@"%@'s Guide", [User currentUser].name) : @"Your Personal Guide";
        _fairMapViewController = [[ARFairMapViewController alloc] initWithFair:self.fair title:title selectedPartnerShows:nil];
    }

    return _fairMapViewController;
}

- (UIView *)fairGuideBackgroundView
{
    if (_fairGuideBackgroundView == nil) {
        _fairGuideBackgroundView = [[UIView alloc] init];
        _fairGuideBackgroundView.backgroundColor = [UIColor whiteColor];
    }

    return _fairGuideBackgroundView;
}

- (UIButton *)backButton
{
    if (_backButton == nil) {
        _backButton = [[ARMenuButton alloc] init];
        [_backButton ar_extendHitTestSizeByWidth:10 andHeight:10];
        [_backButton setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
        [_backButton addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
        _backButton.accessibilityIdentifier = @"Back";
    }

    return _backButton;
}

- (void)setTopHeight:(CGFloat)topHeight
{
    _topHeight = round(MAX(0, MIN(kClosedMapHeight, topHeight)));
}

#pragma mark - UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];

    if ([scrollView isDescendantOfView:self.view] == NO) {
        return;
    }
    if (self.hasMap == NO) {
        return;
    }

    [self updateParallaxConstraints];

    // We move the scroll view indicator as we do the parallax, so we trick a little.
    CGFloat top = -self.topHeight * 1.5 + 20 + kClosedMapHeight / 2;
    scrollView.scrollIndicatorInsets = UIEdgeInsetsMake(top, 0, 0, 0);
}

#pragma mark - ARFairGuideViewControllerDelegate

- (void)fairGuideViewControllerDidChangeTab:(ARFairGuideViewController *)controller
{
    if (controller.contentIsOverstretched) {
        UIScrollView *scrollView = (ORStackScrollView *)controller.view;
        scrollView.contentOffset = CGPointZero;
        scrollView.clipsToBounds = NO;
        [self setupContraints];
        [self.parentViewController showBackButton:YES animated:NO];
    }
}

- (void)fairGuideViewControllerDidChangeUser:(ARFairGuideViewController *)controller
{
    self.fairLoaded = NO;
    self.mapsLoaded = NO;
    [self downloadContent];
}

@end
