// View Controllers
#import "ARProfileViewController.h"
#import "ARFairViewController.h"
#import "ARInternalMobileWebViewController.h"

// Categories
#import "UIViewController+FullScreenLoading.h"
#import "UIViewController+SimpleChildren.h"

// Utilities


@interface ARProfileViewController () <ARMenuAwareViewController>

@property (nonatomic, strong, readwrite) NSString *profileID;

@property (nonatomic, assign) BOOL hidesBackButton;
@property (nonatomic, assign) BOOL hidesToolbarMenu;

@end


@implementation ARProfileViewController

- (instancetype)initWithProfileID:(NSString *)profileID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.profileID = profileID;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

   @_weakify(self)
        // On the first viewWillAppear:
        [[[self rac_signalForSelector:@selector(viewWillAppear:)] take:1] subscribeNext:^(id _) {
        @_strongify(self);
        [self loadProfile];
        }];
}

- (void)loadProfile
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    [ArtsyAPI getProfileForProfileID:self.profileID success:^(Profile *profile) {

        if ([profile.profileOwner isKindOfClass:[Fair class]] && ![UIDevice isPad]) {
            NSString * fairID = ((Fair *) profile.profileOwner).fairID;
            Fair *fair = [[Fair alloc] initWithFairID:fairID];

            ARFairViewController *viewController = [[ARFairViewController alloc] initWithFair:fair andProfile:profile];

            RAC(self, hidesBackButton) = RACObserve(viewController, hidesBackButton);

            [self showViewController:viewController];
        } else {
            [self loadMartsyView];
        }

        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error getting Profile %@, falling back to Martsy.", self.profileID);
        [self loadMartsyView];
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    }];
}

- (void)loadMartsyView
{
    NSURL *profileURL = [ARSwitchBoard.sharedInstance resolveRelativeUrl:NSStringWithFormat(@"%@%@", self.profileID, @"?foo=bar")];

    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:profileURL];
    [self showViewController:viewController];
}

- (void)showViewController:(UIViewController *)viewController
{
    [self ar_addModernChildViewController:viewController];
    NSString *top = [NSString stringWithFormat:@"%f", [self.topLayoutGuide length]];
    [viewController.view alignTop:top leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

@end
