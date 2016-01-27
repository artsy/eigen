#import "ARRouter.h"
#import "Artsy-Swift.h"
#import <JLRoutes/JLRoutes.h>
#import "ARSwitchboard+Eigen.h"
#import "ARTopMenuNavigationDataSource.h"

#import "ARFairAwareObject.h"
#import "ARFavoritesViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARInternalMobileWebViewController.h"


@interface ARSwitchBoard ()

@property (readonly, nonatomic, copy) JLRoutes *routes;
@property (readonly, nonatomic, copy) Aerodramus *echo;

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
        [sharedInstance updateRoutes];
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
    _echo = [[ArtsyEcho alloc] init];

    return self;
}

- (void)setupEcho
{
    Aerodramus *aero = self.echo;
    [aero setup];

    NSArray *currentRoutes = self.echo.routes.copy;

    [aero checkForUpdates:^(BOOL updatedDataOnServer) {
        if (!updatedDataOnServer) return;

        [aero update:^(BOOL updated, NSError *error) {
            [self removeEchoRoutes:currentRoutes];
            [self updateRoutes];
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
    if (self.echo.name == nil) {
        [self setupEcho];
    }

    __weak typeof(self) wself = self;

    [self registerEchoRouteForKey:@"ARArtistRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadArtistWithID:parameters[@"id"]];
    }];

    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view on iPad.

    if ([UIDevice isPad]) {
        [self registerEchoRouteForKey:@"ARProfileArtistRoute" handler:JLRouteParams {
            __strong typeof (wself) sself = wself;

            Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
            return [sself loadArtistWithID:parameters[@"id"] inFair:fair];
        }];
    }

    [self registerEchoRouteForKey:@"ARArtworkRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
        return [sself loadArtworkWithID:parameters[@"id"] inFair:fair];
    }];

    [self registerEchoRouteForKey:@"ARAuctionRegistrationRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadAuctionRegistrationWithID:parameters[@"id"]];
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
        return [sself loadGeneWithID:parameters[@"id"]];
    }];

    [self registerEchoRouteForKey:@"ARShowRoute" handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself loadShowWithID:parameters[@"id"]];
    }];

    // We don't show a native fairs UI for iPad
    if (![UIDevice isPad]) {
        [self registerEchoRouteForKey:@"ARFairProfileForYouRoute" handler:JLRouteParams {
            __strong typeof (wself) sself = wself;
            Fair *fair = [parameters[@"fair"] isKindOfClass:Fair.class] ? parameters[@"fair"] : nil;
            return [sself loadFairGuideWithFair:fair];
        }];

        [self registerEchoRouteForKey:@"ARFairBrowseArtistRoute" handler:JLRouteParams {
            __strong typeof (wself) sself = wself;
            Fair *fair = parameters[@"fair"] ?: [[Fair alloc] initWithFairID:parameters[@"profile_id"]];
            return [sself loadArtistWithID:parameters[@"id"] inFair:fair];
        }];
    }

    [self registerEchoRouteForKey:@"ARBrowseCategoriesRoute" handler:JLRouteParams {
        return [[ARBrowseCategoriesViewController alloc] init];
    }];


    // This route will match any single path component and thus should be added last.
    // It doesn't need to run through echo, as it's pretty much here to stay forever.
    [self.routes addRoute:@"/:profile_id" priority:0 handler:JLRouteParams {
        __strong typeof (wself) sself = wself;
        return [sself routeProfileWithID: parameters[@"profile_id"]];
    }];

    // The menu items' paths are added in ARTopMenuViewController
}

/// For making changes to the router, see http://echo-web-production.herokuapp.com/
/// it uses HTTP basic auth, you can get the creds from 1Password under "Echo Web Production"

- (void)registerEchoRouteForKey:(NSString *)key handler:(id _Nullable (^)(NSDictionary *_Nullable parameters))callback
{
    Route *route = self.echo.routes[key];
    NSAssert(route != nil, @"You have to have the same named route in Echo in order to use dynamic routing");

    [self.routes addRoute:route.path handler:callback];
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
    // - "JLRoute /:profile_id (0)",
    // which globs all root level paths
    [self.routes addRoute:path priority:1 handler:callback];
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

    /// Is it an Artsy URL, or a purely relative path?
    if ([ARRouter isInternalURL:url] || url.scheme == nil) {
        /// Normalize URL ( e.g. m.artsy.net -> staging-m.artsy.net
        NSURL *fixedURL = [self fixHostForURL:url];
        return [self routeInternalURL:fixedURL fair:fair];

    } else if ([ARRouter isWebURL:url]) {
        /// Is is a webpage we could open in webkit?
        if (ARIsRunningInDemoMode) {
            [[UIApplication sharedApplication] openURL:url];
        } else {
            return [[ARExternalWebBrowserViewController alloc] initWithURL:url];
        }

    } else {
        /// It's probably an app link, offer to jump out
        [self openURLInExternalService:url];
        return nil;
    }
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
    UIAlertController *controller = [UIAlertController alertControllerWithTitle:title message:messsage preferredStyle:UIAlertControllerStyleActionSheet];

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
    // Use the internal JLRouter for the actual routing
    id routedViewController = [self.routes routeURL:url withParameters:(fair ? @{ @"fair" : fair } : nil)];
    if (routedViewController) {
        return routedViewController;
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
