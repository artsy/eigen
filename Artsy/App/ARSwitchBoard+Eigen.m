#import "ARSwitchBoard+Eigen.h"

#import "ARAppStatus.h"

// View Controllers
#import "ARAdminSettingsViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARAuctionWebViewController.h"

#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARConversationComponentViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/ARShowComponentViewController.h>

#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "AROptions.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import "PartnerShow.h"

@interface ARSwitchBoard (Private)
@property (nonatomic, strong) Aerodramus *echo;
@end

@implementation ARSwitchBoard (Eigen)


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

- (UIViewController *)loadAuctionWithID:(NSString *)saleID
{
    if (self.echo.features[@"DisableNativeAuctions"].state) {
        NSString *path = [NSString stringWithFormat:@"/auction/%@", saleID];
        NSURL *URL = [self resolveRelativeUrl:path];
        return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:saleID artworkID:nil];
    } else {
        if ([AROptions boolForOption:AROptionsNewSalePage]) {
            return [[ARComponentViewController alloc] initWithEmission:nil moduleName:@"Auction" initialProperties:@{ @"saleID": saleID }];
        } else {
            return [[AuctionViewController alloc] initWithSaleID:saleID];
        }
    }
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

- (UIViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair
{
    return [[ARShowComponentViewController alloc] initWithShowID:show.showID];
}

- (UIViewController *)loadShow:(PartnerShow *)show
{
    return [self loadShow:show fair:nil];
}

- (UIViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair
{
    return [[ARShowComponentViewController alloc] initWithShowID:showID];
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



- (UIViewController *)loadProfileWithID:(NSString *)profileID
{
    NSString *unknownProfilePath = [profileID stringByAppendingString:@"?entity=unknown"];
    return [self loadPath:unknownProfilePath];
}

- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken
{
    NSString *path = [NSString stringWithFormat:@"/order/%@/resume?token=%@", orderID, resumeToken];
    return [self loadPath:path];
}

@end
