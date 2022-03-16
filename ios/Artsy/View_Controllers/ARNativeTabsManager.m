#import "ARNativeTabsManager.h"
#import "UIDevice-Hardware.h"
#import <Emission/ARComponentViewController.h>
#import <React/RCTRootView.h>
#import "ARScreenPresenterModule.h"


@interface ARNativeViewControllerWrapperView : UIView

@property (strong, nonatomic) UIViewController* wrappedViewController;

- (UIViewController *)myParentViewController;

@property (nonatomic, readwrite) NSDictionary* viewProps;

@end


@implementation ARNativeViewControllerWrapperView

- (void)layoutSubviews {
    [super layoutSubviews];

    if (!self.wrappedViewController) {
        _wrappedViewController = [self getWrappedViewController];
        UIViewController *parentVC = self.myParentViewController;
        if (!parentVC) {
            return;
        }
        [parentVC addChildViewController:self.wrappedViewController];
        self.wrappedViewController.view.frame = self.bounds;
        [self addSubview:self.wrappedViewController.view];
        [self.wrappedViewController didMoveToParentViewController:parentVC];
    }
    self.wrappedViewController.view.frame = self.bounds;
}

- (UIViewController *)getWrappedViewController {
    NSString *tabName = self.viewProps[@"tabName"];
    NSString *moduleName = self.viewProps[@"rootModuleName"];
    if (!moduleName || !tabName) {
        NSAssert(NO, @"ARNativeViewControllerManager->TabNavigationStack requires both tabName and moduleName");
        return nil;
    }
    return [self getOrCreateNavStackForModule:tabName module:moduleName withProps:@{}];
}

- (ARNavigationController *)getOrCreateNavStackForModule:(NSString *)tabName module:(NSString *)moduleName withProps:(NSDictionary *)props
{
    return [ARScreenPresenterModule getNavigationStack:tabName] ?: [ARScreenPresenterModule createNavigationStack:tabName rootViewController:[ARComponentViewController module:moduleName withProps:props]];
}

- (UIViewController *)myParentViewController {
    UIResponder *parentResponder = self;

    while (parentResponder != nil) {
        parentResponder = parentResponder.nextResponder;
        if ([parentResponder isKindOfClass:UIViewController.class]) {
            return (UIViewController *)parentResponder;
        }
    }
    return nil;
}

@end


@implementation ARNativeTabsManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(viewProps, NSDictionary*)

- (UIView *)view
{
    return [[ARNativeViewControllerWrapperView alloc] init];
}

@end
