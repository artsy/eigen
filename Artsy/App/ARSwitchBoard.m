#import "ARRouter.h"
#import <JLRoutes/JLRoutes.h>
#import <UIAlertView+Blocks/UIAlertView+Blocks.h>

// View Controllers
#import "ARArtworkSetViewController.h"
#import "ARShowViewController.h"
#import "ARFairArtistViewController.h"
#import "ARGeneViewController.h"
#import "ARArtworkInfoViewController.h"
#import "ARBrowseViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARFairGuideContainerViewController.h"
#import "ARUserSettingsViewController.h"
#import "ARArtistViewController.h"
#import "ARAuctionArtworkResultsViewController.h"
#import "ARAuctionWebViewController.h"
#import "ARFavoritesViewController.h"
#import "ARFairMapViewController.h"
#import "ARProfileViewController.h"

#import "ARTopMenuNavigationDataSource.h"


@interface ARSwitchBoard ()

@property (readonly, nonatomic, copy) JLRoutes *routes;

@end


@implementation ARSwitchBoard

#pragma mark - Lifecycle

+ (void)load
{
    // Force a load of default routes.
    [[self class] sharedInstance];
}

+ (instancetype)sharedInstance
{
    static ARSwitchBoard *sharedInstance;

    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ARSwitchBoard alloc] init];
    });

    return sharedInstance;
}

#define JLRouteParams ^id _Nullable(NSDictionary *_Nullable parameters)

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _routes = [[JLRoutes alloc] init];

    __weak typeof(self) wself = self;

    /// TODO: Handle the cases for when the route is the root VC
    /// of a menu item
    //
    //    [self.routes addRoute:@"/works-for-you" handler:JLRouteParams {
    //        __strong typeof (wself) sself = wself;
    //        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
    //        return nil
    //    }];
    //
    //    [self.routes addRoute:@"/artwork/:id" handler:JLRouteParams {
    //        __strong typeof (wself) sself = wself;
    //        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
    //        return [sself loadArtworkWithID:parameters[@"id"] inFair:fair];;
    //    }];
    //
    //    [self.routes addRoute:@"/artwork/:id" handler:JLRouteParams {
    //        __strong typeof (wself) sself = wself;
    //        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
    //        return [sself loadArtworkWithID:parameters[@"id"] inFair:fair];;
    //    }];
    //
    //    if ([url.path isEqualToString:@""]) {
    //        ARTopMenuViewController *menuController = [ARTopMenuViewController sharedController];
    //        return [[menuController rootNavigationControllerAtIndex:ARTopTabControllerIndexNotifications] rootViewController];
    //    }
    //    if ([url.path isEqualToString:@"/articles"]) {
    //        ARTopMenuViewController *menuController = [ARTopMenuViewController sharedController];
    //        return [[menuController rootNavigationControllerAtIndex:ARTopTabControllerIndexMagazine] rootViewController];
    //    }
    //    if ([url.path isEqualToString:@"/shows"]) {
    //        ARTopMenuViewController *menuController = [ARTopMenuViewController sharedController];
    //        return [[menuController rootNavigationControllerAtIndex:ARTopTabControllerIndexShows] rootViewController];
    //    }
    //
    //    [self.routes addRoute:@"/" handler:JLRouteParams {
    //
    //        return nil;
    //    }];


    [self.routes addRoute:@"/artist/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadArtistWithID:parameters[@"id"]];
    }];

    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view on iPad.


    if ([UIDevice isPad]) {
        [self.routes addRoute:@"/:profile_id/artist/:id" handler:JLRouteParams {
            __strong typeof (wself) sself = wself;

            Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
            return [sself loadArtistWithID:parameters[@"id"] inFair:fair];
        }];
    }


    [self.routes addRoute:@"/artwork/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        return [sself loadArtworkWithID:parameters[@"id"] inFair:fair];;
    }];

    [self.routes addRoute:@"/auction-registration/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadAuctionRegistrationWithID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/auction/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadAuctionWithID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/auction/:id/bid/:artwork_id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadBidUIForArtwork:parameters[@"artwork_id"] inSale:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/gene/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadGeneWithID:parameters[@"id"]];
    }];


    [self.routes addRoute:@"/show/:id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadShowWithID:parameters[@"id"]];;
    }];

    [self.routes addRoute:@"/:profile_id/for-you" handler:JLRouteParams {

        if ([UIDevice isPad]) { return NO; }

        __strong typeof (wself) sself = wself;
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        return [sself loadFairGuideWithFair:fair];
    }];

    [self.routes addRoute:@"/:profile_id/browse/artist/:id" handler:JLRouteParams {
        if ([UIDevice isPad]) { return NO; }

        __strong typeof (wself) sself = wself;
        Fair *fair = parameters[@"fair"] ?: [[Fair alloc] initWithFairID:parameters[@"profile_id"]];
        return [sself loadArtistInFairWithID:parameters[@"id"] fair:fair];
    }];

    [self.routes addRoute:@"/favorites" handler:JLRouteParams {
        return [[ARFavoritesViewController alloc] init];
    }];

    [self.routes addRoute:@"/browse" handler:JLRouteParams {
        return [[ARBrowseCategoriesViewController alloc] init];
    }];

    [self.routes addRoute:@"/categories" handler:JLRouteParams {
        return [[ARBrowseCategoriesViewController alloc] init];;
    }];

    // This route will match any single path component and thus should be added last.
    [self.routes addRoute:@"/:profile_id" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself routeProfileWithID: parameters[@"profile_id"]];
    }];

    return self;
}

