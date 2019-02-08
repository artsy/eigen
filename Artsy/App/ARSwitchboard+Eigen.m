#import "ARSwitchBoard+Eigen.h"

#import "ARAppStatus.h"

// View Controllers
#import "ARAdminSettingsViewController.h"
#import "ARArtworkSetViewController.h"
#import "ARShowViewController.h"
#import "ARArtworkInfoViewController.h"
#import "ARBrowseViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARFairGuideContainerViewController.h"
#import "ARAuctionWebViewController.h"
#import "ARFairMapViewController.h"
#import "ARProfileViewController.h"
#import "ARMutableLinkViewController.h"

#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARConversationComponentViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/ARShowComponentViewController.h>
#import <Emission/ARFairComponentViewController.h>

// TODO This does not use the new React based VC yet.
#import "ARFairArtistViewController.h"

#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "AROptions.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import "PartnerShow.h"

@interface ARSwitchBoard (Private)
@property (nonatomic, strong) Aerodramus *echo;
@end

@implementation ARSwitchBoard (Eigen)


-(NSURL *)liveAuctionsURL
{
    BOOL useStaging = [AROptions boolForOption:ARUseStagingDefault];
    NSString *echoDomainKey = useStaging ? @"ARLiveAuctionsStagingURLDomain" : @"ARLiveAuctionsURLDomain";
    NSString *domain = self.echo.routes[echoDomainKey].path;
    return [NSURL URLWithString:[@"https://" stringByAppendingString:domain]];
}

#pragma mark - Dev

- (UIViewController *)loadAdminMenu;
{
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
    return [self loadURL:[self.liveAuctionsURL URLByAppendingPathComponent:auctionID]];
}

- (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow
{
    if (self.echo.features[@"ARDisableReactNativeBidFlow"].state == NO && skipBidFlow == NO) {
        ARBidFlowViewController *viewController = [[ARBidFlowViewController alloc] initWithArtworkID:@"" saleID:auctionID intent:ARBidFlowViewControllerIntentRegister];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:viewController];
    } else {
        NSString *path = [NSString stringWithFormat:@"/auction-registration/%@", auctionID];
        NSURL *URL = [self resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:auctionID artworkID:nil];
    }

}

- (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID
{
    if (self.echo.features[@"ARDisableReactNativeBidFlow"].state == NO) {
        ARBidFlowViewController *viewController = [[ARBidFlowViewController alloc] initWithArtworkID:artworkID saleID:saleID];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:viewController];
    } else {
        NSString *path = [NSString stringWithFormat:@"/auction/%@/bid/%@", saleID, artworkID];
        NSURL *URL = [self resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:artworkID];
    }
}

- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork
{
    return [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
}

- (UIViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair
{
    if ([AROptions boolForOption:AROptionsModernShowFairPages]) {
        return [[ARShowComponentViewController alloc] initWithShowID:show.showID];
    } else {
        return [[ARShowViewController alloc] initWithShow:show fair:fair];
    }
}

- (UIViewController *)loadShow:(PartnerShow *)show
{
    return [self loadShow:show fair:nil];
}

- (UIViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair
{
    if ([AROptions boolForOption:AROptionsModernShowFairPages]) {
        return [[ARShowComponentViewController alloc] initWithShowID:showID];
    } else {
        return [[ARShowViewController alloc] initWithShowID:showID fair:fair];
    }
}

- (UIViewController *)loadShowWithID:(NSString *)showID
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
    return [[ARGeneComponentViewController alloc] initWithGeneID:geneID refineSettings:params];
}

#pragma mark -
#pragma mark Artists

- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair
{
    if (fair) {
        return [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];
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

- (UIViewController *)loadArtistWithID:(NSString *)artistID
{
    return [self loadArtistWithID:artistID inFair:nil];
}

- (ARFairArtistViewController *)loadArtistInFairWithID:(NSString *)artistID fair:(Fair *)fair
{
    return (ARFairArtistViewController *)[self loadArtistWithID:artistID inFair:fair];
}

- (ARMutableLinkViewController *)loadUnknownPathWithID:(NSString *)path
{
    return [[ARMutableLinkViewController alloc] initWithPath:path];
}

- (UIViewController *)loadProfileWithID:(NSString *)profileID
{
    if ([AROptions boolForOption:AROptionsModernShowFairPages]) {
        return [[ARFairComponentViewController alloc] initWithFairID:profileID];
    } else {
        return [[ARProfileViewController alloc] initWithProfileID:profileID];
    }
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
