#import "ARScreenPresenterModule.h"
#import <Emission/ARComponentViewController.h>
#import "UIDevice-Hardware.h"
#import "ARAdminSettingsViewController.h"
#import "AROptions.h"
#import "ARSerifNavigationViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "Artsy-Swift.h"
#import "AREigenMapContainerViewController.h"
#import "ArtsyEcho.h"
#import "ARAppDelegate+Echo.h"
#import "ARRouter.h"
#import <Emission/ARMediaPreviewController.h>
#import <MessageUI/MFMailComposeViewController.h>

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARSerifNavigationViewController.h"
#import "ARModalViewController.h"

#import "UIView+ScrollToTop.h"

@interface ARScreenPresenterModule () <MFMailComposeViewControllerDelegate>
@end

static NSMutableDictionary *_cachedNavigationStacks = nil;

@implementation ARScreenPresenterModule

#ifndef APP_SHELL
RCT_EXPORT_MODULE()
#endif

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(pushView:(nonnull NSString *)currentTabStackID viewDescriptor:(nonnull NSDictionary *)viewDescriptor)
{
    UIViewController *vc = [self getViewControllerForViewDescriptor:viewDescriptor];
    UINavigationController *stack = nil;
    ARModalViewController *currentlyPresentedVC = (id)[self.class currentlyPresentedVC];
    if ([currentlyPresentedVC isKindOfClass:ARModalViewController.class]) {
        // we're showing a modal with a view stack, push it there instead
        stack = currentlyPresentedVC.stack;
    } else {
        stack = [self.class getNavigationStack:currentTabStackID];
    }

    if (!stack && [self.class cachedNavigationStacks].count == 0) {
        // to handle deep links that open the app we need to wait a while for the first nav stack to be instantiated
        deepLinkVC = vc;
        return;
    }

    if ([vc isKindOfClass:ARComponentViewController.class]) {
        ARComponentViewController *reactVC = (ARComponentViewController *)vc;
        // if we're in a modal, get the modal id from the stack map
        NSString *stackID = currentTabStackID;
        if ([currentlyPresentedVC isKindOfClass:ARModalViewController.class]) {
            for(id key in [self.class cachedNavigationStacks]) {
                // if the nav stack with id `key` is the same instance as the one we're about to push to, then `key` is the stackID we want to set.
                if ([self.class cachedNavigationStacks][key] == stack) {
                    stackID = key;
                    break;
                }
            }
        }
        [reactVC setProperty:stackID forKey:@"navStackID"];
    }

    [stack pushViewController:vc animated:YES];
}

RCT_EXPORT_METHOD(presentModal:(nonnull NSDictionary *)viewDescriptor                                         resolve:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject)
{
    UIModalPresentationStyle modalPresentationStyle = [self getModalPresentationStyle:viewDescriptor[@"modalPresentationStyle"]];
    UIViewController *vc = [self getViewControllerForViewDescriptor:viewDescriptor];

    if ([vc isKindOfClass:ARComponentViewController.class]) {
        [((ARComponentViewController *)vc) setProperty:@(YES) forKey:@"isPresentedModally"];
    }

    // TODO: Should this be [viewDescriptor[@"hasOwnModalCloseButton" boolValue] as below?
    BOOL hasOwnModalCloseButton = viewDescriptor[@"hasOwnModalCloseButton"];


    NSString *stackID = [[NSUUID UUID] UUIDString];

    UINavigationController *stack = nil;

    if ([vc isKindOfClass:UINavigationController.class]) {
        stack = (id)vc;
        [self.class cachedNavigationStacks][stackID] = stack;
    } else {
        stack = [self.class createModalNavigationStack:stackID rootViewController:vc withBackButton:!hasOwnModalCloseButton];
    }

    ARModalViewController *modal = [[ARModalViewController alloc] initWithStack:stack];
    modal.modalPresentationStyle = modalPresentationStyle;

    UIViewController *topVC = [self.class currentlyPresentedVC];
    UIViewController *parentVC = [topVC presentingViewController];

    BOOL shouldReplaceTopVC = [viewDescriptor[@"replace"] boolValue];

    if (shouldReplaceTopVC) {
        [parentVC dismissViewControllerAnimated:NO completion:^{
            [parentVC presentViewController:modal animated:YES completion:^{
                resolve(stackID);
            }];
        }];
    } else {
        [topVC presentViewController:modal animated:YES completion:^ {
            resolve(stackID);
        }];
    }
}

