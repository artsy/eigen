#import "ARArtworkViewController+ButtonActions.h"
#import "ARZoomArtworkImageViewController.h"
#import "ARArtworkInfoViewController.h"
#import "ARAuctionArtworkResultsViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARSharingController.h"
#import "ARArtworkPreviewImageView.h"
#import "ARShowViewController.h"
#import "ARHeartButton.h"
#import "ARFairViewController.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARRouter.h"
#import "ARInternalMobileWebViewController.h"
#import "ARFairMapViewController.h"
#import "ARBidButton.h"

@implementation ARArtworkViewController (ButtonActions)

- (void)tappedTileableImagePreview:(ARArtworkPreviewImageView *)sender
{
    ARZoomArtworkImageViewController *zoomImgeVC = [[ARZoomArtworkImageViewController alloc] initWithImage:self.artwork.defaultImage];
    zoomImgeVC.suppressZoomViewCreation = (self.fair == nil);
    [self.navigationController pushViewController:zoomImgeVC animated:self.shouldAnimate];
}

- (void)tappedArtworkFavorite:(ARHeartButton *)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtwork fromTarget:self selector:_cmd];
        return;
    }

    BOOL hearted = !sender.hearted;
    [sender setHearted:hearted animated:YES];

    [self.artwork setFollowState:sender.isHearted success:^(id json) {
        [NSNotificationCenter.defaultCenter postNotificationName:ARFairRefreshFavoritesNotification object:nil];
    } failure:^(NSError *error) {
        [ARNetworkErrorManager presentActiveErrorModalWithError:error];
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
    [sharingController presentActivityViewControllerFromButton:sender];
}


- (void)tappedArtworkViewInRoom:(id)sender
{
    ARViewInRoomViewController *viewInRoomVC = [[ARViewInRoomViewController alloc] initWithArtwork:self.artwork];
    [self.navigationController pushViewController:viewInRoomVC animated:self.shouldAnimate];
}

- (void)tappedArtworkViewInMap:(id)sender
{
    [ArtsyAPI getShowsForArtworkID:self.artwork.artworkID inFairID:self.fair.fairID success:^(NSArray *shows) {
        if (shows.count > 0) {
            ARFairMapViewController *viewController = [[ARSwitchBoard sharedInstance] loadMapInFair:self.fair title:self.artwork.partner.name selectedPartnerShows:shows];
            [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
        }
    } failure:^(NSError *error) {
        // ignore
    }];
}

- (void)tappedBidButton:(ARBidButton *)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextAuctionBid fromTarget:self selector:_cmd];
        return;
    }
    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        [self bidCompelted:saleArtwork];
    } failure:^(NSError *error) {
        ARErrorLog(@"Can't get sale to bid for artwork %@. Error: %@", self.artwork.artworkID, error.localizedDescription);
    }];
}

- (void)bidCompelted:(SaleArtwork *)saleArtwork
{
    [ARAnalytics setUserProperty:@"has_started_bid" toValue:@"true"];

    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadBidUIForArtwork:self.artwork.artworkID
                                                                 inSale:saleArtwork.auction.saleID];
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)tappedBuyersPremium:(ARButton *)sender
{
    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        NSString *path = [NSString stringWithFormat:@"/auction/%@/buyers-premium", saleArtwork.auction.saleID];
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:path fair:self.fair];
        [self.navigationController pushViewController:viewController animated:self.shouldAnimate];

    } failure:^(NSError *error) {
        ARErrorLog(@"Can't get sale to bid for artwork %@. Error: %@", self.artwork.artworkID, error.localizedDescription);
    }];
}

- (void)tappedBuyButton:(ARButton *)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextArtworkOrder fromTarget:self selector:_cmd];
        return;
    }

    // We currently don't have a UI for a user to select from multiple editions. Instead, send the user
    // to the inquiry form.
    if (self.artwork.hasMultipleEditions) {
        [self tappedContactGallery:sender];
        return;
    }

    // If the artwork has only 1 edition, use that edition id. Otherwise our POST request will fail.
    NSString *editionSetID = nil;
    if (self.artwork.editionSets.count > 0) {
        editionSetID = [[self.artwork.editionSets objectAtIndex:0] valueForKey:@"id"];
    }

    // create a new order
    NSURLRequest *request = [ARRouter newPendingOrderWithArtworkID:self.artwork.artworkID editionSetID:editionSetID];

    @weakify(self);
    AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
        success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
            NSString *orderID = [JSON valueForKey:@"id"];
            NSString *resumeToken = [JSON valueForKey:@"token"];
            ARInfoLog(@"Created order %@", orderID);
            UIViewController *controller = [[ARSwitchBoard sharedInstance] loadOrderUIForID:orderID resumeToken:resumeToken];
            [self.navigationController pushViewController:controller animated:YES];
        } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
            @strongify(self);
            ARErrorLog(@"Creating a new order failed. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
            [self tappedContactGallery:sender];
        }];

    [op start];

}

- (void)tappedContactGallery:(ARButton *)sender
{
    ARInquireForArtworkViewController *inquireVC = [[ARInquireForArtworkViewController alloc] initWithPartnerInquiryForArtwork:self.artwork fair:self.fair];
    [inquireVC presentFormWithInquiryURLRepresentation:[self inquiryURLRepresentation]];
}

- (void)tappedContactRepresentative:(ARButton *)sender
{
    ARInquireForArtworkViewController *inquireVC = [[ARInquireForArtworkViewController alloc] initWithAdminInquiryForArtwork:self.artwork fair:self.fair];
    [inquireVC presentFormWithInquiryURLRepresentation:[self inquiryURLRepresentation]];
}

- (void)tappedOpenArtworkPartner:(id)sender
{
    Partner *partner = self.artwork.partner;
    if (self.fair) {
        [ArtsyAPI getShowsForArtworkID:self.artwork.artworkID inFairID:self.fair.fairID success:^(NSArray *shows) {
            if (shows.count > 0) {
                UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadShow:shows.firstObject fair:self.fair];
                [self.navigationController pushViewController:viewController animated:YES];
            }
        } failure:^(NSError *error) {
            // ignore
        }];
    } else if (partner.defaultProfilePublic) {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPartnerWithID:partner.profileID];
        if (viewController) {
            [self.navigationController pushViewController:viewController animated:YES];
        }
    } else if(partner.website.length) {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:[NSURL URLWithString:partner.website]];
        if (viewController) {
            [self.navigationController pushViewController:viewController animated:YES];
        }
    }
}

- (void)tappedOpenFair:(id)sender
{
    Fair *fair = self.fair ?: self.artwork.fair;
    NSString *fairID = fair.defaultProfileID ?: fair.organizer.profileID;
    UIViewController *viewController = [ARSwitchBoard.sharedInstance routeProfileWithID:fairID];
    [self.navigationController pushViewController:viewController animated:YES];
}
- (void)tappedOpenArtworkArtist:(id)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadArtistWithID:self.artwork.artist.artistID inFair:self.fair];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)tappedAuctionResults:(id)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadAuctionResultsForArtwork:self.artwork];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)tappedMoreInfo:(id)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadMoreInfoForArtwork:self.artwork];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)tappedAuctionInfo:(id)sender
{
    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/auction-info"]];
    [[ARTopMenuViewController sharedController] pushViewController:viewController];
}

@end
