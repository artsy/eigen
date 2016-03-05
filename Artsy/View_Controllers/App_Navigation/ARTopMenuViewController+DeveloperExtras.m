#import "ARTopMenuViewController+DeveloperExtras.h"
#import "Artsy-Swift.h"

// This file is for running developer specific code, either when
// the app is loaded, or when you have injected fresh code in via
// InjectionForXcode (which you can install via Alcatraz.)

// See: https://github.com/artsy/eigen/pull/1236

// It is put in gitignore as the current state of what you see now,
// any changes you make will be erased when you switch branches.


@implementation ARTopMenuViewController (DeveloperExtras)

// Called when the app has been re-injected with some code,
// the default here will pop the top view controller and
// re-run the developerExtras

- (void)appHasBeenInjected:(NSNotification *)notification
{
    [self.rootNavigationController popViewControllerAnimated:NO];
    [self runDeveloperExtras];
}

// Use this to create a new ViewController and push it on to the stack
//
// @example
//
//  id viewController = [[LiveAuctionViewController alloc] init];
//  [self pushViewController:viewController animated:YES];
//
// @example
//
//  NSString *path = @"/artwork/helidon-xhixha-energia-delle-forme";
//  id viewController = [[ARSwitchBoard sharedInstance] loadPath:path];
//  [self pushViewController:viewController animated:YES];
//

- (void)runDeveloperExtras
{
}

@end
