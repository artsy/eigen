#import "ARTopMenuViewController+DeveloperExtras.h"

// You can tell git to ignore changes to this file by running
//
//   git update-index --assume-unchanged Artsy/Classes/View\ Controllers/ARTopMenuViewController+DeveloperExtras.m

#import "ARPersonalizeWebViewController.h"
#import "ARNetworkConstants.h"


@implementation ARTopMenuViewController (DeveloperExtras)

// Use this function to run code once the app is loaded, useful for pushing a
// specific VC etc.

- (void)runDeveloperExtras
{
    NSURL *url = [ARSwitchBoard.sharedInstance resolveRelativeUrl:ARPersonalizePath];
    ARPersonalizeWebViewController *viewController = [[ARPersonalizeWebViewController alloc] initWithURL:url];
    [self.rootNavigationController pushViewController:viewController animated:NO];
}

@end
