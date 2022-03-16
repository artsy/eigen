#import "ARRouter.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARRouter+GraphQL.h"
#import "ARDefaults.h"
#import "ARNetworkConstants.h"
#import "ARUserManager.h"
#import "ARAppStatus.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "Gene.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "User.h"
#import "AROptions.h"
#import "ARLogger.h"

#import "UIDevice-Hardware.h"

#import <UICKeyChainStore/UICKeyChainStore.h>
#import <react-native-config/ReactNativeConfig.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFHTTPRequestOperation.h>
#import <AFNetworking/AFNetworkReachabilityManager.h>
#import <AFNetworking/AFURLSessionManager.h>
#import <AFNetworking/AFHTTPSessionManager.h>

#import <AREmission.h>

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
        ARActionLog(@"Found OAuth token in keychain");
        [ARRouter setAuthToken:token];

    } else {
        ARActionLog(@"Found temporary local user XApp token in keychain");
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
    NSString *clientId = [ARAppStatus isDev] ? [ReactNativeConfig envFor:@"ARTSY_DEV_API_CLIENT_KEY"] : [ReactNativeConfig envFor:@"ARTSY_PROD_API_CLIENT_KEY"];
    NSString *clientSecret = [ARAppStatus isDev] ? [ReactNativeConfig envFor:@"ARTSY_DEV_API_CLIENT_SECRET"] : [ReactNativeConfig envFor:@"ARTSY_PROD_API_CLIENT_SECRET"];
    NSDictionary *params = @{
        @"client_id" : clientId,
        @"client_secret" : clientSecret,
    };
    return [self requestWithMethod:@"GET" path:ARXappURL parameters:params];
}

#pragma mark -
#pragma mark User


+ (NSURLRequest *)newUserInfoRequest
{
    return [self requestWithMethod:@"GET" path:ARMyInfoURL parameters:nil];
}

+ (NSURLRequest *)newMeHEADRequest
{
    return [self requestWithMethod:@"HEAD" path:ARMyInfoURL parameters:nil];
}

+ (NSURLRequest *)newUserEditRequestWithParams:(NSDictionary *)params
{
    return [self requestWithMethod:@"PUT" path:ARMyInfoURL parameters:params];
}

+ (NSURLRequest *)newCheckFollowingProfileHeadRequest:(NSString *)profileID
{
    NSString *path = NSStringWithFormat(ARFollowingProfileURLFormat, profileID);
    return [self requestWithMethod:@"GET" path:path parameters:nil];
}

+ (NSURLRequest *)newMyFollowProfileRequest:(NSString *)profileID
{
    return [self requestWithMethod:@"POST" path:ARFollowProfileURL parameters:@{ @"profile_id" : profileID }];
}

+ (NSURLRequest *)newMyUnfollowProfileRequest:(NSString *)profileID
{
    NSString *path = NSStringWithFormat(ARUnfollowProfileURLFormat, profileID);
    return [self requestWithMethod:@"DELETE" path:path parameters:@{ @"profile_id" : profileID }];
}

+ (NSURLRequest *)newFollowingProfilesRequestWithFair:(Fair *)fair
{
    return [self requestWithMethod:@"GET" path:ARFollowProfilesURL parameters:@{ @"fair_id" : fair.fairID }];
}

#pragma mark -
#pragma mark Artwork Favorites (items in the saved-artwork collection)

+ (NSURLRequest *)newSetArtworkFavoriteRequestForArtwork:(Artwork *)artwork status:(BOOL)status
{
    NSString *method = status ? @"POST" : @"DELETE";
    NSString *url = [NSString stringWithFormat:ARAddArtworkToFavoritesURLFormat, artwork.artworkID];
    return [self requestWithMethod:method
                              path:url
                        parameters:@{ @"user_id" : [User currentUser].userID ?: @"" }];
}

+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtwork:(Artwork *)artwork
{
    return [self newCheckFavoriteStatusRequestForArtworks:@[ artwork ]];
}

+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtworks:(NSArray *)artworks
{
    NSArray *slugs = [artworks map:^(Artwork *artwork) {
        return artwork.artworkID;
    }];

    NSDictionary *params = @{
        @"artworks" : slugs,
        @"user_id" : [User currentUser].userID ?: @"",
        @"private" : @"true"
    };
    return [self requestWithMethod:@"GET" path:ARFavoritesURL parameters:params];
}

#pragma mark -
#pragma mark Artist

+ (NSURLRequest *)newArtistsFromPersonalCollectionAtPage:(NSInteger)page
{
    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:@{ @"page" : @(page) }];
}

+ (NSURLRequest *)newFollowArtistRequest:(Artist *)artist
{
    return [self requestWithMethod:@"POST"
                              path:ARFollowArtistURL
                        parameters:@{ @"artist_id" : artist.artistID }];
}

+ (NSURLRequest *)newUnfollowArtistRequest:(Artist *)artist
{
    NSString *url = [NSString stringWithFormat:ARUnfollowArtistURLFormat, artist.artistID];
    return [self requestWithMethod:@"DELETE" path:url parameters:nil];
}

