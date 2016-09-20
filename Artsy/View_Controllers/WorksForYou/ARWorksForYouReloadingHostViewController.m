#import "ARWorksForYouReloadingHostViewController.h"

#import "UIViewController+SimpleChildren.h"
#import "ARLogger.h"
#import "Artsy-Swift.h"

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
        self.automaticallyAdjustsScrollViewInsets = NO;

        _lastLoadedAt = [NSDate date];
        _worksForYouViewController = [ARWorksForYouViewController new];
    }
    return self;
}

- (void)viewDidLoad;
{
    [super viewDidLoad];
    [self ar_addAlignedModernChildViewController:self.worksForYouViewController];
}

- (void)viewWillAppear:(BOOL)animated;
{
    if (self.isContentStale || self.worksForYouViewController.worksForYouNetworkModel.networkingDidFail) {
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
            [self ar_removeChildViewController:_worksForYouViewController];
        }
        _worksForYouViewController = viewController;
        [self ar_addAlignedModernChildViewController:_worksForYouViewController];
    }
}

- (BOOL)shouldAutorotate
{
    return self.traitDependentAutorotateSupport;
}

@end
