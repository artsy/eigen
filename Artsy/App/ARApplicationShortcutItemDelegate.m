#import "ARApplicationShortcutItemDelegate.h"

#import "ARAppConstants.h"
#import "ARTopMenuViewController.h"
#import "ARNavigationController.h"
#import "ARFavoritesViewController.h"
#import "User.h"

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
    ARNavigationController *rootNavigationController = [[ARTopMenuViewController sharedController] rootNavigationController];
    [rootNavigationController search:self];
}

- (void)openFavorites
{
    ARNavigationController *rootNavigationController = [[ARTopMenuViewController sharedController] rootNavigationController];

    // TODO MAXIM: add new demo mode here
//    if (!ARIsRunningInDemoMode && [User isLocalTemporaryUser]) {
//        ARTrialContext context = ARTrialContextShowingFavorites;
//        [ARTrialController presentTrialWithContext:context success:^(BOOL newUser) {
//            if (newUser) {
//                [[ARTopMenuViewController sharedController].tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
//                
//            } else {
//                [rootNavigationController pushViewController:[[ARFavoritesViewController alloc] init] animated:NO];
//            }
//        }];
//        return;
//    }

    [rootNavigationController pushViewController:[[ARFavoritesViewController alloc] init] animated:NO];
}

@end