+ (NSURLRequest *)newFollowingRequestForArtist:(Artist *)artists
{
    return [self newFollowingRequestForArtists:@[ artists ]];
}

+ (NSURLRequest *)newFollowingRequestForArtists:(NSArray *)artists
{
    NSArray *slugs = [artists map:^(Artist *artist) {
        return artist.artistID;
    }];

    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:@{ @"artists" : slugs }];
}

+ (NSURLRequest *)newArtistRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"artist_id" : artist.artistID,
                              @"size" : @1,
                              @"exclude_artist_ids" : artistIDsToExclude };

    return [self requestWithMethod:@"GET" path:ARRelatedArtistsURL parameters:params];
}

+ (NSURLRequest *)newArtistsRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"artist_id" : artist.artistID,
                              @"exclude_artist_ids" : artistIDsToExclude };
    return [self requestWithMethod:@"GET" path:ARRelatedArtistsURL parameters:params];
}

+ (NSURLRequest *)newGeneRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude
{
    NSArray *geneIDsToExclude = [genesToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"size" : @1,
                              @"exclude_gene_ids" : geneIDsToExclude };
    return [self requestWithMethod:@"GET" path:NSStringWithFormat(ARRelatedGeneURLFormat, gene.geneID) parameters:params];
}

+ (NSURLRequest *)newGenesRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude
{
    NSArray *geneIDsToExclude = [genesToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"exclude_gene_ids" : geneIDsToExclude };

    return [self requestWithMethod:@"GET" path:NSStringWithFormat(ARRelatedGeneURLFormat, gene.geneID) parameters:params];
}

+ (NSURLRequest *)newArtistsPopularRequest
{
    return [self requestWithMethod:@"GET" path:ARPopularArtistsURL parameters:nil];
}

+ (NSURLRequest *)newArtistsPopularRequestFallback
{
    // we guard against delta not being able to provide us the current popular artists
    // by having a backup list on S3

    NSString *stringURL = @"https://s3.amazonaws.com/eigen-production/json/eigen_popularartists.json";

    return [[NSURLRequest alloc] initWithURL:[NSURL URLWithString:stringURL]];
}

+ (NSURLRequest *)newGenesPopularRequest

{
    // we get hard coded categories from this json file that force uses also
    NSString *stringURL = @"https://s3.amazonaws.com/eigen-production/json/eigen_categories.json";

    return [[NSURLRequest alloc] initWithURL:[NSURL URLWithString:stringURL]];
}

#pragma mark - Genes

+ (NSURLRequest *)newFollowingRequestForGene:(Gene *)gene
{
    return [self newFollowingRequestForGenes:@[ gene ]];
}

+ (NSURLRequest *)newFollowGeneRequest:(Gene *)gene
{
    return [self requestWithMethod:@"POST" path:ARFollowGeneURL parameters:@{ @"gene_id" : gene.geneID }];
}

+ (NSURLRequest *)newUnfollowGeneRequest:(Gene *)gene
{
    NSString *url = [NSString stringWithFormat:ARUnfollowGeneURLFormat, gene.geneID];
    return [self requestWithMethod:@"DELETE" path:url parameters:nil];
}

+ (NSURLRequest *)newFollowingRequestForGenes:(NSArray *)genes
{
    NSArray *slugs = [genes map:^(Gene *gene) { return gene.geneID;
    }];
    return [self requestWithMethod:@"GET" path:ARFollowGenesURL parameters:@{ @"genes" : slugs }];
}

#pragma mark - Shows

#pragma mark - Models

+ (NSURLRequest *)newProfileInfoRequestWithID:(NSString *)profileID
{
    NSString *url = [NSString stringWithFormat:ARProfileInformationURLFormat, profileID];
    return [self requestWithMethod:@"GET" path:url parameters:nil];
}

#pragma mark -
#pragma mark Search

+ (NSURLRequest *)newArtistSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"term" : query,
                              @"exclude_ids" : artistIDsToExclude };

    return [self requestWithMethod:@"GET" path:ARNewArtistSearchURL parameters:params];
}

+ (NSURLRequest *)newGeneSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)genesToExclude
{
    NSArray *geneIDsToExclude = [genesToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"term" : query,
                              @"exclude_ids" : geneIDsToExclude };

    return [self requestWithMethod:@"GET" path:ARNewGeneSearchURL parameters:params];
}

#pragma mark -
#pragma mark Fairs

+ (NSURLRequest *)newFollowArtistRequest
{
    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:nil];
}

#pragma mark - Recommendations

+ (NSURLRequest *)worksForYouRequest
{
    return [ARRouter requestWithMethod:@"GET" path:ARNotificationsURL parameters:@{
        @"page" : @1,
        @"type" : @"ArtworkPublished",
        @"user_id" : [User currentUser].userID,
        @"size" : @(10)
    }];
}

