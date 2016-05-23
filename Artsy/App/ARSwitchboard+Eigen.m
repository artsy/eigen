#import "ARSwitchboard+Eigen.h"

// View Controllers
#import "ARArtworkSetViewController.h"
#import "ARShowViewController.h"
#import "ARGeneViewController.h"
#import "ARArtworkInfoViewController.h"
#import "ARBrowseViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARFairGuideContainerViewController.h"
#import "ARAuctionWebViewController.h"
#import "ARFavoritesViewController.h"
#import "ARFairMapViewController.h"
#import "ARProfileViewController.h"

#import <Emission/ARArtistComponentViewController.h>
#import "ARArtistViewController.h"
// TODO This does not use the new React based VC yet.
#import "ARFairArtistViewController.h"

#import "Artsy-Swift.h"
#import "AROptions.h"


@interface ARSwitchBoard (Private)
@property (nonatomic, strong) Aerodramus *echo;
@end


@implementation ARSwitchBoard (Eigen)

#pragma mark -
#pragma mark Artworks

- (ARArtworkSetViewController *)loadArtwork:(Artwork *)artwork inFair:(Fair *)fair
{
    return [[ARArtworkSetViewController alloc] initWithArtwork:artwork fair:fair];
}

- (ARArtworkSetViewController *)loadArtworkWithID:(NSString *)artworkID inFair:(Fair *)fair
{
    return [[ARArtworkSetViewController alloc] initWithArtworkID:artworkID fair:fair];
}

- (ARArtworkSetViewController *)loadArtworkSet:(NSArray *)artworkSet inFair:(Fair *)fair atIndex:(NSInteger)index
{
    return [[ARArtworkSetViewController alloc] initWithArtworkSet:artworkSet fair:fair atIndex:index];
}

- (UIViewController *)loadAuctionWithID:(NSString *)saleID
{
    if (self.echo.features[@"DisableNativeAuctions"]) {
        NSString *path = [NSString stringWithFormat:@"/auction/%@", saleID];
        NSURL *URL = [self resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:nil];
    } else {
        return [[AuctionViewController alloc] initWithSaleID:saleID];
    }
}

- (ARAuctionWebViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID;
{
    NSString *path = [NSString stringWithFormat:@"/auction-registration/%@", auctionID];
    NSURL *URL = [self resolveRelativeUrl:path];
    return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:auctionID artworkID:nil];
}

- (ARAuctionWebViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID
{
    NSString *path = [NSString stringWithFormat:@"/auction/%@/bid/%@", saleID, artworkID];
    NSURL *URL = [self resolveRelativeUrl:path];
    return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:artworkID];
}

- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork
{
    return [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
}

- (ARShowViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair
{
    return [[ARShowViewController alloc] initWithShow:show fair:fair];
}

- (ARShowViewController *)loadShow:(PartnerShow *)show
{
    return [self loadShow:show fair:nil];
}

- (ARShowViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair
{
    return [[ARShowViewController alloc] initWithShowID:showID fair:fair];
}

- (ARShowViewController *)loadShowWithID:(NSString *)showID
{
    return [self loadShowWithID:showID fair:nil];
}

#pragma mark -
#pragma mark Partner

- (UIViewController *)loadPartnerWithID:(NSString *)partnerID
{
    return [self loadPath:partnerID];
}

#pragma mark -
#pragma mark Genes

- (ARGeneViewController *)loadGene:(Gene *)gene
{
    ARGeneViewController *viewController = [[ARGeneViewController alloc] initWithGene:gene];
    return viewController;
}


- (ARGeneViewController *)loadGeneWithID:(NSString *)geneID
{
    ARGeneViewController *viewController = [[ARGeneViewController alloc] initWithGeneID:geneID];
    return viewController;
}

#pragma mark -
#pragma mark Artists

- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair
{
    if (fair) {
        return [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];
    } else if ([AROptions boolForOption:AROptionsEnableReactArtist]) {
        return (UIViewController<ARFairAwareObject> *)[[ARArtistComponentViewController alloc] initWithArtistID:artistID];
    } else {
        return [[ARArtistViewController alloc] initWithArtistID:artistID];
    }
}

- (ARFairMapViewController *)loadMapInFair:(Fair *)fair
{
    return [[ARFairMapViewController alloc] initWithFair:fair];
}

- (ARFairMapViewController *)loadMapInFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows
{
    ARFairMapViewController *viewController = [[ARFairMapViewController alloc] initWithFair:fair title:title selectedPartnerShows:selectedPartnerShows];
    if (title) {
        viewController.expandAnnotations = NO;
    }
    return viewController;
}

- (ARArtistViewController *)loadArtistWithID:(NSString *)artistID
{
    return [[ARArtistViewController alloc] initWithArtistID:artistID];
}

- (ARFairArtistViewController *)loadArtistInFairWithID:(NSString *)artistID fair:(Fair *)fair
{
    return [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];
}


- (ARProfileViewController *)routeProfileWithID:(NSString *)profileID
{
    return [[ARProfileViewController alloc] initWithProfileID:profileID];
}

#pragma mark -
#pragma mark Fair

- (ARFairGuideContainerViewController *)loadFairGuideWithFair:(Fair *)fair
{
    return [[ARFairGuideContainerViewController alloc] initWithFair:fair];
}


- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken
{
    NSString *path = [NSString stringWithFormat:@"/order/%@/resume?token=%@", orderID, resumeToken];
    return [self loadPath:path];
}

@end