- (UIModalPresentationStyle)getModalPresentationStyle:(NSString *)string {
    if (!string) {
        return UIModalPresentationPageSheet;
    } else if ([string isEqualToString:@"fullScreen"]) {
        return UIModalPresentationFullScreen;
    } else if ([string isEqualToString:@"formSheet"]) {
        return UIModalPresentationFormSheet;
    }
    return UIModalPresentationPageSheet;
}

- (UIViewController *)getViewControllerForViewDescriptor:(NSDictionary *)viewDescriptor
{
    UIViewController *vc = nil;
    NSString *type = viewDescriptor[@"type"];
    NSString *moduleName = viewDescriptor[@"moduleName"];
    NSDictionary *props = viewDescriptor[@"props"];
    BOOL hidesBackButton = viewDescriptor[@"hidesBackButton"];

    if ([type isEqualToString:@"react"]) {
        vc = [ARComponentViewController module:moduleName withProps:props];
        if (hidesBackButton) {
            ((ARComponentViewController *)vc).hidesBackButton = true;
        }
    } else if ([moduleName isEqualToString:@"Admin"]) {
        vc = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
    } else if ([moduleName isEqualToString:@"LiveAuction"]) {
        if ([AROptions boolForOption:AROptionsDisableNativeLiveAuctions] || [self.class requiresUpdateForWebSocketVersionUpdate]) {
            NSString *slug = props[@"slug"];
            NSURL *liveAuctionsURL = [[AREmission sharedInstance] liveAuctionsURL];
            NSURL *auctionURL = [NSURL URLWithString:slug relativeToURL:liveAuctionsURL];
            ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:auctionURL];
            vc = [[ARSerifNavigationViewController alloc] initWithRootViewController:webVC];
        } else {
            NSString *slug = props[@"slug"];
            vc = [[LiveAuctionViewController alloc] initWithSaleSlugOrID:slug];
        }
    } else if ([moduleName isEqualToString:@"LocalDiscovery"]) {
        vc = [[AREigenMapContainerViewController alloc] init];
    } else if ([moduleName isEqualToString:@"WebView"]) {
        vc = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:props[@"url"]]];
    } else {
        NSAssert(false, @"Unrecognized native module name", moduleName);
    }

    return vc;
}

+ (UIViewController *)currentlyPresentedVC
{
    UIViewController *vc = [[ARAppDelegate sharedInstance] window].rootViewController;

    while ([vc presentedViewController] && [[vc presentedViewController] isKindOfClass:ARModalViewController.class]) {
        vc = [vc presentedViewController];
    }

    return vc;
}

