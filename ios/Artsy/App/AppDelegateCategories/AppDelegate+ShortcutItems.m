#import "AppDelegate+ShortcutItems.h"
#import "AREmission.h"

@implementation ARAppDelegate (ShortcutItems)

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
    [[AREmission sharedInstance] navigate:@"/search"];
}

- (void)openFavorites
{
    [[AREmission sharedInstance] navigate:@"/favorites"];
}

@end
