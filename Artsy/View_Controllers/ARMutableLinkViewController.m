#import "ARMutableLinkViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARRouter.h"
#import "ArtsyAPI+HEAD.h"
#import "ARAppConstants.h"

#import "ARTopMenuViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "UIViewController+SimpleChildren.h"
#import "ARProfileViewController.h"

#import <Emission/ARFairComponentViewController.h>

@interface ARMutableLinkViewController () <ARMenuAwareViewController>
@property (nonatomic, strong, readonly) NSString *originalPath;
@end


@implementation ARMutableLinkViewController

- (instancetype)initWithPath:(NSString *)path;
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _originalPath = path;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self ar_presentIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

    NSURLRequest *headRequest = [ARRouter newHEADRequestForPath:self.originalPath];
    [ArtsyAPI getHTTPRedirectForRequest:headRequest completion:^(NSString *_Nullable redirectLocation, NSError *_Nullable error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

        UIViewController *internalViewController;

        if (redirectLocation) {
            internalViewController = [ARSwitchBoard.sharedInstance loadPath:redirectLocation];
        } else {
            internalViewController = [ARSwitchBoard.sharedInstance loadProfileWithID:self.originalPath];
        }

        if ([ARTopMenuViewController shouldPresentViewControllerAsModal:internalViewController]) {
            [[ARTopMenuViewController sharedController] pushViewController:internalViewController animated:ARPerformWorkAsynchronously completion:^{
                [self.navigationController popViewControllerAnimated:NO];
            }];
            return;
        }

        // We need to call begin/endAppearanceTransition manually, because at this point, our view controller
        // has already appeared (so newly added children won't receive viewWill/DidAppear callbacks automatically).
        [internalViewController beginAppearanceTransition:true animated:false];
        [self ar_addAlignedModernChildViewController:internalViewController];
        [internalViewController endAppearanceTransition];
    }];
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