RCT_EXPORT_METHOD(dismissModal)
{
    [[[self.class currentlyPresentedVC] presentingViewController] dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(goBack:(nonnull NSString *)currentTabStackID)
{
    UINavigationController *vc = (id)[self.class currentlyPresentedVC];
    if ([vc presentingViewController] && [vc isKindOfClass:ARModalViewController.class]) {
        // it's a modal
        if ([vc isKindOfClass:ARModalViewController.class] && ((ARModalViewController *)vc).stack.viewControllers.count > 1) {
            [((ARModalViewController *)vc).stack popViewControllerAnimated:YES];
        } else {
            [self dismissModal];
        }
    } else {
        // we're in a root tab stack
        vc = [self.class getNavigationStack:currentTabStackID];
        [vc popViewControllerAnimated:YES];
    }
}

RCT_EXPORT_METHOD(popStack:(nonnull NSString *)stackID)
{
    [[self.class getNavigationStack:stackID] popViewControllerAnimated:YES];
}

RCT_EXPORT_METHOD(popToRootOrScrollToTop:(nonnull NSString *)stackID)
{
    UINavigationController *stack = [self.class getNavigationStack:stackID];
    if (stack.viewControllers.count > 1) {
        [stack popToRootViewControllerAnimated:YES];
    } else {
        [stack.viewControllers[0].view ar_scrollToTopAnimated:YES];
    }
}

RCT_EXPORT_METHOD(popToRootAndScrollToTop:(nonnull NSString *)stackID
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    UINavigationController *stack = [self.class getNavigationStack:stackID];
    [stack popToRootViewControllerAnimated:YES];
    [stack.viewControllers[0].view ar_scrollToTopAnimated:YES];
    resolve(nil);
}

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking causality change.
NSInteger const ARLiveAuctionsCurrentWebSocketVersionCompatibility = 4;

+ (BOOL)requiresUpdateForWebSocketVersionUpdate
{
    Message *webSocketVersion = ARAppDelegate.sharedInstance.echo.messages[@"LiveAuctionsCurrentWebSocketVersion"];
    return webSocketVersion.content.integerValue > ARLiveAuctionsCurrentWebSocketVersionCompatibility;
}

RCT_EXPORT_METHOD(presentMediaPreviewController:(nonnull NSNumber *)reactTag route:(nonnull NSURL *)route mimeType:(nonnull NSString *)mimeType cacheKey:(nullable NSString *)cacheKey)
{
    UIView *originatingView = [self.bridge.uiManager viewForReactTag:reactTag];
    [[ARMediaPreviewController mediaPreviewControllerWithRemoteURL:route
                                                          mimeType:mimeType
                                                          cacheKey:cacheKey
                                                hostViewController:[self.class currentlyPresentedVC]
                                                   originatingView:originatingView] presentPreview];

}

/**
   We want an optional body parameter but are getting errors in debug mode when not passing, to get around this instead have two
   methods one with body param and one without and choose which to use based on params passed in js
 */
RCT_EXPORT_METHOD(presentEmailComposerWithBody:(NSString *)body subject:(NSString *)subject toAddress:(NSString *)toAddress)
{
    [self presentNativeEmailComposer:toAddress subject:subject body:body];
}

RCT_EXPORT_METHOD(presentEmailComposerWithSubject:(NSString *)subject toAddress:(NSString *)toAddress)
{
    [self presentNativeEmailComposer:toAddress subject:subject body:nil];
}

- (void)presentNativeEmailComposer:(nonnull NSString *)toAddress subject:(nonnull NSString *)subject body:(nullable NSString *)body {
    UIViewController *fromViewController = [self.class currentlyPresentedVC];
    if ([MFMailComposeViewController canSendMail]) {
      MFMailComposeViewController *composer = [[MFMailComposeViewController alloc] init];
      composer.mailComposeDelegate = self;
      [composer setToRecipients:@[toAddress]];
      [composer setSubject:subject];
      if (body) {
        [composer setMessageBody:body isHTML:NO];
      }
      [fromViewController presentViewController:composer animated:YES completion:nil];
    } else {
      UIAlertController *alert = [UIAlertController
                                  alertControllerWithTitle:@"No email configured"
                                  message:[NSString stringWithFormat:@"You don't appear to have any email configured on your device. Please email %@ from another device.", toAddress]
                                  preferredStyle:UIAlertControllerStyleAlert];
      [alert addAction:[UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleCancel handler:nil]];
      [fromViewController presentViewController:alert animated:YES completion:nil];
    }
}

RCT_EXPORT_METHOD(presentAugmentedRealityVIR:(NSString *)imgUrl width:(CGFloat)widthIn height:(CGFloat)heightIn artworkSlug:(NSString *)artworkSlug artworkId:(NSString *)artworkId)
{
    BOOL supportsARVIR = [ARAugmentedVIRSetupViewController canOpenARView];
    if (!supportsARVIR) {
        // we don't expect emission to call this when there's no AR support
        return;
    }
    // A bit weird, eh? Normally CGSize stores width+height in terms of pixels, but this one is stored in inches instead.
    CGSize size = CGSizeMake(widthIn, heightIn);
    NSURL *url = [NSURL URLWithString:imgUrl];

    [ARAugmentedVIRSetupViewController canSkipARSetup:[NSUserDefaults standardUserDefaults] callback:^(bool allowedAccess) {
        // The image can come from either the SDWebImage cache or from the internet.
        // In either case, this block gets called with that image.
        void (^gotImageBlock)(UIImage *image) = ^void(UIImage *image) {
            ARAugmentedRealityConfig *config = [[ARAugmentedRealityConfig alloc] initWithImage:image size:size];
            config.artworkID = artworkId;
            config.artworkSlug = artworkSlug;
            config.floorBasedVIR = YES;
            config.debugMode =  [AROptions boolForOption:AROptionsDebugARVIR];

            if (allowedAccess) {
                ARAugmentedFloorBasedVIRViewController *viewInRoomVC = [[ARAugmentedFloorBasedVIRViewController alloc] initWithConfig:config];
                viewInRoomVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                [[self.class currentlyPresentedVC] presentViewController:viewInRoomVC animated:YES completion:nil];
            } else {
                ArtsyEcho *echo = [[ArtsyEcho alloc] init];
                [echo setup];

                Message *setupURL = echo.messages[@"ARVIRVideo"];

                NSURL *movieURL = setupURL.content.length ? [NSURL URLWithString:setupURL.content] : nil;
                ARAugmentedVIRSetupViewController *setupVC = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:movieURL config:config];
                setupVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                [[self.class currentlyPresentedVC] presentViewController:setupVC animated:YES completion:nil];
            }
        };

        // Try to get a cached image from SDWebImage. This will succeed under normal runtime conditions.
        // But in case there is severe RAM or disk pressure, the image might already be evicted from the cache.
        // In the rare occurence that a cache lookup fails, download the image into the cache first.
        SDWebImageManager *manager = [SDWebImageManager sharedManager];
        NSString *key = [manager cacheKeyForURL:url];
                [manager.imageCache containsImageForKey:key cacheType:SDImageCacheTypeAll completion:^(SDImageCacheType containsCacheType) {
                    if (containsCacheType != SDImageCacheTypeNone) {
                        [manager.imageCache queryImageForKey:key options:0 context:nil cacheType:containsCacheType completion:^(UIImage * _Nullable image, NSData * _Nullable data, SDImageCacheType cacheType) {
                            // TODO: Verify that this _does_ actually get a cache hit most often.
                    gotImageBlock(image);
                        }];
                    } else {
                        [manager loadImageWithURL:url options:SDWebImageHighPriority progress:nil completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable imageURL) {
                            if (finished && !error) {
                                gotImageBlock(image);
                            } else {
                                // Errors are unlikely to happen, but we should handle them just in case.
                                // This represents both an image cache-miss _and_ a failure to
                                // download the image on its own. Very unlikely.
                                NSLog(@"[ARAppDelegate+Emission] Couldn't download image for AR VIR (%@, %@): %@", artworkSlug, imageURL, error);
                                UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Failed to Load Image" message:@"We could not download the image to present in View-in-Room." preferredStyle:UIAlertControllerStyleAlert];
                                UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
                                [alert addAction:defaultAction];
                                [[self.class currentlyPresentedVC] presentViewController:alert animated:YES completion:nil];
                            }
                        }];
                    }
                }];
                }];
}

