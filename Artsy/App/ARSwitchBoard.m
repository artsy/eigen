#import "ARSwitchBoard.h"

#import "ARAppConstants.h"
#import "ARRouter.h"
#import "AROptions.h"
#import "Artsy-Swift.h"
#import <JLRoutes/JLRoutes.h>
#import "ARSwitchboard+Eigen.h"
#import "ARTopMenuNavigationDataSource.h"

#import "ARFairAwareObject.h"
#import "Fair.h"
#import "User.h"

// View Controllers
#import "ARBrowseViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARAuctionWebViewController.h"
#import "AREigenFairComponentViewController.h"
#import "ARTopMenuViewController.h"
#import "ARMutableLinkViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARPaymentRequestWebViewController.h"
#import "ARSerifNavigationViewController.h"
#import "AREigenInquiryComponentViewController.h"
#import "AREigenCollectionComponentViewController.h"


#import <Emission/ARShowConsignmentsFlowViewController.h>
#import <Emission/ARFairComponentViewController.h>
#import <Emission/ARFairBoothComponentViewController.h>
#import <Emission/ARFairArtworksComponentViewController.h>
#import <Emission/ARFairArtistsComponentViewController.h>
#import <Emission/ARFairExhibitorsComponentViewController.h>
#import <Emission/ARFairComponentViewController.h>
#import <Emission/ARShowArtworksComponentViewController.h>
#import <Emission/ARShowArtistsComponentViewController.h>
#import <Emission/ARShowMoreInfoComponentViewController.h>
#import <Emission/ARFairMoreInfoComponentViewController.h>
#import <Emission/ARCitySectionListComponentViewController.h>
#import <Emission/ARCityFairListComponentViewController.h>
#import <Emission/ARCityBMWListComponentViewController.h>
#import <Emission/ARFairBMWArtActivationComponentViewController.h>
#import <Emission/ARCitySavedListComponentViewController.h>
#import <Emission/ARArtworkAttributionClassFAQViewController.h>
#import <Emission/ARPartnerLocationsComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>
#import <Emission/ARPrivacyRequestComponentViewController.h>

#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"

#import <JLRoutes/JLRoutes.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


NSString *const AREscapeSandboxQueryString = @"eigen_escape_sandbox";

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking causality change.
NSInteger const ARLiveAuctionsCurrentWebSocketVersionCompatibility = 4;


@interface ARSwitchBoardDomain : NSObject
@property (nonatomic, copy) id (^block)(NSURL *url);
@property (nonatomic, copy) NSString *domain;
@end


@implementation ARSwitchBoardDomain
@end


@interface ARSwitchBoard ()

@property (nonatomic, strong) JLRoutes *routes;
@property (nonatomic, readwrite, strong) Aerodramus *echo;
@property (nonatomic, strong) NSArray<ARSwitchBoardDomain *> *domains;

@property (nonatomic, assign) BOOL isEchoSetup;

@end


@implementation ARSwitchBoard

static ARSwitchBoard *sharedInstance = nil;

#pragma mark - Lifecycle

+ (void)load
{
    // Force a load of default routes.
    [[self class] sharedInstance];
}

+ (instancetype)sharedInstance
{
    if (sharedInstance == nil) {
        sharedInstance = [[ARSwitchBoard alloc] init];
        [sharedInstance updateRoutes];
    }
    return sharedInstance;
}

+ (void)teardownSharedInstance {
    sharedInstance = nil;
}

#define JLRouteParams ^id _Nullable(NSDictionary *_Nullable parameters)

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _routes = [[JLRoutes alloc] init];
    _echo = [[ArtsyEcho alloc] init];
    _domains = @[];

    return self;
}

- (void)setupEcho
{
    // Only allow Echo to get set up once per instance.
    if (self.isEchoSetup) {
        return;
    }
    self.isEchoSetup = YES;

    Aerodramus *aero = self.echo;

    NSArray *currentRoutes = self.echo.routes.allValues.copy;
    __weak typeof(self) wself = self;

    [aero checkForUpdates:^(BOOL updatedDataOnServer) {
        if (!updatedDataOnServer) return;

        [aero update:^(BOOL updated, NSError *error) {
            [wself removeEchoRoutes:currentRoutes];
            [wself updateRoutes];
        }];
    }];
}

/// It is expected that changes to these values will be shipped along with updated JSON from Echo
/// in the form of Echo.json which is embedded inside the app.

/// Given the tie of 1 to 1 for the echo keys to a website, it didn't feel like it needed
/// the extra abstraction in the form of turning them into constants

/// Note: to embed the latest JSON from the production server run: `make update_echo`

