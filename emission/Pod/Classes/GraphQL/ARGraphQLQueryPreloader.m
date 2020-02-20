#import "ARGraphQLQueryPreloader.h"
#import "AREmission.h"
#import "ARGraphQLQueryCache.h"

// Unless disabled, this will use a hardcoded map of names to query IDs for as fast as possible loading on launch.
//#undef USE_DYNAMIC_GRAPHQL_MAP
#ifndef USE_DYNAMIC_GRAPHQL_MAP
// This is an inline import of the generated obj-c from `yarn generate-graphql-query-map`
// to avoid having it treated as a compilation unit in Xcode
#include "ARGraphQLQueryMap.generated.objc"
#else
#ifndef DEBUG
#error Expected to have ARGraphQLQueryMap.generated.objc in release mode.
#endif

static
NSDictionary *
ARGraphQLQueryMap(void) {
    static NSURL *queryMapURL = nil;
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
// Actually use the passed in local query map when running on the simulator so the app does not need to be rebuild to
// pick-up changes to the query map.
#if TARGET_IPHONE_SIMULATOR
// CPP hoops to create an NSString literal out of a macro.
#define STRINGIZE1(x) #x
#define STRINGIZE2(x) STRINGIZE1(x)
#define QUERY_MAP_PATH @ STRINGIZE2(USE_DYNAMIC_GRAPHQL_MAP)
        queryMapURL = [NSURL fileURLWithPath:QUERY_MAP_PATH];
#else
        queryMapURL = [[NSBundle bundleForClass:ARGraphQLQueryPreloader.class] URLForResource:@"complete"
                                                                                withExtension:@".queryMap.json"];
#endif
        NSLog(@"[ARGraphQLQueryMap] Using dynamic query map: %@", queryMapURL);
    });
    NSError *error = nil;
    NSData *data = [NSData dataWithContentsOfURL:queryMapURL options:0 error:&error];
    NSCAssert(error == nil, @"Unable to load query map at `%@`: %@", queryMapURL, error);
    NSDictionary *queryMap = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    NSCAssert(error == nil, @"Unable to load query map data: %@", error);
    return queryMap;
}

static
NSString *
ARGraphQLQueryNameToID(NSString *name)
{
    NSDictionary *queryMap = ARGraphQLQueryMap();
    for (NSString *ID in queryMap) {
        NSString *query = queryMap[ID];
        if ([query hasPrefix:[NSString stringWithFormat:@"query %@", name]]) {
            return ID;
        }
    }
    return nil;
}

static
NSString *
ARGraphQLQueryIDToText(NSString *ID)
{
    NSDictionary *queryMap = ARGraphQLQueryMap();
    NSCAssert(queryMap != nil, @"Expected query map.");
    return queryMap[ID];
}

#endif

@implementation ARGraphQLQuery

- (instancetype)initWithQueryName:(NSString *)queryName;
{
    return [self initWithQueryName:queryName variables:nil];
}

- (instancetype)initWithQueryName:(NSString *)queryName
                        variables:(nullable NSDictionary *)variables;
{
    if ((self = [super init])) {
        _queryName = queryName;
        _variables = variables ?: @{};
    }
    return self;
}

@end

@implementation ARGraphQLQueryPreloader

RCT_EXPORT_MODULE();

- (instancetype)initWithConfiguration:(AREmissionConfiguration *)configuration
                                cache:(ARGraphQLQueryCache *)cache;
{
    if ((self = [super init])) {
        _configuration = configuration;
        _cache = cache;
    }
    return self;
}

- (void)preloadQueries:(NSArray<ARGraphQLQuery *> *)queries;
{
    NSURL *metaphysicsURL = [NSURL URLWithString:self.configuration.metaphysicsURL];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]
                                                          delegate:nil
                                                     delegateQueue:nil];

    for (ARGraphQLQuery *query in queries) {
        NSString *ID = ARGraphQLQueryNameToID(query.queryName);

        NSDictionary *body = nil;
#ifdef USE_DYNAMIC_GRAPHQL_MAP
        body = @{ @"query": ARGraphQLQueryIDToText(ID), @"variables": query.variables };
#else
        body = @{ @"documentID": ID, @"variables": query.variables };
#endif

        NSError *error = nil;
        NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body options:0 error:&error];
        if (error) {
            NSLog(@"Unable to generate JSON for GraphQL query %@: %@", query.queryName, error);
            continue;
        }

        // indicate we’re fetching this
        [self.cache setResponse:nil
                     forQueryID:ID
                  withVariables:query.variables];

        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:metaphysicsURL];
        request.HTTPMethod = @"POST";
        request.HTTPBody = bodyData;
        [request setValue:self.configuration.userAgent forHTTPHeaderField:@"User-Agent"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setValue:self.configuration.userID forHTTPHeaderField:@"X-USER-ID"];
        [request setValue:self.configuration.authenticationToken forHTTPHeaderField:@"X-ACCESS-TOKEN"];

        NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                                completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
           if (error) {
               NSLog(@"Unable to download response: %@", error);
               [self.cache clearQueryID:ID withVariables:query.variables];
           } else if ([(NSHTTPURLResponse *)response statusCode] != 200) {
               NSLog(@"Got unexpected HTTP response %@ and therefore discarding response body", @([(NSHTTPURLResponse *)response statusCode]));
               [self.cache clearQueryID:ID withVariables:query.variables];
           } else {
               [self.cache setResponse:[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]
                            forQueryID:ID
                         withVariables:query.variables];
           }
        }];
        [task resume];
    }
}

@end
