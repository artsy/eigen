#import "ARNativeViewControllerManager.h"
#import "AROnboardingViewController.h"
#import "ARSlideshowViewController.h"
#import "UIDevice-Hardware.h"
#import <Emission/ARComponentViewController.h>
#import "ARTopMenuViewController.h"

@interface ARNativeViewControllerWrapperView : UIView

@property (strong, nonatomic) UIViewController* wrappedViewController;

- (UIViewController *)myParentViewController;

@property (nonatomic, readwrite) NSString* viewName;
@property (nonatomic, assign) NSDictionary* viewProps;

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
    if ([self.viewName isEqualToString:@"Onboarding"]) {
        return [[AROnboardingViewController alloc] initWithState:ARInitialOnboardingStateSlideShow];
    } else if ([self.viewName isEqualToString:@"Main"]) {
        return [ARTopMenuViewController sharedController];
    } else {
        return nil;
    }
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
