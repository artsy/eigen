#import "ARProfileViewController.h"

#import "ARMenuAwareViewController.h"
#import "ArtsyAPI+Profiles.h"
#import "Fair.h"
#import "Profile.h"
#import "Partner.h"
#import "AROptions.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARLogger.h"
#import "ARNavigationController.h"
#import "ArtsyEcho.h"

#import "ARFairComponentViewController.h"
#import "ARInternalMobileWebViewController.h"

#import "UIViewController+FullScreenLoading.h"
#import "UIViewController+SimpleChildren.h"
#import "UIDevice-Hardware.h"

#import <Emission/ARPartnerComponentViewController.h>

#import <ReactiveObjC/ReactiveObjC.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARProfileViewController () <ARMenuAwareViewController>

@property (nonatomic, strong, readwrite) NSString *profileID;

@property (nonatomic, assign) BOOL hidesNavigationButtons;

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

    __weak typeof(self) wself = self;
    // On the first viewWillAppear:
    [[[self rac_signalForSelector:@selector(viewWillAppear:)] take:1] subscribeNext:^(id _) {
        __strong typeof (wself) sself = wself;
        [sself loadProfile];
    }];
}

- (void)loadProfile
{
    // We need to figure out if it's a fair URL or not
    //
    // So let's load the martsy view now, and at the same time
    // make a request to find whether the vanity URL represents a
    // fair, so that we can show the native VCs on iPhone
    [self loadMartsyView];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    [ArtsyAPI getProfileForProfileID:self.profileID success:^(Profile *profile) {
        // It's a fair
        if ([profile.profileOwner isKindOfClass:[Fair class]]) {
            // Remove the loading martsy view, and replace it with the ARFairVC
            [self ar_removeChildViewController: self.childViewControllers.firstObject];

            NSString * fairID = ((Fair *) profile.profileOwner).fairID;
            ARFairComponentViewController *viewController = [[ARFairComponentViewController alloc] initWithFairID:fairID];
            [self showViewController:viewController];
        } else if ([profile.profileOwner isKindOfClass:[Partner class]] && ARSwitchBoard.sharedInstance.echo.features[@"AREnableNewPartnerView"].state) {
            [self ar_removeChildViewController: self.childViewControllers.firstObject];

            NSString *partnerID = ((Partner *) profile.profileOwner).partnerID;
            ARPartnerComponentViewController *viewController =
            [[ARPartnerComponentViewController alloc] initWithPartnerID:partnerID];
            [self showViewController:viewController];
        }

        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    } failure:^(NSError *error) {
        ARErrorLog(@"Error getting Profile %@, falling back to Martsy.", self.profileID);
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    }];
}

- (void)loadMartsyView
{
    NSURL *profileURL = [ARSwitchBoard.sharedInstance resolveRelativeUrl:self.profileID];

    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:profileURL];
    [self showViewController:viewController];
}

- (void)showViewController:(UIViewController *)viewController
{
    [self ar_addModernChildViewController:viewController];
    [viewController.view alignToView:self.view];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}


@end
