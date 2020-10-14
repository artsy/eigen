#import "ARScreenPresenterModule.h"
#import "ARTopMenuViewController.h"
#import <Emission/ARComponentViewController.h>
#import "UIDevice-Hardware.h"
#import "ARAdminSettingsViewController.h"
#import "AROptions.h"
#import "ARSerifNavigationViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "Artsy-Swift.h"
#import "AREigenMapContainerViewController.h"
#import "ARAuctionWebViewController.h"
#import "ArtsyEcho.h"
#import "ARAppDelegate+Echo.h"
#import <Emission/ARBidFlowViewController.h>
#import "ARRouter.h"
#import <Emission/ARMediaPreviewController.h>
#import <MessageUI/MFMailComposeViewController.h>

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"

@interface ARScreenPresenterModule () <MFMailComposeViewControllerDelegate>
@end

@implementation ARScreenPresenterModule
RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(presentNativeScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props  modal:(BOOL)modal)
{
    UIModalPresentationStyle modalPresentationStyle = modal ? UIModalPresentationPageSheet : -1;
    // This if .. else chain should match the `NativeModuleName` type in AppRegistry.tsx
    UIViewController *vc = nil;
    if ([moduleName isEqualToString:@"Admin"]) {
        vc = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
    } else if ([moduleName isEqualToString:@"Auction"]) {
        vc = [ARScreenPresenterModule loadAuctionWithID:props[@"id"]];
    } else if ([moduleName isEqualToString:@"AuctionRegistration"]) {
        vc = [ARScreenPresenterModule loadAuctionRegistrationWithID:props[@"id"] skipBidFlow:[props[@"skip_bid_flow"] boolValue]];
    } else if ([moduleName isEqualToString:@"AuctionBidArtwork"]) {
        vc = [ARScreenPresenterModule loadBidUIForArtwork:props[@"artwork_id"] inSale:props[@"id"]];
    } else if ([moduleName isEqualToString:@"LiveAuction"]) {
        if ([AROptions boolForOption:AROptionsDisableNativeLiveAuctions] || [ARScreenPresenterModule requiresUpdateForWebSocketVersionUpdate]) {
            NSString *slug = props[@"slug"];
            NSURL *liveAuctionsURL = [[AREmission sharedInstance] liveAuctionsURL];
            NSURL *auctionURL = [NSURL URLWithString:slug relativeToURL:liveAuctionsURL];
            ARInternalMobileWebViewController *webVC = [[ARInternalMobileWebViewController alloc] initWithURL:auctionURL];
            vc = [[ARSerifNavigationViewController alloc] initWithRootViewController:webVC];
        } else {
            NSString *slug = props[@"slug"];
            vc = [[LiveAuctionViewController alloc] initWithSaleSlugOrID:slug];
        }
        modalPresentationStyle = UIModalPresentationFullScreen;
    } else if ([moduleName isEqualToString:@"LocalDiscovery"]) {
        vc = [[AREigenMapContainerViewController alloc] init];
    } else if ([moduleName isEqualToString:@"WebView"]) {
        vc = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:props[@"url"]]];
        if (modal) {
            vc = [[ARSerifNavigationViewController alloc] initWithRootViewController:vc];
        }
    } else {
        NSAssert(false, @"Unrecognized native module name", moduleName);
    }
    [self presentViewController:vc modalPresentationStyle:modalPresentationStyle];
}

RCT_EXPORT_METHOD(presentReactScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props modal:(BOOL)modal hidesBackButon:(BOOL)hidesBackButton)
{
    UIModalPresentationStyle modalPresentationStyle = modal ? UIModalPresentationPageSheet : -1;

    if ([UIDevice isPad] && [moduleName isEqualToString:@"BidFlow"]) {
        modalPresentationStyle = UIModalPresentationFormSheet;
    }

    ARComponentViewController *vc = [[ARComponentViewController alloc] initWithEmission:nil
                                                                    moduleName:moduleName
                                                             initialProperties:props];
    vc.hidesBackButton = hidesBackButton;

    [self presentViewController:vc modalPresentationStyle:modalPresentationStyle];
}

- (void)presentViewController:(UIViewController *)vc modalPresentationStyle:(UIModalPresentationStyle)modalPresentationStyle
{
    UIViewController *currentVC = [self currentlyPresentedVC];
    if (![currentVC isKindOfClass:UINavigationController.class]) {
        modalPresentationStyle = UIModalPresentationFullScreen;
    }
    if (modalPresentationStyle != -1) {
        vc.modalPresentationStyle = modalPresentationStyle;
        UIViewController *presentingVC = [ARTopMenuViewController sharedController];

        while ([presentingVC presentedViewController]) {
            presentingVC = [presentingVC presentedViewController];
        }
        [presentingVC presentViewController:vc animated:YES completion:nil];
    } else {
        [(UINavigationController *)currentVC pushViewController:vc animated:YES];
    }
}

// This returns either the topmost modal or the current root navigation controller.
- (UIViewController *)currentlyPresentedVC
{
    UIViewController *modalVC = [[ARTopMenuViewController sharedController] presentedViewController];
    if (!modalVC) {
        return [[ARTopMenuViewController sharedController] rootNavigationController];
    }

    while ([modalVC presentedViewController]) {
        modalVC = [modalVC presentedViewController];
    }

    return modalVC;
}

