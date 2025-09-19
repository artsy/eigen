#import "ARAppDelegateHelper.h"

 @interface ARAppDelegateHelper (ShortCutItems)

 - (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler;

 @end
