#import "AppDelegate.h"

 @interface ARAppDelegate (ShortCutItems)

 - (NSArray<UIApplicationShortcutItem *> *)shortcutItems;

 - (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler;

 @end
