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
#import "ARFavoritesViewController.h"
#import "ARFairMapViewController.h"
#import "ARProfileViewController.h"

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


- (id)init
{
    self = [super init];
    if (!self) { return nil; }

    _routes = [[JLRoutes alloc] init];

    @weakify(self);
    [self.routes addRoute:@"/artist/:id" handler:^BOOL(NSDictionary *parameters) {
        @strongify(self)
        ARArtistViewController *viewController = [self loadArtistWithID:parameters[@"id"]];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view on iPad.

    if ([UIDevice isPad]) {
        [self.routes addRoute:@"/:profile_id/artist/:id" handler:^BOOL(NSDictionary *parameters) {
            @strongify(self)
            Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;

            ARArtistViewController *viewController = (id)[self loadArtistWithID:parameters[@"id"] inFair:fair];
            [[ARTopMenuViewController sharedController] pushViewController:viewController];
            return YES;
        }];
    }

    [self.routes addRoute:@"/artwork/:id" handler:^BOOL(NSDictionary *parameters) {
        @strongify(self)
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        ARArtworkSetViewController *viewController = [self loadArtworkWithID:parameters[@"id"] inFair:fair];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/gene/:id" handler:^BOOL(NSDictionary *parameters) {
        @strongify(self)
        ARGeneViewController *viewController = [self loadGeneWithID:parameters[@"id"]];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];


    [self.routes addRoute:@"/show/:id" handler:^BOOL(NSDictionary *parameters) {
        @strongify(self)
        ARShowViewController *viewController = [self loadShowWithID:parameters[@"id"]];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/:profile_id/for-you" handler:^BOOL(NSDictionary *parameters) {

        if ([UIDevice isPad]) { return NO; }

        @strongify(self);

        id context = parameters[@"fair"];
        NSAssert(context != nil, @"Fair guide routing attempt with no context. ");

        UIViewController *viewController = [self loadFairGuideWithFair:context];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];

        return YES;
    }];

    [self.routes addRoute:@"/:profile_id/browse/artist/:id" handler:^BOOL(NSDictionary *parameters) {

        if ([UIDevice isPad]) { return NO; }

        @strongify(self)

        UIViewController *viewController = [self loadArtistInFairWithID:parameters[@"id"] fair:parameters[@"fair"]];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/" handler:^BOOL(NSDictionary *parameters) {
        [[ARTopMenuViewController sharedController] loadFeed];
        return YES;
    }];

    [self.routes addRoute:@"/favorites" handler:^BOOL(NSDictionary *parameters) {
        ARFavoritesViewController *viewController = [[ARFavoritesViewController alloc] init];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/browse" handler:^BOOL(NSDictionary *parameters) {
        ARBrowseCategoriesViewController *viewController = [[ARBrowseCategoriesViewController alloc] init];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/categories" handler:^BOOL(NSDictionary *parameters) {
        ARBrowseCategoriesViewController *viewController = [[ARBrowseCategoriesViewController alloc] init];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    [self.routes addRoute:@"/:profile_id" handler:^BOOL(NSDictionary *parameters) {
        @strongify(self);
        UIViewController *viewController = [self routeProfileWithID: parameters[@"profile_id"]];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
        return YES;
    }];

    return self;
}

#pragma mark -
#pragma mark Artworks

- (ARArtworkSetViewController *)loadArtwork:(Artwork *)artwork inFair:(Fair *)fair
{
    ARArtworkSetViewController *viewController = [[ARArtworkSetViewController alloc] initWithArtwork:artwork fair:fair];
    return viewController;
}

- (ARArtworkSetViewController *)loadArtworkWithID:(NSString *)artworkID inFair:(Fair *)fair
{
    ARArtworkSetViewController *viewController = [[ARArtworkSetViewController alloc] initWithArtworkID:artworkID fair:fair];
    return viewController;
}

- (ARArtworkSetViewController *)loadArtworkSet:(NSArray *)artworkSet inFair:(Fair *)fair atIndex:(NSInteger)index
{
    ARArtworkSetViewController *viewController = [[ARArtworkSetViewController alloc] initWithArtworkSet:artworkSet fair:fair atIndex:index];
    return viewController;
}

- (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID
{
    NSString *path = [NSString stringWithFormat:@"/auctions/%@/bid/%@", saleID, artworkID];
    return [self loadURL:[NSURL URLWithString:path]];
}

- (ARAuctionArtworkResultsViewController *)loadAuctionResultsForArtwork:(Artwork *)artwork
{
    ARAuctionArtworkResultsViewController *viewController = [[ARAuctionArtworkResultsViewController alloc] initWithArtwork:artwork];
    return viewController;
}

- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork
{
    ARArtworkInfoViewController *viewController = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
    return viewController;
}

- (ARShowViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair
{
    ARShowViewController *viewController = [[ARShowViewController alloc] initWithShow:show fair:fair];
    return viewController;
}

- (ARShowViewController *)loadShow:(PartnerShow *)show
{
    return [self loadShow:show fair:nil];
}

- (ARShowViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair
{
    ARShowViewController *viewController = [[ARShowViewController alloc] initWithShowID:showID fair:fair];
    return viewController;
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
    if(fair){
        ARFairArtistViewController *viewController = [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];
        return viewController;
    } else {
        ARArtistViewController *viewController = [[ARArtistViewController alloc] initWithArtistID:artistID];
        return viewController;
    }
}

- (ARFairMapViewController *)loadMapInFair:(Fair *)fair
{
    ARFairMapViewController *viewController = [[ARFairMapViewController alloc] initWithFair:fair];
    return viewController;
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
    ARArtistViewController *viewController = [[ARArtistViewController alloc] initWithArtistID:artistID];
    return viewController;
}

- (ARFairArtistViewController *)loadArtistInFairWithID:(NSString *)artistID fair:(Fair *)fair
{
    ARFairArtistViewController *viewController = [[ARFairArtistViewController alloc] initWithArtistID:artistID fair:fair];
    return viewController;
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
    // May be nil by the end of the method
    UIViewController *viewController;

    if ([ARRouter isInternalURL:url]) {
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
    NSString *title = isWebsite?  @"Open in Safari" : @"Open with other App";
    NSString *messsage = NSStringWithFormat(@"Would you like to visit '%@'?", url.absoluteString);
    messsage = [messsage stringByReplacingOccurrencesOfString:@"www." withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"http://" withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"https://" withString:@""];

    [UIAlertView showWithTitle:title message:messsage cancelButtonTitle:@"Go back to Artsy" otherButtonTitles:@[@"Open"] tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
        if (buttonIndex == 1) {
            [[UIApplication sharedApplication] openURL:url];
        }
    }];
}

#pragma mark -
#pragma mark Fair

-(ARFairGuideContainerViewController *)loadFairGuideWithFair:(Fair *)fair
{
    ARFairGuideContainerViewController *viewController = [[ARFairGuideContainerViewController alloc] initWithFair:fair];
    return viewController;
}

// use the internal router
- (ARInternalMobileWebViewController *)routeInternalURL:(NSURL *)url fair:(Fair *)fair
{
    BOOL routed = [self.routes routeURL:url withParameters:(fair? @{@"fair": fair} : nil)];
    if (routed) { return nil; }

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
        NSArray *lastTwo = @[components[components.count - 2], components[components.count - 1]];
        NSString *newURLString = [NSString stringWithFormat:@"http://artsy.net/%@/%@", lastTwo[0], lastTwo[1]];
        return [NSURL URLWithString:newURLString];
    }
    return url;
}


- (ARUserSettingsViewController *)loadUserSettings
{
    ARUserSettingsViewController *viewController = [[ARUserSettingsViewController alloc] initWithUser:[User currentUser]];
    return viewController;
}


- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken
{
    NSString *path = [NSString stringWithFormat:@"/order/%@/resume?token=%@", orderID, resumeToken];
    return [self loadPath:path];
}

@end
