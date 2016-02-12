#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARSwitchBoard+Eigen.h"
#import "AROptions.h"

// You can tell git to ignore changes to this file by running
//
//   git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m


@implementation ARTopMenuViewController (DeveloperExtras)

// Use this function to run code once the app is loaded, useful for pushing a
// specific VC etc.

- (void)runDeveloperExtras
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [AROptions setBool:YES forOption:AROptionsUseNativeAuctions];
        ARSwitchBoard *switchBoard = [ARSwitchBoard sharedInstance];
        UIViewController *viewController = [switchBoard loadAuctionWithID:@"los-angeles-modern-auctions-march-2015"];
        [switchBoard presentViewController:viewController];
    });
}

@end
