#import "ARTestHelper.h"

#import "ARRouter.h"
#import "ARUserManager.h"

#import <SDWebImage/SDWebImage.h>
#import <SDWebImage/SDImageCache.h>
#import "ARFonts.h"
#import "AREmission.h"


/// The app's Info.plist declares `SceneDelegate`, which starts React Native through Expo and needs
/// the real `AppDelegate`. The test host uses this one instead, which only shows `ARTestHelper`'s
/// window in the connecting scene.
@interface ARTestSceneDelegate : UIResponder <UIWindowSceneDelegate>
@property (strong, nonatomic) UIWindow *window;
@end

@implementation ARTestSceneDelegate

- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions
{
    if (![scene isKindOfClass:UIWindowScene.class]) {
        return;
    }
    UIWindow *window = [(id<UIApplicationDelegate>)UIApplication.sharedApplication.delegate window];
    window.windowScene = (UIWindowScene *)scene;
    [window makeKeyAndVisible];
    self.window = window;
}

@end


@implementation ARTestHelper

- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options
{
    // An unnamed configuration doesn't pick up the Info.plist entry, so `SceneDelegate` never runs.
    UISceneConfiguration *configuration = [[UISceneConfiguration alloc] initWithName:nil sessionRole:connectingSceneSession.role];
    configuration.delegateClass = ARTestSceneDelegate.class;
    return configuration;
}

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
    NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;

    NSString *configPath = [[NSBundle bundleForClass:[self class]] pathForResource:@"ios-config" ofType:@"json"];
    NSData *configData = [NSData dataWithContentsOfFile:configPath];
    NSDictionary *config = [NSJSONSerialization JSONObjectWithData:configData options:0 error:nil];
    NSArray *versionParts = [config[@"ios_version"] componentsSeparatedByString:@"."];
    NSInteger expectedMajor = [versionParts[0] integerValue];
    NSInteger expectedMinor = [versionParts[1] integerValue];

    NSAssert(version.majorVersion == expectedMajor && version.minorVersion == expectedMinor,
             @"The tests should be run on iOS %@, not %ld.%ld", config[@"ios_version"], version.majorVersion, version.minorVersion);

    CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
    NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone && CGSizeEqualToSize(nativeResolution, CGSizeMake(1206, 2622)),
             @"The tests should be run on an iPhone 16 Pro, not a device with native resolution %@",
             NSStringFromCGSize(nativeResolution));

    ARPerformWorkAsynchronously = NO;

    // Shared Web Credentials involve async processes that trigger OS alerts and are generally hard to deal with.
    // The related ARUserManager methods can still be invoked, they will just silently do nothing.
    [[ARUserManager sharedManager] disableSharedWebCredentials];

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
