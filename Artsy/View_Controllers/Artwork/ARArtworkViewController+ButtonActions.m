#import <ARAnalytics/ARAnalytics.h>
#import <ObjectiveSugar/NSArray+ObjectiveSugar.h>
#import <Adjust/Adjust.h>

#import "ArtsyEcho.h"
#import "ArtsyEcho+BNMO.h"
#import "ARAuctionWebViewController.h"
#import "Artist.h"
#import "Artwork.h"
#import "ArtsyAPI+Artworks.h"
#import "ARArtworkViewController+ButtonActions.h"
#import "ARZoomArtworkImageViewController.h"
#import "ARSerifNavigationViewController.h"
#import "ARArtworkInfoViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARSharingController.h"
#import "ARArtworkPreviewImageView.h"
#import "ARHeartButton.h"
#import "ARRouter.h"
#import "ARInternalMobileWebViewController.h"
#import "ARBidButton.h"
#import "ARAnalyticsConstants.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "Partner.h"
#import "User.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARNetworkErrorManager.h"
#import "UIViewController+TopMenuViewController.h"
#import "ARTopMenuViewController.h"
#import "ARLogger.h"
#import "Artsy-Swift.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARTopMenuViewController.h"
#import "AREigenInquiryComponentViewController.h"
#import <Emission/ARBidFlowViewController.h>
#import "ARFullWidthCalloutLabelView.h"

@implementation ARLegacyArtworkViewController (ButtonActions)

#pragma mark - ARArtworkPreviewImageViewDelegate

- (void)tappedTileableImagePreview
{
    ARZoomArtworkImageViewController *zoomImageVC = [[ARZoomArtworkImageViewController alloc] initWithImage:self.artwork.defaultImage];
    zoomImageVC.suppressZoomViewCreation = (self.fair == nil);
    [self.navigationController pushViewController:zoomImageVC animated:ARPerformWorkAsynchronously];
}

#pragma mark - ARArtworkPreviewActionsViewDelegate

- (void)showInformationBannerForVIR:(UIView *)virButton
{
    // First time user, and can show AR
    if (![[NSUserDefaults standardUserDefaults] boolForKey:ARAugmentedRealityHasSeenSetup] && [ARAugmentedVIRSetupViewController canOpenARView]) {
        ARFullWidthCalloutLabelView *callout = [[ARFullWidthCalloutLabelView alloc] initWithTitle:@"See what this work looks like on your wall." delegate:self];
        [callout addToRootView:self.view highlightView:virButton animated:YES];
    }
}

- (void)tappedOnLabelSide:(ARFullWidthCalloutLabelView *)view
{
    [view dismissAnimated:YES];
    [self tappedArtworkViewInRoom];
}

- (void)tappedArtworkFavorite:(ARHeartButton *)sender
{
    BOOL hearted = !sender.hearted;
    [sender setHearted:hearted animated:YES];

    [self.artwork setFollowState:sender.isHearted success:^(id json) {
        // NO-OP
    } failure:^(NSError *error) {
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to save artwork."];
        [sender setHearted:!hearted animated:YES];
    }];
}

- (void)tappedArtworkShare:(UIButton *)sender
{
    NSURL *thumbnailImageURL = nil;
    UIImage *image = nil;
    if (self.artwork.defaultImage.downloadable) {
        thumbnailImageURL = self.artwork.defaultImage.urlForThumbnailImage;
        image = self.imageView.image;
    } else if (self.artwork.canShareImage) {
        thumbnailImageURL = self.artwork.defaultImage.urlForThumbnailImage;
    }
    ARSharingController *sharingController = [ARSharingController sharingControllerWithObject:self.artwork
                  thumbnailImageURL:thumbnailImageURL
                              image:image];
    [sharingController presentActivityViewControllerFromView:sender];
}