- (void)updateRoutes
{
    // Allow lazy grabbing of local JSON etc, so that we can DI echo.
    [self setupEcho];

    __weak typeof(self) wself = self;

    [self.routes addRoute:@"/artist/:slug/auction-results" priority:0 handler:JLRouteParams {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"/artist/%@/auction-results", parameters[@"slug"]]];
        return [[ARInternalMobileWebViewController alloc] initWithURL:url];
    }];

    [self registerEchoRouteForKey:@"ARArtistRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadArtistWithID:parameters[@"id"]];
    }];

    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.
    [self registerEchoRouteForKey:@"ARProfileArtistRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        return [sself loadArtistWithID:parameters[@"id"] inFair:fair];
    }];

    [self registerEchoRouteForKey:@"ARArtworkRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        return [sself loadArtworkWithID:parameters[@"id"] inFair:fair];
    }];

    [self registerEchoRouteForKey:@"ARAuctionRegistrationRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadAuctionRegistrationWithID:parameters[@"id"] skipBidFlow:parameters[@"skip_bid_flow"]];
    }];

    [self registerEchoRouteForKey:@"ARAuctionRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadAuctionWithID:parameters[@"id"]];
    }];

    [self registerEchoRouteForKey:@"ARAuctionBidArtworkRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadBidUIForArtwork:parameters[@"artwork_id"] inSale:parameters[@"id"]];
    }];

    [self registerEchoRouteForKey:@"ARGeneRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadGeneWithID:parameters[@"id"] refineParams:parameters];
    }];

    [self registerEchoRouteForKey:@"ARShowRoute" handler:JLRouteParams {
        if ([parameters[@"entity"] isEqualToString:@"fair-booth"]) {
            return [[ARFairBoothComponentViewController alloc] initWithFairBoothID:parameters[@"id"]];
        }
        __strong typeof (wself) sself = wself;
        return [sself loadShowWithID:parameters[@"id"]];
    }];

    // The follow show sub-routes are tightly coupled to Emission and don't exist on Force. Otherwise we would use
    // something like ARShowRoute on Echo. See discussion in https://github.com/artsy/eigen/pull/2782
    [self.routes addRoute:@"/show/:id/artworks" handler:JLRouteParams {
        return [[ARShowArtworksComponentViewController alloc] initWithShowID:parameters[@"id"]];
    }];
    
    [self.routes addRoute:@"/inquiry/:id" handler:JLRouteParams {
        AREigenInquiryComponentViewController *viewController = [[AREigenInquiryComponentViewController alloc] initWithArtworkID:parameters[@"id"]];
        return [[ARNavigationController alloc] initWithRootViewController:viewController];
    }];

    [self.routes addRoute:@"/show/:id/artists" handler:JLRouteParams {
        return [[ARShowArtistsComponentViewController alloc] initWithShowID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/show/:id/info" handler:JLRouteParams {
        return [[ARShowMoreInfoComponentViewController alloc] initWithShowID:parameters[@"id"]];
    }];


    [self.routes addRoute:@"/collection/:id" handler:JLRouteParams {
        return [[AREigenCollectionComponentViewController alloc] initWithCollectionID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/conversation/:id"
     handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadConversationWithID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/admin" handler:JLRouteParams {
        return [wself loadAdminMenu];
    }];

    [self.routes addRoute:@"/ios-settings" handler:JLRouteParams {
        return [[ARMyProfileComponentViewController alloc] init];
    }];

    [self.routes addRoute:@"/privacy-request" handler:JLRouteParams {
        return [[ARPrivacyRequestComponentViewController alloc] init];
    }];

    [self.routes addRoute:@"/consign/submission" handler:JLRouteParams {
        UIViewController *submissionVC = [[ARShowConsignmentsFlowViewController alloc] init];
        return [[ARNavigationController alloc] initWithRootViewController:submissionVC];
    }];

    [self.routes addRoute:@"/conditions-of-sale" handler:JLRouteParams {
        // We want to fall back to the default routing unless this query parameter is specified, from Emission.
        // This prevents someone from opening a /conditions-of-sale link somewhere not within the Emission Bid Flow (eg
        // an editorial page or something) and getting presented with a modal. Modals should only be for Bid Flow.
        if ([parameters[@"present_modally"] boolValue]) {
            UIViewController *webViewController = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/conditions-of-sale"]];
            return [[SerifModalWebNavigationController alloc] initWithRootViewController:webViewController];
        } else {
            return nil;
        }
    }];

    [self.routes addRoute:@"/artwork-classifications" handler:JLRouteParams {
        return [[ARArtworkAttributionClassFAQViewController alloc] init];
    }];

    [self.routes addRoute:@"/partner-locations/:id" handler:JLRouteParams {
        return [[ARPartnerLocationsComponentViewController alloc] initWithPartnerID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/fair/:id/artworks" handler:JLRouteParams {
        return [[ARFairArtworksComponentViewController alloc] initWithFairID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/fair/:id/artists" handler:JLRouteParams {
        return [[ARFairArtistsComponentViewController alloc] initWithFairID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/fair/:id/exhibitors" handler:JLRouteParams {
        return [[ARFairExhibitorsComponentViewController alloc] initWithFairID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/fair/:id/info" handler:JLRouteParams {
        return [[ARFairMoreInfoComponentViewController alloc] initWithFairID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/fair/:id/bmw-sponsored-content" handler:JLRouteParams {
        return [[ARFairBMWArtActivationComponentViewController alloc] initWithFairID:parameters[@"id"]];
    }];

    [self.routes addRoute:@"/city/:city_slug/:section" handler:JLRouteParams {
        return [[ARCitySectionListComponentViewController alloc] initWithCitySlug:parameters[@"city_slug"] section:parameters[@"section"]];
    }];

    [self.routes addRoute:@"/city-fair/:city_slug" handler:JLRouteParams {
        return [[ARCityFairListComponentViewController alloc] initWithCitySlug:parameters[@"city_slug"]];
    }];

    [self.routes addRoute:@"/city-save/:city_slug" handler:JLRouteParams {
        return [[ARCitySavedListComponentViewController alloc] initWithCitySlug:parameters[@"city_slug"]];
    }];

    [self registerEchoRouteForKey:@"ARBrowseCategoriesRoute" handler:JLRouteParams {
        return [[ARBrowseCategoriesViewController alloc] init];
    }];

    Route *route = self.echo.routes[@"ARLiveAuctionsURLDomain"];
    if (route) {
        id _Nullable (^presentNativeAuctionsViewControllerBlock)(NSURL *_Nonnull);
        if ([AROptions boolForOption:AROptionsDisableNativeLiveAuctions] || [self requiresUpdateForWebSocketVersionUpdate]) {
            presentNativeAuctionsViewControllerBlock = ^id _Nullable(NSURL *_Nonnull url)
            {
                ARInternalMobileWebViewController *auctionWebViewController = [[ARInternalMobileWebViewController alloc] initWithURL:url];
                return [[SerifModalWebNavigationController alloc] initWithRootViewController:auctionWebViewController];
            };
        } else {
            presentNativeAuctionsViewControllerBlock = ^id _Nullable(NSURL *_Nonnull url)
            {
                NSString *path = url.path;
                NSString *slug = [[path split:@"/"] lastObject];
                return [[LiveAuctionViewController alloc] initWithSaleSlugOrID:slug];
            };
        }

        NSString *stagingDomain = self.echo.routes[@"ARLiveAuctionsStagingURLDomain"].path;

        [self registerPathCallbackForDomain:route.path callback:presentNativeAuctionsViewControllerBlock];
        [self registerPathCallbackForDomain:stagingDomain callback:presentNativeAuctionsViewControllerBlock];
    }

    [self.routes addRoute:@"/city-bmw-list/:id" handler:JLRouteParams {
        return [[ARCityBMWListComponentViewController alloc] initWithCitySlug:parameters[@"id"]];
    }];


    // This route will match any single path component and thus should be added last.
    // It doesn't need to run through echo, as it's pretty much here to stay forever.
    [self.routes addRoute:@"/:slug" priority:0 handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        if ([parameters[@"entity"] isEqualToString:@"fair"]) {
            return [[AREigenFairComponentViewController alloc] initWithFairID:parameters[@"slug"]];
        }

        return [sself loadUnknownPathWithID:parameters[@"slug"]];
    }];

    // The menu items' paths are added in ARTopMenuViewController
}

/// For making changes to the router, see http://echo-web-production.herokuapp.com/
/// it uses HTTP basic auth, you can get the creds from 1Password under "Echo Web Production"

- (void)registerEchoRouteForKey:(NSString *)key handler:(id _Nullable (^)(NSDictionary *_Nullable parameters))callback
{
    Route *route = self.echo.routes[key];
    if (route != nil) {
        [self.routes addRoute:route.path handler:callback];
    } else {
        NSLog(@"You have to have the same named route in Echo in order to use dynamic routing");
    }
}

- (void)removeEchoRoutes:(NSArray<Route *> *)routes
{
    for (Route *route in routes) {
        [self.routes removeRoute:route.path];
    }
}

- (void)registerPathCallbackAtPath:(NSString *)path callback:(id _Nullable (^)(NSDictionary *_Nullable parameters))callback;
{
    // By putting the priority at 1, it is higher than
    // - "JLRoute /:slug (0)",
    // which globs all root level paths
    [self.routes addRoute:path priority:1 handler:callback];
}

- (void)registerPathCallbackForDomain:(NSString *)domain callback:(id _Nullable (^)(NSURL *_Nonnull))callback
{
    ARSwitchBoardDomain *domainRoute = [[ARSwitchBoardDomain alloc] init];
    domainRoute.domain = domain;
    domainRoute.block = callback;
    self.domains = [self.domains arrayByAddingObject:domainRoute];
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

- (BOOL)requiresUpdateForWebSocketVersionUpdate
{
    Message *webSocketVersion = self.echo.messages[@"LiveAuctionsCurrentWebSocketVersion"];
    return webSocketVersion.content.integerValue > ARLiveAuctionsCurrentWebSocketVersionCompatibility;
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

    if ([self isRegisteredDomainURL:url]) {
        ARSwitchBoardDomain *domain = [self domainForURL:url];
        return domain.block(url);
    } else if ([ARRouter isInternalURL:url] || url.scheme == nil) {
        /// Is it an Artsy URL, or a purely relative path?

        /// Normalize URL ( e.g. www.artsy.net -> staging.artsy.net
        NSURL *fixedURL = [self fixHostForURL:url];
        return [self routeInternalURL:fixedURL fair:fair];

    } else if ([ARRouter isWebURL:url]) {
        /// Is is a webpage we could open in webkit?, or need to break out to safari (see PR #1195)
        if (ARIsRunningInDemoMode || [url.query containsString:AREscapeSandboxQueryString]) {
            [[UIApplication sharedApplication] openURL:url];
            return nil;
        } else {
            return [self viewControllerForUnroutedDomain:url];
        }
    } else if ([ARRouter isTelURL:url]) {
        // Handle via OS telephony service
        [[UIApplication sharedApplication] openURL:url];
        return nil;
    }

    /// It's probably an app link, offer to jump out
    [self openURLInExternalService:url];
    return nil;
}

- (BOOL)isRegisteredDomainURL:(NSURL *)url
{
    return [self domainForURL:url] != nil;
}

- (ARSwitchBoardDomain *)domainForURL:(NSURL *)url
{
    ARSwitchBoardDomain *retrievedDomain;

    for (ARSwitchBoardDomain *domain in self.domains) {
        if ([url.host isEqualToString:domain.domain]) {
            retrievedDomain = domain;
        }
    }

    return retrievedDomain;
}

- (UIViewController *)viewControllerForUnroutedDomain:(NSURL *)url
{
    /// So, no Artsy path routes, and no app-wide domain routes.
    return [[ARExternalWebBrowserViewController alloc] initWithURL:url];
}

- (void)openURLInExternalService:(NSURL *)url
{
    BOOL isWebsite = [url.scheme isEqualToString:@"http"] || [url.scheme isEqualToString:@"https"];
    NSString *title = isWebsite ? @"Open in Safari" : @"Open with other App";
    NSString *messsage = NSStringWithFormat(@"Would you like to visit '%@'?", url.absoluteString);
    messsage = [messsage stringByReplacingOccurrencesOfString:@"www." withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"http://" withString:@""];
    messsage = [messsage stringByReplacingOccurrencesOfString:@"https://" withString:@""];

    ARTopMenuViewController *presentationVC = [ARTopMenuViewController sharedController];
    UIAlertController *controller = [UIAlertController alertControllerWithTitle:title message:messsage preferredStyle:UIAlertControllerStyleAlert];

    [controller addAction:[UIAlertAction actionWithTitle:@"Open" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_Nonnull action) {
        [[UIApplication sharedApplication] openURL:url];
    }]];

    [controller addAction:[UIAlertAction actionWithTitle:@"Go back to Artsy" style:UIAlertActionStyleCancel handler:^(UIAlertAction *_Nonnull action) {
        [presentationVC dismissViewControllerAnimated:YES completion:nil];
    }]];

    [presentationVC presentViewController:controller animated:YES completion:nil];
}

- (UIViewController *)routeInternalURL:(NSURL *)url fair:(Fair *)fair
{
    BOOL isTrustedHostForPredictableRouting = ([[ARRouter artsyHosts] containsObject:url.host] || url.host == nil);
    if (isTrustedHostForPredictableRouting) {
        // Use the internal JLRouter for the actual routing
        id routedViewController = [self.routes routeURL:url withParameters:(fair ? @{ @"fair" : fair } : @{})];
        if (routedViewController) {
            return routedViewController;
        }
    }

    if ([ARRouter isPaymentRequestURL:url]) {
        UIViewController *paymentRequestViewController = [[ARPaymentRequestWebViewController alloc] initWithURL:url];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:paymentRequestViewController];
    } else if ([ARRouter isBNMORequestURL:url]) {
        ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:url];
        return [[ARSerifNavigationViewController alloc] initWithRootViewController:viewController];
    }

    // We couldn't find one? Well, then we should present it as a martsy view
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

@end