+ (NSURLRequest *)markNotificationsAsReadRequest
{
    return [self requestWithMethod:@"PUT" path:ARNotificationsURL parameters:@{ @"status" : @"read" }];
}

#pragma mark -
#pragma mark Misc Site

+ (NSURLRequest *)newForgotPasswordRequestWithEmail:(NSString *)email
{
    NSDictionary *params = @{ @"email" : email };
    return [self requestWithMethod:@"POST" path:ARForgotPasswordURL parameters:params];
}

+ (NSURLRequest *)newSetDeviceAPNTokenRequest:(NSString *)token forDevice:(NSString *)device
{
    NSString *bundleID = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];

    NSDictionary *params = @{
        @"name" : device,
        @"token" : token,
        @"app_id" : bundleID,
        @"production" : ARAppStatus.isBetaOrDev ? @"false" : @"true"
    };
    return [self requestWithMethod:@"POST" path:ARNewDeviceURL parameters:params];
}

+ (NSURLRequest *)newDeleteDeviceRequest:(NSString *)token
{
    return [self requestWithMethod:@"DELETE" path:[NSString stringWithFormat:ARDeleteDeviceURL, token]];
}

+ (NSURLRequest *)liveSaleStateRequest:(NSString *)saleID host:(NSString *)host
{
    // Note that we're relying on the host to specify the domain for the request.
    NSString *url = [NSString stringWithFormat:ARLiveSaleStateFormat, host, saleID];
    return [self requestWithMethod:@"GET" URLString:url parameters:nil];
}

+ (NSURLRequest *)graphQLRequestForQuery:(NSString *)query
{
    return [self graphQLRequestForQuery:query variables:nil];
}

+ (NSURLRequest *)graphQLRequestForQuery:(NSString *)query variables:(NSDictionary *)variables
{
  // Note that we're relying on the host to specify the domain for the request.
  NSString *url = [self baseMetaphysicsApiURLString];

  // Makes a copy of the request serializer, one that will encode HTTP body as JSON instead of URL-encoded params.
  AFJSONRequestSerializer *jsonSerializer = [[AFJSONRequestSerializer alloc] init];
  for (NSString *key in staticHTTPClient.requestSerializer.HTTPRequestHeaders.allKeys) {
    id value = staticHTTPClient.requestSerializer.HTTPRequestHeaders[key];
    [jsonSerializer setValue:value forHTTPHeaderField:key];
  }

  [jsonSerializer setValue:[User currentUser].userID forHTTPHeaderField:@"X-User-ID"];
  NSError *error;

  NSMutableDictionary *params = [[NSMutableDictionary alloc] initWithDictionary:@{ @"query" : query }];
  if (variables && variables.count > 0) {
    [params setValue:[self jsonDictionaryForVariables:variables] forKey:@"variables"];
  }

  NSMutableURLRequest *request = [jsonSerializer requestWithMethod:@"POST" URLString:url parameters:params error:&error];

  if (error) {
    NSLog(@"Error serializing request: %@", error);
  }

  return request;
}

+ (NSString *)jsonDictionaryForVariables:(NSDictionary *)variables
{
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:variables options:0 error:nil];
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

+ (NSURLRequest *)liveSaleStaticDataRequest:(NSString *)saleID role:(NSString *)role
{
    NSString *accessType = role ? [NSString stringWithFormat:@"role: %@,", [role uppercaseString]] : @"";
    NSString *causalityRole = [NSString stringWithFormat:@"system { causalityJWT(%@ saleID: \"%@\") }", accessType, saleID];

    NSString *query = [self graphQLQueryForLiveSaleStaticData:saleID role:causalityRole];
    return [self graphQLRequestForQuery:query];
}

+ (NSURLRequest *)biddersRequestForSale:(NSString *)saleID
{
    NSDictionary *params;
    if (saleID) {
        params = @{ @"sale_id" : saleID };
    }

    return [self requestWithMethod:@"GET" path:ARMyBiddersURL parameters:params];
}

+ (NSURLRequest *)requestForSaleID:(NSString *)saleID
{
    NSString *path = [NSString stringWithFormat:ARSaleURLFormat, saleID];
    NSMutableURLRequest *req = [self requestWithMethod:@"GET" path:path parameters:nil];
    req.cachePolicy = NSURLRequestReloadIgnoringCacheData;
    return req;
}

+ (NSURLRequest *)newSystemTimeRequest
{
    return [self requestWithMethod:@"GET" path:ARSystemTimeURL parameters:nil];
}

+ (NSURLRequest *)newRequestForPageContent:(NSString *)slug
{
    NSString *url = [NSString stringWithFormat:ARPageURLFormat, slug];
    return [self requestWithMethod:@"GET" path:url parameters:nil];
}

+ (NSURLRequest *)newHEADRequestForPath:(NSString *)path
{
    NSString *fullPath = [[NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]] absoluteString];
    return [self requestWithMethod:@"HEAD" URLString:fullPath parameters:nil];
}

@end
