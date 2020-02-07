#import "ARApplicationShortcutItemDelegate.h"

#import "ARAppConstants.h"
#import "ARTopMenuViewController.h"
#import "ARNavigationController.h"
#import "User.h"
#import "ARSwitchBoard.h"


@implementation ARApplicationShortcutItemDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].shortcutItemDelegate = [[self alloc] init];
}

- (NSArray<UIApplicationShortcutItem *> *)shortcutItems
{
    UIApplicationShortcutItem *favoritesShortcut = [[UIApplicationShortcutItem alloc] initWithType:@"favorites" localizedTitle:@"Favorites"];

    return @[ favoritesShortcut ];
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler
{
    if ([shortcutItem.type hasSuffix:@"search"]) {
        [self openSearch];
        completionHandler(YES);
    } else if ([shortcutItem.type hasSuffix:@"favorites"]) {
        [self openFavorites];
        completionHandler(YES);
    }
}

- (void)openSearch
{
    [[ARTopMenuViewController sharedController] showSearch];
}

- (void)openFavorites
{
    // TODO: Is this correct? Are we sure?
    ARNavigationController *rootNavigationController = [[ARTopMenuViewController sharedController] rootNavigationController];
    UIViewController *favourites = [[ARSwitchBoard sharedInstance] loadPath:@"/favorites"];
    if (favourites) {
        [rootNavigationController pushViewController:favourites animated:YES];
    }
}

@end