#pragma mark - MFMailComposeViewControllerDelegate

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(nullable NSError *)error
{
  [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(updateShouldHideBackButton:(BOOL)shouldHide currentTabStackID:(NSString *)currentTabStackID)
{
    ARModalViewController *vc = (id)[self.class currentlyPresentedVC];
    ARNavigationController *stack = nil;

    if ([vc isKindOfClass:ARModalViewController.class]) {
        // we're presenting a modal, update its back button
        stack = (id)vc.stack;
    } else {
        stack = (id)[self.class getNavigationStack:currentTabStackID];
    }

    if ([stack isKindOfClass:ARNavigationController.class]) {
        [stack showBackButton:!shouldHide animated:YES];
    }
}

#pragma mark - Nav stacks

static UIViewController *deepLinkVC = nil;

+ (NSMutableDictionary *)cachedNavigationStacks
{
    if (_cachedNavigationStacks == nil) {
        _cachedNavigationStacks = [[NSMutableDictionary alloc] init];
    }
    return _cachedNavigationStacks;
}

+ (void)clearCachedNavigationStacks
{
    @synchronized (self) {
        _cachedNavigationStacks = [[NSMutableDictionary alloc] init];
    }
}

+ (ARNavigationController *)getNavigationStack:(NSString *)stackID
{
    return (ARNavigationController *)[self cachedNavigationStacks][stackID];
}

+ (ARNavigationController *)createNavigationStack:(NSString *)stackID rootViewController:(UIViewController *)rootViewController
{
    @synchronized (self) {
        if ([rootViewController isKindOfClass:ARComponentViewController.class]) {
            ARComponentViewController *reactVC = (ARComponentViewController *)rootViewController;
            [reactVC setProperty:stackID forKey:@"navStackID"];
        }

        ARNavigationController *stack = [[ARNavigationController alloc] initWithRootViewController:rootViewController];
        [self cachedNavigationStacks][stackID] = stack;
        if (deepLinkVC) {
            [stack pushViewController:deepLinkVC animated:NO];
            deepLinkVC = nil;
        }
        return stack;
    }
}

+ (UINavigationController *)createModalNavigationStack:(NSString *)stackID rootViewController:(UIViewController *)rootViewController withBackButton:(BOOL)withBackButton
{
    @synchronized (self) {
        if (!withBackButton) {
            return [self createNavigationStack:stackID rootViewController:rootViewController];
        }

        ARSerifNavigationViewController *stack = [[ARSerifNavigationViewController alloc] initWithRootViewController:rootViewController];
        [self cachedNavigationStacks][stackID] = stack;
        return stack;
    }
}

+ (void)removeNavigationStack:(NSString *)stackID
{
    @synchronized (self) {
        [[self cachedNavigationStacks] removeObjectForKey:stackID];
    }
}

@end
