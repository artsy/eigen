#import "ARSwitchBoard.h"

#import "ARAppConstants.h"
#import "ARRouter.h"
#import "AROptions.h"
#import "Artsy-Swift.h"
#import <JLRoutes/JLRoutes.h>
#import "ARTopMenuNavigationDataSource.h"
#import "ARAppDelegate+Emission.h"

#import "Fair.h"
#import "User.h"

// View Controllers
#import "ARAuctionWebViewController.h"
#import "AREigenMapContainerViewController.h"
#import "ARInternalMobileWebViewController.h"

#import "ARSerifNavigationViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARTopMenuViewController.h"

#import <Emission/AREmission.h>
#import "ARNotificationsManager.h"

#import <Emission/ARMyProfileComponentViewController.h>
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
@property (nonatomic, strong) NSArray<ARSwitchBoardDomain *> *domains;

@end


@implementation ARSwitchBoard

static ARSwitchBoard *sharedInstance = nil;

#pragma mark - Lifecycle

+ (instancetype)sharedInstance
{
    if (sharedInstance == nil) {
        sharedInstance = [[ARSwitchBoard alloc] init];
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
    _domains = @[];

    return self;
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

- (BOOL)requiresUpdateForWebSocketVersionUpdate
{
    Message *webSocketVersion = ARAppDelegate.sharedInstance.echo.messages[@"LiveAuctionsCurrentWebSocketVersion"];
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
        if ([url.query containsString:AREscapeSandboxQueryString]) {
            [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
            return nil;
        } else {
            return [self viewControllerForUnroutedDomain:url];
        }
    } else if ([ARRouter isTelURL:url]) {
        // Handle via OS telephony service
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
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
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
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

    if ([ARRouter isBNMORequestURL:url]) {
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
