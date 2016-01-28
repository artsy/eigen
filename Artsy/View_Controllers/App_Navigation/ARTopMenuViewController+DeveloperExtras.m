#import "ARTopMenuViewController+DeveloperExtras.h"
#import "Artsy-Swift.h"

// You can tell git to ignore changes to this file by running
//
//   git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m


@implementation ARTopMenuViewController (DeveloperExtras)

// Use this function to run code once the app is loaded, useful for pushing a
// specific VC etc.

- (void)runDeveloperExtras
{
    AuctionViewController *auctionVC = [[AuctionViewController alloc] initWithSaleID:@"los-angeles-modern-auctions-march-2015"];
    [[ARTopMenuViewController sharedController] pushViewController:auctionVC animated:NO];
}

@end