- (BOOL)canRouteURL:(NSURL *)url
{
    return [self.routes canRouteURL:url];
}

- (void)presentViewController:(UIViewController *)controller
{
    ARTopMenuViewController *menuController = [ARTopMenuViewController sharedController];
    [menuController pushViewController:controller];
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

- (ARAuctionWebViewController *)loadAuctionWithID:(NSString *)auctionID;
{
    NSString *path = [NSString stringWithFormat:@"/auction/%@", auctionID];
    NSURL *URL = [self resolveRelativeUrl:path];
    return [[ARAuctionWebViewController alloc] initWithURL:URL auctionID:auctionID artworkID:nil];
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

- (ARAuctionArtworkResultsViewController *)loadAuctionResultsForArtwork:(Artwork *)artwork
{
    ARAuctionArtworkResultsViewController *viewController = [[ARAuctionArtworkResultsViewController alloc] initWithArtwork:artwork];
    return viewController;
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
    } else {
        return [[ARArtistViewController alloc] initWithArtistID:artistID];
        ;
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

#pragma mark -
#pragma mark Urls

- (UIViewController *)loadPath:(NSString *)path
{
    return [self loadPath:path fair:nil];
}

- (UIViewController *)loadPath:(NSString *)path fair:(Fair *)fair
{
    return [self loadURL:[self resolveRelativeUrl:path] fair:fair];
}

- (UIViewController *)loadURL:(NSURL *)url
{
    return [self loadURL:url fair:nil];
}

- (UIViewController *)loadURL:(NSURL *)url fair:(Fair *)fair
{
    NSParameterAssert(url);

    // May be nil by the end of the method
    UIViewController *viewController;

    if ([ARRouter isInternalURL:url] || url.scheme == nil) {
        NSURL *fixedURL = [self fixHostForURL:url];
        viewController = [self routeInternalURL:fixedURL fair:fair];

    } else if ([ARRouter isWebURL:url]) {
        if (ARIsRunningInDemoMode) {
            [[UIApplication sharedApplication] openURL:url];
        } else {
            viewController = [[ARExternalWebBrowserViewController alloc] initWithURL:url];
        }
    } else {
        [self openURLInExternalService:url];
    }

    return viewController;
}

- (ARProfileViewController *)routeProfileWithID:(NSString *)profileID
{
    NSParameterAssert(profileID);
    return [[ARProfileViewController alloc] initWithProfileID:profileID];
}

- (void)openURLInExternalService:(NSURL *)url
{
    BOOL isWebsite = [url.scheme isEqualToString:@"http"] || [url.scheme isEqualToString:@"https"];
    NSString *title = isWebsite ? @"Open in Safari" : @"Open with other App";
    NSString *messsage = NSStringWithFormat(@"Would you like to visit '%@'?", url.absoluteString);
    messsage = [messsage stringByReplacingOccurrencesOfString:@"www." withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"http://" withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"https://" withString:@""];

    [UIAlertView showWithTitle:title message:messsage cancelButtonTitle:@"Go back to Artsy" otherButtonTitles:@[ @"Open" ] tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
        if (buttonIndex == 1) {
            [[UIApplication sharedApplication] openURL:url];
        }
    }];
}

#pragma mark -
#pragma mark Fair

- (ARFairGuideContainerViewController *)loadFairGuideWithFair:(Fair *)fair
{
    return [[ARFairGuideContainerViewController alloc] initWithFair:fair];
}

// use the internal router
- (UIViewController *)routeInternalURL:(NSURL *)url fair:(Fair *)fair
{
    // Can't be routed in the JLRoutes usage at the top, because we can't return view controller instances from there.
    BOOL routed = [self.routes routeURL:url withParameters:(fair ? @{ @"fair" : fair } : nil)];
    if (routed) {
        return nil;
    }

    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:url];
    viewController.fair = fair;
    return viewController;
}

- (NSURL *)resolveRelativeUrl:(NSString *)path
{
    return [NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]];
}

- (NSURL *)fixHostForURL:(NSURL *)url
{
    // from applewebdata://EF86F744-3F4F-4732-8A4B-3E5E94D6D7DA/artist/marcel-duchamp
    // to http://artsy.net/artist/marcel-duchamp/

    if ([url.absoluteString hasPrefix:@"applewebdata"]) {
        NSArray *components = [url.absoluteString componentsSeparatedByString:@"/"];
        NSArray *lastTwo = @[ components[components.count - 2], components[components.count - 1] ];
        NSString *newURLString = [NSString stringWithFormat:@"http://artsy.net/%@/%@", lastTwo[0], lastTwo[1]];
        return [NSURL URLWithString:newURLString];
    }
    return url;
}


- (ARUserSettingsViewController *)loadUserSettings
{
    return [[ARUserSettingsViewController alloc] initWithUser:[User currentUser]];
}


- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken
{
    NSString *path = [NSString stringWithFormat:@"/order/%@/resume?token=%@", orderID, resumeToken];
    return [self loadPath:path];
}

@end
