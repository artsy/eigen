#import "ARTestViewHostingWindow.h"

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

    while (_hostingWindow != nil) {
        CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, false);
    }

    [view removeFromSuperview];
    [previousSuperview addSubview:view];
    [previousKeyWindow makeKeyAndVisible];
}

+ (void)continue;
{
    NSAssert([[[UIApplication sharedApplication] keyWindow] isKindOfClass:[ARTestViewHostingWindow class]], @"Current key window is not a ARTestViewHostingWindow");
    _hostingWindow = nil;
}

@end
