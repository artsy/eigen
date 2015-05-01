#import "ARTestHelper.h"

void
ARTestWrapView(UIView *view)
{
    UIView *containerView = [[UIView alloc] initWithFrame:(CGRect){ CGPointZero, view.bounds.size }];
    [containerView addSubview:view];
    [containerView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                              attribute:NSLayoutAttributeTop
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:containerView
                                                              attribute:NSLayoutAttributeTop
                                                             multiplier:1.0
                                                               constant:0.0]];

    [containerView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                              attribute:NSLayoutAttributeLeading
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:containerView
                                                              attribute:NSLayoutAttributeLeading
                                                             multiplier:1.0
                                                               constant:0.0]];

    [containerView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                              attribute:NSLayoutAttributeBottom
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:containerView
                                                              attribute:NSLayoutAttributeBottom
                                                             multiplier:1.0
                                                               constant:0.0]];

    [containerView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                              attribute:NSLayoutAttributeTrailing
                                                              relatedBy:NSLayoutRelationEqual
                                                                 toItem:containerView
                                                              attribute:NSLayoutAttributeTrailing
                                                             multiplier:1.0
                                                               constant:0.0]];
    [containerView layoutIfNeeded];
}

@implementation ARTestHelper

+ (void)load;
{
    NSOperatingSystemVersion version = [NSProcessInfo processInfo].operatingSystemVersion;
    NSAssert(version.majorVersion == 8 && version.minorVersion == 2,
             @"The tests should be run on iOS 8.2, not %ld.%ld", version.majorVersion, version.minorVersion);

    CGSize nativeResolution = [UIScreen mainScreen].nativeBounds.size;
    NSAssert([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPhone
                 && CGSizeEqualToSize(nativeResolution, CGSizeMake(750, 1334)),
             @"The tests should be run on an iPhone 6, not a device with native resolution %@",
             NSStringFromCGSize(nativeResolution));
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

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORSpaceKey :^{
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