RCT_EXPORT_METHOD(dismissModal)
{
    [[[self currentlyPresentedVC] presentingViewController] dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(goBack)
{
    UIViewController *vc = [self currentlyPresentedVC];
    if ([vc isKindOfClass:UINavigationController.class]) {
        [((UINavigationController *)vc) popViewControllerAnimated:YES];
    } else {
        [self dismissModal];
    }
}

RCT_EXPORT_METHOD(popParentViewController)
{
    UINavigationController *navController = [ARTopMenuViewController sharedController].rootNavigationController;
    [navController popViewControllerAnimated:NO];
}

// TODO: Delete this when moving tab content presentation to typescript
RCT_EXPORT_METHOD(switchTab:(nonnull NSString *)tabType props:(nonnull NSDictionary *)props popToRoot:(BOOL)popToRoot)
{
    [[ARTopMenuViewController sharedController] presentRootViewControllerInTab:tabType animated:YES props:props];
    if (popToRoot) {
        [[[ARTopMenuViewController sharedController] rootNavigationController] popToRootViewControllerAnimated:NO];
    }
}

+ (UIViewController *)loadAuctionWithID:(NSString *)saleID
{
    if ([[[ARAppDelegate sharedInstance] echo] isFeatureEnabled:@"DisableNativeAuctions"] == YES) {
        NSString *path = [NSString stringWithFormat:@"/auction/%@", saleID];
        NSURL *URL = [ARRouter resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:nil];
    } else {
        if ([AROptions boolForOption:AROptionsNewSalePage]) {
            return [[ARComponentViewController alloc] initWithEmission:nil moduleName:@"Auction" initialProperties:@{ @"saleID": saleID }];
        } else {
            return [[AuctionViewController alloc] initWithSaleID:saleID];
        }
    }
}

+ (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow
{
    if ([[[ARAppDelegate sharedInstance] echo] isFeatureEnabled:@"ARDisableReactNativeBidFlow"] == NO && skipBidFlow == NO) {
        ARBidFlowViewController *viewController = [[ARBidFlowViewController alloc] initWithArtworkID:@"" saleID:auctionID intent:ARBidFlowViewControllerIntentRegister];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:viewController];
    } else {
        NSString *path = [NSString stringWithFormat:@"/auction-registration/%@", auctionID];
        NSURL *URL = [ARRouter resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:auctionID artworkID:nil];
    }

}

+ (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID
{
    if ([[[ARAppDelegate sharedInstance] echo] isFeatureEnabled:@"ARDisableReactNativeBidFlow"] == NO) {
        ARBidFlowViewController *viewController = [[ARBidFlowViewController alloc] initWithArtworkID:artworkID saleID:saleID];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:viewController];
    } else {
        NSString *path = [NSString stringWithFormat:@"/auction/%@/bid/%@", saleID, artworkID];
        NSURL *URL = [ARRouter resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:artworkID];
    }
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
                                                hostViewController:[[ARTopMenuViewController sharedController] rootNavigationController]
                                                   originatingView:originatingView] presentPreview];

}

RCT_EXPORT_METHOD(presentEmailComposer:(nonnull NSString *)toAddress subject:(nonnull NSString *)subject body:(NSString *)body)
{
    UIViewController *fromViewController = [ARTopMenuViewController sharedController];
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
                [self presentViewController:viewInRoomVC modalPresentationStyle:UIModalPresentationFullScreen];
            } else {
                ArtsyEcho *echo = [[ArtsyEcho alloc] init];
                [echo setup];

                Message *setupURL = echo.messages[@"ARVIRVideo"];

                NSURL *movieURL = setupURL.content.length ? [NSURL URLWithString:setupURL.content] : nil;
                ARAugmentedVIRSetupViewController *setupVC = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:movieURL config:config];
                setupVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                [self presentViewController:setupVC modalPresentationStyle:UIModalPresentationFullScreen];
            }
        };

        // Try to get a cached image from SDWebImage. This will succeed under normal runtime conditions.
        // But in case there is severe RAM or disk pressure, the image might already be evicted from the cache.
        // In the rare occurence that a cache lookup fails, download the image into the cache first.
        SDWebImageManager *manager = [SDWebImageManager sharedManager];
        if ([manager cachedImageExistsForURL:url]) {
            NSString *key = [manager cacheKeyForURL:url];
            UIImage *image = [manager.imageCache imageFromDiskCacheForKey:key];
            // TODO: Verify that this _does_ actually get a cache hit most often.
            gotImageBlock(image);
        } else {
            [manager downloadImageWithURL:url options:(SDWebImageHighPriority) progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
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
                    [[ARTopMenuViewController sharedController] presentViewController:alert animated:YES completion:nil];
                }
            }];
        }
    }];

}

#pragma mark - MFMailComposeViewControllerDelegate

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(nullable NSError *)error
{
  [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(updateShouldHideBackButton:(BOOL)shouldHide)
{

    [[[ARTopMenuViewController sharedController] rootNavigationController] showBackButton:!shouldHide animated:YES];
}


@end
