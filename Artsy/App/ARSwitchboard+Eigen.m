#import "ARSwitchBoard+Eigen.h"

#import "ARAppStatus.h"

// View Controllers
#import "ARAdminSettingsViewController.h"
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
#import "ARMutableLinkViewController.h"

#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARConversationComponentViewController.h>

#import "ARArtistViewController.h"
// TODO This does not use the new React based VC yet.
#import "ARFairArtistViewController.h"

#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "AROptions.h"
#import <ObjectiveSugar/ObjectiveSugar.h>

@interface ARSwitchBoard (Private)
@property (nonatomic, strong) Aerodramus *echo;
@end

@implementation ARSwitchBoard (Eigen)

#pragma mark - Dev

- (UIViewController *)loadAdminMenu;
{
    if (!ARAppStatus.isBetaDevOrAdmin) {
        return nil;
    }
    return [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
}

#pragma mark - Messaging

- (UIViewController *)loadConversationWithID:(NSString *)conversationID;
{
    return [[ARConversationComponentViewController alloc] initWithConversationID:conversationID];
}

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

- (ARArtworkSetViewController *)loadArtworkIDSet:(NSArray *)artworkIDSet inFair:(Fair *)fair atIndex:(NSInteger)index
{
    NSArray *artworks = [artworkIDSet map:^id(id artworkID) {
        return [[Artwork alloc] initWithArtworkID:artworkID];
    }];
    return [[ARArtworkSetViewController alloc] initWithArtworkSet:artworks fair:fair atIndex:index];
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

- (UIViewController *)loadLiveAuction:(NSString *)auctionID
{
    /// In order for others to use Live Auctions inside the app, there
    /// has to be some palce where the knowledge of what the official routes are
    /// rather than let VCs know about it, this lets it stay inside the switchboard.

    BOOL useStaging = [AROptions boolForOption:ARUseStagingDefault];
    NSString *echoDomainKey = useStaging ? @"ARLiveAuctionsStagingURLDomain" : @"ARLiveAuctionsURLDomain";
    NSString *domain = self.echo.routes[echoDomainKey].path;
    NSURL *liveAuctionsURL = [NSURL URLWithString:[@"https://" stringByAppendingString:domain]];
    return [self loadURL:[liveAuctionsURL URLByAppendingPathComponent:auctionID]];
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

- (UIViewController *)loadGene:(Gene *)gene
{
    return [self loadGeneWithID:gene.geneID];
}

- (UIViewController *)loadGeneWithID:(NSString *)geneID
{
    return [self loadGeneWithID:geneID refineParams:@{}];
}

- (UIViewController *)loadGeneWithID:(NSString *)geneID refineParams:(NSDictionary *)params
{
    BOOL blacklistUsingReactGenes = self.echo.features[@"DisableReactGenes"] != nil;
    if (blacklistUsingReactGenes) {
        return [[ARGeneViewController alloc] initWithGeneID:geneID];
    }

    return [[ARGeneComponentViewController alloc] initWithGeneID:geneID refineSettings:params];
}

#pragma mark -
#pragma mark Artists

- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair
{
    BOOL blacklistUsingReactArtists = self.echo.features[@"DisableReactArtists"] != nil;

    if (fair) {
        return [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];

    } else if (blacklistUsingReactArtists) {
        return [[ARArtistViewController alloc] initWithArtistID:artistID];

    } else {
        return (UIViewController<ARFairAwareObject> *)[[ARArtistComponentViewController alloc] initWithArtistID:artistID];
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
    return (ARArtistViewController *)[self loadArtistWithID:artistID inFair:nil];
}

- (ARFairArtistViewController *)loadArtistInFairWithID:(NSString *)artistID fair:(Fair *)fair
{
    return (ARFairArtistViewController *)[self loadArtistWithID:artistID inFair:fair];
}

- (ARMutableLinkViewController *)loadUnknownPathWithID:(NSString *)path
{
    return [[ARMutableLinkViewController alloc] initWithPath:path];
}

- (ARProfileViewController *)loadProfileWithID:(NSString *)profileID
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