- (void)tappedArtworkViewInRoom
{
    BOOL supportsARVIR = [ARAugmentedVIRSetupViewController canOpenARView];
    if (supportsARVIR) {
        [ARAugmentedVIRSetupViewController canSkipARSetup:[NSUserDefaults standardUserDefaults] callback:^(bool shouldSkipSetup) {

            CGSize size = CGSizeMake(self.artwork.widthInches, self.artwork.heightInches);
            ARAugmentedRealityConfig *config = [[ARAugmentedRealityConfig alloc] initWithImage:self.imageView.image size:size];
            config.artworkID = self.artwork.artworkUUID;
            config.artworkSlug = self.artwork.artworkID;
            config.floorBasedVIR = YES;
            config.debugMode =  [AROptions boolForOption:AROptionsDebugARVIR];

            // @available check is to silence compiler warning; it is guaranteed by +canOpenARView.
            if (@available(iOS 11.3, *)) {
                if (shouldSkipSetup) {
                    id viewInRoomVC = [[ARAugmentedFloorBasedVIRViewController alloc] initWithConfig:config];
                    [self.navigationController pushViewController:viewInRoomVC animated:ARPerformWorkAsynchronously];
                } else {
                    // Currently an empty string, which is interpreted as nil
                    // When a video is set, go to:
                    // https://echo-web-production.herokuapp.com/accounts/1/messages
                    // (Creds in 1pass) and update the ARVIRVideo message with the full URL
                    //
                    ArtsyEcho *echo = [[ArtsyEcho alloc] init];
                    [echo setup];
                    
                    Message *setupURL = echo.messages[@"ARVIRVideo"];
                    
                    
                    NSURL *movieURL = setupURL.content.length ? [NSURL URLWithString:setupURL.content] : nil;
                    ARAugmentedVIRSetupViewController *setupVC = [[ARAugmentedVIRSetupViewController alloc] initWithMovieURL:movieURL config:config];
                    [self.navigationController pushViewController:setupVC animated:ARPerformWorkAsynchronously];
                }
            }
        }];
    } else {
        ARViewInRoomViewController *viewInRoomVC = [[ARViewInRoomViewController alloc] initWithArtwork:self.artwork];
        [self.navigationController pushViewController:viewInRoomVC animated:ARPerformWorkAsynchronously];
    }
}

#pragma mark - ARArtworkActionsViewButtonDelegate

- (void)tappedContactGallery
{
    if (ARIsRunningInDemoMode) {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:nil message:@"Feature not enabled for this demo" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *okay = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [self dismissViewControllerAnimated:YES completion:nil];
        }];
        [alert addAction:okay];
        [self presentViewController:alert animated:YES completion:nil];
        
        return;
    }

    AREigenInquiryComponentViewController *inquireVC = [[AREigenInquiryComponentViewController alloc] initWithArtworkID:self.artwork.artworkID];
    ARNavigationController* wrapperNav = [[ARNavigationController alloc] initWithRootViewController:inquireVC];
    [[ARTopMenuViewController sharedController] presentViewController:wrapperNav animated:YES completion:nil];
}

- (void)tappedAuctionInfo
{
    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/how-auctions-work"]];
    [[ARTopMenuViewController sharedController] pushViewController:viewController];
}

- (void)tappedLiveSaleButton:(UIButton *)button
{
    button.enabled = false;
    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        button.enabled = true;
        LiveAuctionViewController *viewController = [[LiveAuctionViewController alloc] initWithSaleSlugOrID:saleArtwork.auction.saleID];
        [self presentViewController:viewController animated:true completion:nil];
    } failure:^(NSError *error) {
        ARErrorLog(@"Can't get sale to bid for artwork %@. Error: %@", self.artwork.artworkID, error.localizedDescription);
    }];
}

- (void)tappedConditionsOfSale
{
    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/conditions-of-sale"]];
    [[ARTopMenuViewController sharedController] pushViewController:viewController];
}

- (void)tappedBidButton:(UIButton *)button saleID:(NSString *)saleID
{
    [ARAnalytics setUserProperty:@"has_started_bid" toValue:@"true"];

    ADJEvent *event = [ADJEvent eventWithEventToken:ARAdjustSentArtworkInquiry];
    [Adjust trackEvent:event];

    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadBidUIForArtwork:self.artwork.artworkID inSale:saleID];
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)tappedBuyersPremium:(UIButton *)button
{
    button.enabled = false;
    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        button.enabled = true;
        NSString *path = [NSString stringWithFormat:@"/auction/%@/buyers-premium", saleArtwork.auction.saleID];
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:path fair:self.fair];
        [self.navigationController pushViewController:viewController animated:ARPerformWorkAsynchronously];

    } failure:^(NSError *error) {
        ARErrorLog(@"Can't get sale to bid for artwork %@. Error: %@", self.artwork.artworkID, error.localizedDescription);
    }];
}

