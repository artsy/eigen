#import "ARFairProfileViewController.h"

NSString * const ARFairRefreshFavoritesNotification = @"ARFairRefreshFavoritesNotification";
NSString * const ARFairHighlightArtworkIDKey = @"ARFairHighlightArtworkIDKey";
NSString * const ARFairHighlightArtistIDKey = @"ARFairHighlightArtistIDKey";
NSString * const ARFairHighlightShowsKey = @"ARFairHighlightShowsKey";
NSString * const ARFairHighlightPartnersKey = @"ARFairHighlightPartnersKey";
NSString * const ARFairHighlightFocusMapKey = @"ARFairHighlightFocusMapKey";
NSString * const ARFairMapSetFavoritePartnersKey = @"ARFairMapSetFavoritePartnersKey";
NSString * const ARFairHighlightFavoritePartnersKey = @"ARFairHighlightFavoritePartnersKey";

@interface ARFairProfileViewController() <UIGestureRecognizerDelegate, UIScrollViewDelegate, UINavigationControllerDelegate>

// Taken from the ARParallaxScrollViewController.
@property (readonly, nonatomic, strong) UIViewController *topViewController;
@property (readonly, nonatomic, strong) UIViewController *bottomViewController;

@property (readonly, nonatomic) ARFairNavigationController *innerNavigationController;
@property (readonly, nonatomic) ARFairViewController *fairVC;

@property (readonly, nonatomic, strong) ARFairFavoritesNetworkModel *favoritesNetworkModel;

@property (nonatomic, copy) NSString *lazyProfileID;
@property (readonly, nonatomic) ARFairSearchViewController *searchVC;

@property (readwrite, nonatomic, assign) BOOL enableMenuButtons;

@property (readwrite, nonatomic, strong) AFJSONRequestOperation *favoritesOperation;

// The top-most view controller in the inner navigation controller.
// This is the on that decides if the back or menu buttons should be visible or
// not and everything rotation related.
@property (readwrite, nonatomic, strong) UIViewController *mainViewController;

@end

@implementation ARFairProfileViewController

- (id)initWithProfile:(Profile *)profile
{
    NSAssert([profile.owner isKindOfClass:[FairOrganizer class]], @"Expected a profile owned by a FairOrganizer.");

    self = [super init];
    if (!self) { return nil; }
    _profile = profile;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    _searchVC = [[ARFairSearchViewController alloc] init];

    self.view.clipsToBounds = YES;

    [self ar_presentIndeterminateLoadingIndicator];
    [self setupProfile];
}

- (void) setFair:(Fair *)fair
{
    [_fair removeObserver:self forKeyPath:@keypath(Fair.new, shows)];

    _fair = fair;

    [self.fair addObserver:self forKeyPath:@keypath(Fair.new, shows) options:NSKeyValueObservingOptionNew context:nil];
}

- (void)setupProfile
{
    NSString * defaultFairID = ((FairOrganizer *) _profile.owner).defaultFairID;

    self.fair = [[Fair alloc] initWithFairID:defaultFairID];

    ARFairViewController *fairViewController = [[ARFairViewController alloc] initWithFair:self.fair andProfile:self.profile];
    _fairVC = fairViewController;
    _innerNavigationController = [[ARFairNavigationController alloc] initWithRootViewController:self.fairVC];
    self.innerNavigationController.navigationBarHidden = YES;
    self.innerNavigationController.delegate = self;

    // make us the delegate, this also enableds transitions with the navigation bar hidden.
    self.innerNavigationController.interactivePopGestureRecognizer.delegate = self;

    [self ar_addModernChildViewController:self.innerNavigationController];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];

    NSNotificationCenter *dc = NSNotificationCenter.defaultCenter;
    [dc addObserver:self selector:@selector(didReceiveRefreshNotification:) name:ARFairRefreshFavoritesNotification object:nil];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];

    NSNotificationCenter *dc = NSNotificationCenter.defaultCenter;
    [dc removeObserver:self name:ARFairRefreshFavoritesNotification object:nil];
}

- (void)refreshFavorites
{
    if (User.isTrialUser) {
        return;
    }

    if(!_favoritesNetworkModel) {
        _favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
    }

    if(self.favoritesNetworkModel.isDownloading) return;
    [self.favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:self.fair navigation:nil success:^(NSArray *relatedPartners) {
    } failure:nil];
}

- (void)setupSearchView
{
    // TODO: https://github.com/orta/ORStackView/issues/9
    [self ar_addModernChildViewController:self.searchVC];
}

- (void)didReceiveRefreshNotification:(NSNotification *)notification
{
    [self refreshFavorites];
}

#pragma mark - UIViewController

- (BOOL)shouldAutorotate
{
    return self.mainViewController.shouldAutorotate;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return self.mainViewController.supportedInterfaceOrientations ?: ([UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown);
}

- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self.mainViewController willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
}

- (void)willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [self.mainViewController willAnimateRotationToInterfaceOrientation:toInterfaceOrientation duration:duration];
}

#pragma mark - ARMenuAwareViewController

+ (NSSet *)keyPathsForValuesAffectingHidesBackButton
{
    return [NSSet setWithObjects:@"mainViewController.hidesBackButton", @"searchVC.menuState", nil];
}

- (BOOL)hidesBackButton
{
    BOOL isRootView = (self.navigationController.viewControllers.count <= 1);
    if (isRootView) {
        return YES;
    }

    if (self.searchVC.menuState == ARMenuStateExpanded) {
        return YES;
    }

    if ([self.mainViewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        return [(id<ARMenuAwareViewController>)self.mainViewController hidesBackButton];
    }

    return NO;
}

+ (NSSet *)keyPathsForValuesAffectingHidesMenuButton
{
    return [NSSet setWithObjects:@"mainViewController.hidesMenuButton", @"searchVC.menuState", nil];
}

- (BOOL)hidesMenuButton
{
    if (self.searchVC.menuState==ARMenuStateExpanded) {
        return YES;
    }

    if ([self.mainViewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        return [(id<ARMenuAwareViewController>)self.mainViewController hidesMenuButton];
    }

    return NO;
}

#pragma mark - UINavigationControllerDelegate

- (void)navigationController:(ARFairNavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    self.enableMenuButtons = NO;
    self.mainViewController = viewController;
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    self.enableMenuButtons = YES;
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(Fair *)fair change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:@keypath(Fair.new, shows)]) {
        [self refreshFavorites];
    }
}

- (void)dealloc
{
    // remove observer
    self.fair = nil;
}

@end
