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

#import "AREigenFairComponentViewController.h"
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

    __weak typeof(self) wself = self;
    // On the first viewWillAppear:
    [[[self rac_signalForSelector:@selector(viewWillAppear:)] take:1] subscribeNext:^(id _) {
        __strong typeof (wself) sself = wself;
        [sself loadProfile];
    }];
}

- (void)loadProfile
{
    // We have no unique vanity URLs for iPad, so always load the martsy view
    if ([UIDevice isPad]) {
        [self loadMartsyView];
    } else {
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
            } else if ([profile.profileOwner isKindOfClass:[Partner class]] && [AROptions boolForOption:AROptionsNewPartnerPage]) {
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
    NSString *top = [NSString stringWithFormat:@"%f", [self.topLayoutGuide length]];
    [viewController.view alignTop:top leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    if (self.childViewControllers.firstObject && [self.childViewControllers.firstObject isKindOfClass:ARFairComponentViewController.class]) {
        return UIStatusBarStyleLightContent;
    }
    return UIStatusBarStyleDefault;
}

- (BOOL)hidesStatusBarBackground
{
    if (self.childViewControllers.firstObject) {
        return [self.childViewControllers.firstObject isKindOfClass:ARFairComponentViewController.class];
    }
    return NO;
}

@end