- (void)tappedMakeOfferButton
{
    [ArtsyAPI createOfferOrderWithArtworkID:self.artwork.artworkUUID success:^(id results) {
        [self handleOrderCreationOrderOrError:results[@"data"][@"ecommerceCreateOfferOrderWithArtwork"]];
    } failure:^(NSError *error) {
        [self presentErrorMessage:@"Something went wrong. Please try again or contact support@artsy.net."];
    }];
}

- (void)tappedBuyButton
{
    // We currently don't have a UI for a user to select from multiple editions. Instead, send the user
    // to the inquiry form.
    if (!self.artwork.isBuyNowable || !self.echo.isBuyNowAccessible) {
        [self tappedContactGallery];
        return;
    }

    // Buy now
    [ArtsyAPI createBuyNowOrderWithArtworkID:self.artwork.artworkUUID success:^(id results) {
        [self handleOrderCreationOrderOrError:results[@"data"][@"ecommerceCreateOrderWithArtwork"]];
    } failure:^(NSError *error) {
        [self presentErrorMessage:@"Something went wrong. Please try again or contact support@artsy.net."];
    }];
}

- (void)handleOrderCreationOrderOrError:(id)orderOrError
{
    NSString *orderID = orderOrError[@"orderOrError"][@"order"][@"id"];
    if (!orderID) {
        [self presentErrorMessage:@"Something went wrong. Please try again or contact support@artsy.net."];
        return;
    }
    NSString *path = self.echo.routes[@"ARBuyNowRoute"].path;
    if (!path) {
        // path should never be nil, but I'd rather not crash the app if it is.
        path = @"/order/:id";
    }
    path = [path stringByReplacingOccurrencesOfString:@":id" withString:orderID];
    UIViewController *controller = [ARSwitchBoard.sharedInstance loadPath:path];
    ARSerifNavigationViewController *navigationController = [[ARSerifNavigationViewController alloc] initWithRootViewController:controller hideNavigationBar:YES];
    [self presentViewController:navigationController animated:YES completion:nil];
}

- (void)tappedMoreInfo
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadMoreInfoForArtwork:self.artwork];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)presentErrorMessage:(NSString *)errorMessage
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"An error occurred" message:errorMessage preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okay = [UIAlertAction actionWithTitle:@"Continue" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }];
    [alert addAction:okay];
    [self presentViewController:alert animated:YES completion:nil];
}

#pragma mark - ARArtworkDetailViewDelegate

- (void)tappedOpenArtworkPartner
{
    Partner *partner = self.artwork.partner;
    if (self.fair) {
        [ArtsyAPI getShowsForArtworkID:self.artwork.artworkID inFairID:self.fair.fairID success:^(NSArray *shows) {
            if (shows.count > 0) {
                UIViewController *viewController = [ARSwitchBoard.sharedInstance loadShow:shows.firstObject fair:self.fair];
                [self.navigationController pushViewController:viewController animated:YES];
            }
        } failure:^(NSError *error){
            // ignore
        }];
    } else if (partner.defaultProfilePublic) {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPartnerWithID:partner.profileID];
        if (viewController) {
            [self.navigationController pushViewController:viewController animated:YES];
        }
    } else if (partner.website.length) {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:[NSURL URLWithString:partner.website]];
        if (viewController) {
            [self.navigationController pushViewController:viewController animated:YES];
        }
    }
}

- (void)tappedOpenFair
{
    Fair *fair = self.fair ?: self.artwork.fair;
    NSString *fairID = fair.defaultProfileID ?: fair.organizer.profileID;
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadProfileWithID:fairID];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)tappedOpenArtworkArtist
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadArtistWithID:self.artwork.artist.artistID inFair:self.fair];
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
