#import "ARTestHelper.h"

#import "ARRouter.h"
#import "ARLogger.h"

@import iRate;


@implementation ARTestHelper

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
    NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;

    NSAssert(version.majorVersion == 9 && version.minorVersion == 0,
             @"The tests should be run on iOS 9.0, not %ld.%ld", version.majorVersion, version.minorVersion);

    CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
    NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone && CGSizeEqualToSize(nativeResolution, CGSizeMake(750, 1334)),
             @"The tests should be run on an iPhone 6, not a device with native resolution %@",
             NSStringFromCGSize(nativeResolution));

    ARPerformWorkAsynchronously = NO;
    [ARRouter setup];

    /// Never run in tests
    [[iRate sharedInstance] setRatedThisVersion:YES];

    /// Not really sure what this is for
    [[ARLogger sharedLogger] startLogging];

    return YES;
}

@end

#pragma mark - ARTestViewHostingWindow

#import <objc/runtime.h>
#import <unistd.h>
#import <dlfcn.h>
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>


@implementation ARTestViewHostingWindow

static UIWindow *_hostingWindow = nil;

+ (void)hostView:(UIView *)view;
{
    NSAssert([NSThread isMainThread], @"Should be ran on the main thread.");

    UIView *previousSuperview = view.superview;
    UIWindow *previousKeyWindow = [[UIApplication sharedApplication] keyWindow];

    UIViewController *viewController = [UIViewController new];
    viewController.view.frame = [[UIScreen mainScreen] applicationFrame];
    viewController.view.backgroundColor = [UIColor redColor];
    [viewController.view addSubview:view];

    _hostingWindow = [self new];
    _hostingWindow.rootViewController = viewController;
    [_hostingWindow makeKeyAndVisible];

    [self loadReveal];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORSpaceKey:^{
        NSAssert([[[UIApplication sharedApplication] keyWindow] isKindOfClass:[ARTestViewHostingWindow class]],
                 @"Current key window is not a ARTestViewHostingWindow");
        _hostingWindow = nil;
    }];

    while (_hostingWindow != nil) {
        CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, false);
    }

    [view removeFromSuperview];
    [previousSuperview addSubview:view];
    [previousKeyWindow makeKeyAndVisible];
}

+ (void)loadReveal;
{
    if (objc_getClass("IBARevealServer") == nil) {
        const char *revealPath = "/Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/libReveal.dylib";
        if (access(revealPath, R_OK) != 0) {
            NSLog(@"[!] Unable to find the Reveal.app library at: %s", revealPath);
            return;
        }
        if (dlopen(revealPath, RTLD_NOW) == NULL) {
            NSLog(@"[!] Unable to load the Reveal.app library at: %s", revealPath);
            return;
        }
    }
    [[NSNotificationCenter defaultCenter] postNotificationName:@"IBARevealRequestStart" object:nil];
}

@end
