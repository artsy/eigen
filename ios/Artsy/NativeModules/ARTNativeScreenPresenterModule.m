#import "ARTNativeScreenPresenterModule.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ArtsyEcho.h"
#import "AROptions.h"
#import "AppDelegate+Echo.h"
#import "ARAuctionWebViewController.h"
#import "ARRouter.h"
#import <SDWebImage/SDWebImageManager.h>
#import "Artsy-Swift.h"

#import <MessageUI/MFMailComposeViewController.h>
#import "ARDispatchManager.h"
#import "ARMediaPreviewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@interface ARTNativeScreenPresenterModule () <MFMailComposeViewControllerDelegate>
@end

@implementation ARTNativeScreenPresenterModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(presentAugmentedRealityVIR:(NSString *)imgUrl width:(CGFloat)widthIn height:(CGFloat)heightIn artworkSlug:(NSString *)artworkSlug artworkId:(NSString *)artworkId)
{
    BOOL supportsARVIR = [ARAugmentedVIRSetupViewController canOpenARView];
    BOOL hasLidarEnabledDevice = [ARAugmentedVIRSetupViewController hasLidarEnabledDevice];
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
            config.debugMode = [AROptions boolForOption:AROptionsDebugARVIR];

            if (allowedAccess) {
                if (hasLidarEnabledDevice) { // Lidar device we can do instant vertical detection
                    ARAugmentedWallBasedVIRViewController *viewInRoomWallVC = [[ARAugmentedWallBasedVIRViewController alloc] init];
                    [viewInRoomWallVC initWithConfig:config];
                    viewInRoomWallVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                    viewInRoomWallVC.modalPresentationStyle = UIModalPresentationFullScreen;
                    [[self.class currentlyPresentedVC] presentViewController:viewInRoomWallVC animated:YES completion:nil];
                } else {
                    ARAugmentedFloorBasedVIRViewController *viewInRoomVC = [[ARAugmentedFloorBasedVIRViewController alloc] initWithConfig:config];
                    viewInRoomVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                    viewInRoomVC.modalPresentationStyle = UIModalPresentationFullScreen;
                    [[self.class currentlyPresentedVC] presentViewController:viewInRoomVC animated:YES completion:nil];
                }
            } else {
                ArtsyEcho *echo = [[ArtsyEcho alloc] init];
                [echo setup];

                Message *setupURL = echo.messages[@"ARVIRVideo"];

                NSURL *movieURL = setupURL.content.length ? [NSURL URLWithString:setupURL.content] : nil;
                ARAugmentedVIRSetupViewController *setupVC = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:movieURL config:config];
                setupVC.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                setupVC.modalPresentationStyle = UIModalPresentationFullScreen;
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
                                [[ARTNativeScreenPresenterModule currentlyPresentedVC] presentViewController:alert animated:YES completion:nil];
                            }
                        }];
                    }
                }];
        }];
}

/**
   Preview media such as PDFs and Images
 */
RCT_EXPORT_METHOD(presentMediaPreviewController:(nonnull NSNumber *)reactTag route:(nonnull NSURL *)route mimeType:(nonnull NSString *)mimeType cacheKey:(nullable NSString *)cacheKey)
{
    ar_dispatch_main_queue(^{
        UIView *originatingView = [self.bridge.uiManager viewForReactTag:reactTag];
        UIViewController *currentlyPresentedVC = [self.class currentlyPresentedVC];
        ARMediaPreviewController *previewVC = [ARMediaPreviewController mediaPreviewControllerWithRemoteURL:route
                                                              mimeType:mimeType
                                                              cacheKey:cacheKey
                                                    hostViewController:currentlyPresentedVC
                                                       originatingView:originatingView];
       [previewVC presentPreview];
    });
}


/**
   We want an optional body parameter but are getting errors in debug mode when not passing, to get around this instead have two
   methods one with body param and one without and choose which to use based on params passed in js
 */
RCT_EXPORT_METHOD(presentEmailComposerWithBody:(NSString *)body subject:(NSString *)subject toAddress:(NSString *)toAddress)
{
  ar_dispatch_main_queue(^{
    [self presentNativeEmailComposer:toAddress subject:subject body:body];
  });
}

RCT_EXPORT_METHOD(presentEmailComposerWithSubject:(NSString *)subject toAddress:(NSString *)toAddress)
{
  ar_dispatch_main_queue(^{
     [self presentNativeEmailComposer:toAddress subject:subject body:nil];
  });
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

+ (UIViewController *)loadWebViewAuctionRegistrationWithID:(NSString *)auctionID
{
    NSString *path = [NSString stringWithFormat:@"/auction/%@/register", auctionID];
    NSURL *URL = [ARRouter resolveRelativeUrl:path];
    return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:auctionID artworkID:nil];
}

#pragma mark - MFMailComposeViewControllerDelegate

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(nullable NSError *)error
{
  [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - HELPER

+ (UIViewController *)currentlyPresentedVC
{
    UIViewController *vc = [[ARAppDelegate sharedInstance] window].rootViewController;

    while ([vc presentedViewController]) {
        vc = [vc presentedViewController];
    }

    return vc;
}

@end
