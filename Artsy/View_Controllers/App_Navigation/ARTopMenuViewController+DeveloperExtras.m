#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARSerifNavigationViewController.h"
#import "ARGeneViewController.h"
// You can tell git to ignore changes to this file by running
//
//   git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m


@implementation ARTopMenuViewController (DeveloperExtras)

// Use this function to run code once the app is loaded, useful for pushing a
// specific VC etc.

- (void)runDeveloperExtras
{
    ARGeneViewController *geneVC = [[ARGeneViewController alloc] initWithGeneID:@"flatness"];
    geneVC.title = @"OK then";

    ARSerifNavigationViewController *nav = [[ARSerifNavigationViewController alloc] initWithRootViewController:geneVC];
    [self presentViewController:nav animated:YES completion:^{

    }];
}

@end
