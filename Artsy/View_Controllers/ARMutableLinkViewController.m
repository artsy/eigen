#import "ARMutableLinkViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARRouter.h"
#import "ArtsyAPI+HEAD.h"
#import "ARAppConstants.h"

#import "ARTopMenuViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "UIViewController+SimpleChildren.h"
#import "ARProfileViewController.h"


@interface ARMutableLinkViewController ()
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
    [ArtsyAPI getHTTPResponseHeadersForRequest:headRequest completion:^(NSInteger responseCode, NSDictionary *_Nonnull headers, NSError *_Nullable error) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];

        UIViewController *internalViewController;

        if (responseCode == 302 && headers[@"Location"]) {
            internalViewController = [ARSwitchBoard.sharedInstance loadPath:headers[@"Location"]];
        } else {
            internalViewController = [ARSwitchBoard.sharedInstance loadProfileWithID:self.originalPath];
        }

        if ([ARTopMenuViewController shouldPresentViewControllerAsModal:internalViewController]) {
            [[ARTopMenuViewController sharedController] pushViewController:internalViewController animated:ARPerformWorkAsynchronously completion:^{
                [self.navigationController popViewControllerAnimated:NO];
            }];
            return;
        }

        [internalViewController beginAppearanceTransition:true animated:false];
        [self ar_addAlignedModernChildViewController:internalViewController];
        [internalViewController endAppearanceTransition];
    }];
}

@end
