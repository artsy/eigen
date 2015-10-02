#import "ARApplicationShortcutItemDelegate.h"
#import "ARTopMenuViewController.h"
#import "ARNavigationController.h"

@implementation ARApplicationShortcutItemDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].shortcutItemDelegate = [[self alloc] init];
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler
{
    if ([shortcutItem.type hasSuffix:@"search"]) {
        [self openSearch];
        completionHandler(YES);
    }
}

- (void)openSearch
{
    ARNavigationController *rootNavigationController = [[ARTopMenuViewController sharedController] rootNavigationController];
    [rootNavigationController search:self];
}

@end
