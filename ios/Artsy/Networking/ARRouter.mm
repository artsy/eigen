#import "ARRouter.h"

#import "ARDefaults.h"
#import "ARNetworkConstants.h"
#import "ARUserManager.h"
#import "ARAppConstants.h"
#import "ARAppStatus.h"

#import "UIDevice-Hardware.h"

#import <UICKeyChainStore/UICKeyChainStore.h>
#import "Keys.h"
#import "AREmission.h"

static AFHTTPSessionManager *staticHTTPClient = nil;
static NSSet *artsyHosts = nil;

static NSString *hostFromString(NSString *string)
{
    return [[NSURL URLWithString:string] host];
}


@implementation ARRouter

+ (void)setup
{
    NSString *productionWeb = hostFromString(ARBaseWebURL);
    NSString *productionDeprecatedMobileWeb = hostFromString(ARBaseDeprecatedMobileWebURL);
    NSString *productionAPI = hostFromString(ARBaseApiURL);

    NSString *stagingWeb = @"staging.artsy.net";
    NSString *stagingDeprecatedMobileWeb = hostFromString(ARStagingBaseDeprecatedMobileWebURL);
    NSString *stagingAPI = @"stagingapi.artsy.net";

    artsyHosts = [NSSet setWithArray:@[
        @"artsy.net",
        productionAPI, productionWeb, productionDeprecatedMobileWeb,
        stagingAPI, stagingWeb, stagingDeprecatedMobileWeb
    ]];

    [self setupHttpClient];
    [self setupUserAgent];
}

+ (AFHTTPSessionManager *)staticHTTPClient {
    return staticHTTPClient;
}

+ (NSSet *)artsyHosts
{
    return artsyHosts;
}

+ (NSURL *)baseApiURL
{
    return [NSURL URLWithString:[[AREmission sharedInstance] reactStateStringForKey:[ARReactStateKey gravityURL]]];
}

+ (NSString *)baseMetaphysicsApiURLString
{
    return [[AREmission sharedInstance] reactStateStringForKey:[ARReactStateKey metaphysicsURL]];
}

+ (NSString *)baseCausalitySocketURLString
{
    return [[AREmission sharedInstance] reactStateStringForKey:[ARReactStateKey causalityURL]];
}

+ (NSURL *)baseWebURL
{
    return [NSURL URLWithString:[[AREmission sharedInstance] reactStateStringForKey:[ARReactStateKey webURL]]];
}

+ (NSURL *)resolveRelativeUrl:(NSString *)path
{
    return [NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]];
}

+ (void)setupHttpClient
{
    staticHTTPClient = [[AFHTTPSessionManager alloc] initWithBaseURL:[self baseApiURL]];
    [staticHTTPClient.reachabilityManager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
            switch (status) {
                case AFNetworkReachabilityStatusUnknown:
                    break; // do nothing
                case AFNetworkReachabilityStatusNotReachable:
                    [[NSNotificationCenter defaultCenter] postNotificationName:ARNetworkUnavailableNotification object:nil];
                    break;
                default:
                    [[NSNotificationCenter defaultCenter] postNotificationName:ARNetworkAvailableNotification object:nil];
                    break;
            }
    }];

    // Ensure the keychain is empty incase you've uninstalled and cleared user data
    // but make sure that this is not a slip-up due to background fetch downloading

    UIApplicationState state = [[UIApplication sharedApplication] applicationState];
    ARUserManager *user = [ARUserManager sharedManager];

    if (![user hasExistingAccount] && state != UIApplicationStateBackground) {
        [UICKeyChainStore removeItemForKey:AROAuthTokenDefault];
        [UICKeyChainStore removeItemForKey:ARXAppTokenKeychainKey];
    }

    NSString *token = [UICKeyChainStore stringForKey:AROAuthTokenDefault];
    if (token) {
        NSLog(@"Found OAuth token in keychain");
        [ARRouter setAuthToken:token];

    } else {
        NSLog(@"Found temporary local user XApp token in keychain");
        NSString *xapp = [UICKeyChainStore stringForKey:ARXAppTokenKeychainKey];
        [ARRouter setXappToken:xapp];
    }
}

+ (void)setupUserAgent
{
    NSString *userAgent = [self userAgent];
    [[NSUserDefaults standardUserDefaults] registerDefaults:@{ @"UserAgent" : userAgent }];
    [self setHTTPHeader:@"User-Agent" value:userAgent];
}

+ (void)setHTTPHeader:(NSString *)header value:(NSString *)value
{
    [staticHTTPClient.requestSerializer setValue:value forHTTPHeaderField:header];
}

+ (BOOL)isWebURL:(NSURL *)url
{
    return (!url.scheme || ([url.scheme isEqual:@"http"] || [url.scheme isEqual:@"https"]));
}

