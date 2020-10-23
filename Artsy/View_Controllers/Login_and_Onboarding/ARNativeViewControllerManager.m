#import "ARNativeViewControllerManager.h"
#import "AROnboardingViewController.h"
#import "ARSlideshowViewController.h"
#import "UIDevice-Hardware.h"
#import <Emission/ARComponentViewController.h>
#import <React/RCTRootView.h>
#import "ARScreenPresenterModule.h"

@interface ARNativeViewControllerWrapperView : UIView

@property (strong, nonatomic) UIViewController* wrappedViewController;

- (UIViewController *)myParentViewController;

@property (nonatomic, readwrite) NSString* viewName;
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

- (void)setViewProps:(NSDictionary *)viewProps
{
    _viewProps = viewProps;
    if ([self.viewName isEqualToString:@"TabNavigationStack"]) {
        ARNavigationController *nav = [ARScreenPresenterModule getNavigationStack:viewProps[@"tabName"]];
        
        ARComponentViewController *rootVC = (id)nav.rootViewController;
        
        if ([rootVC isKindOfClass:ARComponentViewController.class]) {
            rootVC.rootView.appProperties = viewProps[@"rootModuleProps"];
        }
    }
}

- (UIViewController *)getWrappedViewController {
    if ([self.viewName isEqualToString:@"Onboarding"]) {
        return [[AROnboardingViewController alloc] init];
    } else if ([self.viewName isEqualToString:@"TabNavigationStack"]) {
        NSString *tabName = self.viewProps[@"tabName"];
        NSString *moduleName = self.viewProps[@"rootModuleName"];
        if (!moduleName || !tabName) {
            NSLog(@"ARNativeViewControllerManager->TabNavigationStack requires both tabName and moduleName");
            return nil;
        }
        NSDictionary *props = self.viewProps[@"rootModuleProps"];
        return [self getOrCreateNavStackForModule:tabName module:moduleName withProps:props];
    } else {
        return nil;
    }
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

@implementation ARNativeViewControllerManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(viewName, NSString*)
RCT_EXPORT_VIEW_PROPERTY(viewProps, NSDictionary*)

- (UIView *)view
{
    return [[ARNativeViewControllerWrapperView alloc] init];
}

@end
