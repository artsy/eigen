#import "ARWorksForYouReloadingHostViewController.h"
#import "ARLogger.h"

@import FLKAutoLayout;


#define MAX_AGE 3600 // 1 hour


@interface ARWorksForYouReloadingHostViewController ()
@property (nonatomic, strong, readwrite) ARWorksForYouViewController *worksForYouViewController;
@property (nonatomic, strong, readwrite) NSDate *lastLoadedAt;
@end


@implementation ARWorksForYouReloadingHostViewController

- (instancetype)init;
{
    if ((self = [super init])) {
        _lastLoadedAt = [NSDate date];
        _worksForYouViewController = [ARWorksForYouViewController new];
    }
    return self;
}

- (void)viewDidLoad;
{
    [super viewDidLoad];
    [self addWorksForYouViewController];
}

- (void)viewWillAppear:(BOOL)animated;
{
    if (self.isContentStale) {
        [self reloadData];
    }
    [super viewWillAppear:animated];
}

- (BOOL)isContentStale;
{
    return self.lastLoadedAt.timeIntervalSinceNow < -MAX_AGE;
}

- (void)reloadData;
{
    ARActionLog(@"Reloading works-for-you view controller");
    self.worksForYouViewController = [ARWorksForYouViewController new];
    self.lastLoadedAt = [NSDate date];
}

- (void)setWorksForYouViewController:(ARWorksForYouViewController *)viewController;
{
    if (_worksForYouViewController != viewController) {
        if (_worksForYouViewController) {
            [_worksForYouViewController willMoveToParentViewController:nil];
            [_worksForYouViewController.view removeFromSuperview];
            [_worksForYouViewController removeFromParentViewController];
        }
        _worksForYouViewController = viewController;
        [self addWorksForYouViewController];
    }
}

- (void)addWorksForYouViewController;
{
    [self addChildViewController:self.worksForYouViewController];
    [self.view addSubview:self.worksForYouViewController.view];
    [self.worksForYouViewController.view alignToView:self.view];
    [self.worksForYouViewController didMoveToParentViewController:self];
}

@end