+ (BOOL)isTelURL:(NSURL *)url
{
    return (url.scheme && [url.scheme isEqual:@"tel"]);
}

/// TODO: don't allow Special Apple URLs? iTMS / maps.apple?

+ (BOOL)isInternalURL:(NSURL *)url
{
    // Is it a touch link?
    if ([url.scheme isEqual:@"applewebdata"] || [url.scheme isEqual:@"artsy"]) {
        return YES;
    }

    if (![self isWebURL:url]) {
        return NO;
    }

    NSString *host = url.host;
    if ([host hasPrefix:@"www"]) {
        host = [host substringFromIndex:4];
    }

    //if there's no host, we'll assume it's relative
    BOOL isRelative = (host == nil);
    return isRelative || [self isArtsyHost:host];
}

+ (BOOL)isArtsyHost:(NSString *)host
{
    if (host) {
        return ([artsyHosts containsObject:host] || [host hasSuffix:@".artsy.net"]);
    } else {
        return NO;
    }
}

+ (BOOL)isBNMORequestURL:(NSURL *)url;
{
    return [url.path hasPrefix:@"/orders/"];
}

+ (NSURLRequest *)requestForURL:(NSURL *)url
{
    NSMutableURLRequest *request = [self requestWithMethod:@"GET" URLString:url.absoluteString parameters:nil];
    if (![ARRouter isInternalURL:url]) {
        [request setValue:nil forHTTPHeaderField:ARAuthHeader];
        [request setValue:nil forHTTPHeaderField:ARXappHeader];
    }

    return request;
}

+ (NSString *)userAgent
{
    static NSString *cachedUserAgent;
    if (cachedUserAgent) {
        return cachedUserAgent;
    }

    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];

    // Take the default from AFNetworking, and extend them all to include:
    // * code names
    // * version information
    // * include big browser engine names so that scripts like that of fast.fonts.net WKWebView will load

    AFHTTPRequestSerializer *serializer = [[AFHTTPRequestSerializer alloc] init];
    NSString *userAgent = serializer.HTTPRequestHeaders[@"User-Agent"];
    NSString *model = [UIDevice modelName];
    NSString *agentString = [NSString stringWithFormat:@"%@ Mozilla/5.0 Artsy-Mobile/%@ Eigen/%@", model, version, build];
    userAgent = [userAgent stringByReplacingOccurrencesOfString:@"Artsy" withString:agentString];
    userAgent = [userAgent stringByAppendingString:@" AppleWebKit/601.1.46 (KHTML, like Gecko)"];
    cachedUserAgent = userAgent;
    return userAgent;
}

+ (AFHTTPSessionManager *)httpClient
{
    return staticHTTPClient;
}

#pragma mark -
#pragma mark OAuth

+ (void)setAuthToken:(NSString *)token
{
    // XApp tokens are only needed during onboarding and only valid for a week. Clearing it when we obtain an access
    // token, after onboarding is completed, ensures the app doesn’t get into a state where including an old invalid
    // XApp token leads to API requests to fail.
    if (token) {
        [self setXappToken:nil];
    }
    [self setHTTPHeader:ARAuthHeader value:token];
}

+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method path:(NSString *)path
{
    return [self requestWithMethod:method path:path parameters:nil];
}

+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method path:(NSString *)path parameters:(NSDictionary *)params
{
    NSString *fullPath = [[staticHTTPClient.baseURL URLByAppendingPathComponent:path] absoluteString];
    return [self requestWithMethod:method URLString:fullPath parameters:params];
}

+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method URLString:(NSString *)urlString parameters:(NSDictionary *)params
{
    NSMutableURLRequest *request = [staticHTTPClient.requestSerializer requestWithMethod:method URLString:urlString parameters:params error:nil];
    [request setValue:@"" forHTTPHeaderField:@"Cookie"];
    return request;
}


#pragma mark -
#pragma mark XApp

+ (void)setXappToken:(NSString *)token
{
    [self setHTTPHeader:ARXappHeader value:token];
}

+ (NSURLRequest *)newXAppTokenRequest
{
    NSString *clientId = [ARAppStatus isDev] ? [Keys secureFor:@"ARTSY_DEV_API_CLIENT_KEY"] : [Keys secureFor:@"ARTSY_PROD_API_CLIENT_KEY"];
    NSString *clientSecret = [ARAppStatus isDev] ? [Keys secureFor:@"ARTSY_DEV_API_CLIENT_SECRET"] : [Keys secureFor:@"ARTSY_PROD_API_CLIENT_SECRET"];
    NSDictionary *params = @{
        @"client_id" : clientId,
        @"client_secret" : clientSecret,
    };
    return [self requestWithMethod:@"GET" path:ARXappURL parameters:params];
}

@end
