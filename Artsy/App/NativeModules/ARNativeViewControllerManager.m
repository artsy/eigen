#import "ARNativeViewControllerManager.h"
#import "AROnboardingViewController.h"
#import "ARSlideshowViewController.h"
#import "UIDevice-Hardware.h"
#import <Emission/ARComponentViewController.h>
#import <React/RCTRootView.h>
#import "ARScreenPresenterModule.h"
#import "ARAdminSettingsViewController.h"
#import "AROptions.h"
#import <Emission/AREmission.h>
#import "ARInternalMobileWebViewController.h"
#import "ARSerifNavigationViewController.h"
#import "Artsy-Swift.h"
#import "AREigenMapContainerViewController.h"
#import <Aerodramus/Message.h>
#import "ARAppDelegate+Echo.h"

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

- (UIViewController *)getWrappedViewController {
    UIViewController *vc = nil;
    
    if ([self.viewName isEqualToString:@"Admin"]) {
        vc = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
    } else if ([self.viewName isEqualToString:@"LiveAuction"]) {
        if ([AROptions boolForOption:AROptionsDisableNativeLiveAuctions] || [self.class requiresUpdateForWebSocketVersionUpdate]) {
            NSString *slug = self.viewProps[@"slug"];
            NSURL *liveAuctionsURL = [[AREmission sharedInstance] liveAuctionsURL];
            NSURL *auctionURL = [NSURL URLWithString:slug relativeToURL:liveAuctionsURL];
            ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:auctionURL];
            vc = [[ARSerifNavigationViewController alloc] initWithRootViewController:webVC];
        } else {
            NSString *slug = self.viewProps[@"slug"];
            vc = [[LiveAuctionViewController alloc] initWithSaleSlugOrID:slug];
        }
    } else if ([self.viewName isEqualToString:@"LocalDiscovery"]) {
        vc = [[AREigenMapContainerViewController alloc] init];
    } else if ([self.viewName isEqualToString:@"WebView"]) {
        vc = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:self.viewProps[@"url"]]];
    } else if ([self.viewName isEqualToString:@"Onboarding"]) {
        return [[AROnboardingViewController alloc] init];
    } else {
        NSAssert(false, @"Unrecognized native module name", self.viewName);
    }
    
    return vc;
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

+ (NSInteger) ARLiveAuctionsCurrentWebSocketVersionCompatibility { return 4; }

+ (BOOL)requiresUpdateForWebSocketVersionUpdate
{
    Message *webSocketVersion = ARAppDelegate.sharedInstance.echo.messages[@"LiveAuctionsCurrentWebSocketVersion"];
    return webSocketVersion.content.integerValue > self.ARLiveAuctionsCurrentWebSocketVersionCompatibility;
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
