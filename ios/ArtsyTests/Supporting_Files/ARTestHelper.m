#import "ARTestHelper.h"

#import "ARLogger.h"
#import "ARRouter.h"
#import "ARUserManager.h"

#import <SDWebImage/SDWebImage.h>
#import <SDWebImage/SDImageCache.h>
#import "ARFonts.h"
#import "AREmission.h"


@implementation ARTestHelper

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
    NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;

    NSAssert(version.majorVersion == 18 && version.minorVersion == 5,
             @"The tests should be run on iOS 18.5, not %ld.%ld", version.majorVersion, version.minorVersion);

    CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
    NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone && CGSizeEqualToSize(nativeResolution, CGSizeMake(1206, 2622)),
             @"The tests should be run on an iPhone 16 Pro, not a device with native resolution %@",
             NSStringFromCGSize(nativeResolution));

    ARPerformWorkAsynchronously = NO;

    // Shared Web Credentials involve async processes that trigger OS alerts and are generally hard to deal with.
    // The related ARUserManager methods can still be invoked, they will just silently do nothing.
    [[ARUserManager sharedManager] disableSharedWebCredentials];

    /// Not really sure what this is for
    [[ARLogger sharedLogger] startLogging];

    // Occasionally we get font issues in snapshots, this _potentially_
    // could be a fix for this.
    __unused UIFont *font = [UIFont serifSemiBoldFontWithSize:12];
    font = [UIFont serifFontWithSize:12];
    font = [UIFont serifItalicFontWithSize:12];
    font = [UIFont sansSerifFontWithSize:12];

    // Ensure that the image cache is just set up for testing
    SDImageCache *imageCache = [[SDImageCache alloc] initWithNamespace:@"Testing" diskCacheDirectory:NSTemporaryDirectory()];
    [[SDWebImageManager sharedManager] setValue:imageCache forKey:@"_imageCache"];

    // You might need to run `yarn bundle:ios` or `yarn bundle-for-native-ci:ios` to generate the jsbundle needed for emission
    AREmission *emission = [[AREmission alloc] initWithState:@{}];
    [AREmission setSharedInstance:emission];
    [AREmission.sharedInstance.notificationsManagerModule updateReactState:@{
        @"gravityURL": @"https://stagingapi.artsy.net",
        @"metaphysicsURL": @"https://metaphysics-staging.artsy.net/v2",
        @"predictionURL": @"https://live-staging.artsy.net",
        @"webURL": @"https://staging.artsy.net",
        @"causalityURL": @"wss://causality-staging.artsy.net",
        @"env": @"staging"
    }];
    [ARRouter setup];

    // Needed for "usesDrawRect" based Nimble-Snapshots testing
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = [[UIViewController alloc] init];
    [self.window makeKeyAndVisible];

    return YES;
}

@end
