#import "ARGraphQLQueryPreloader.h"
#import "AREmission.h"

/*
 * If this file exists, it will contain a hardcoded list of names to queries for as fast as possible loading on launch.
 */
#if __has_include("ARGraphQLQueryMap.m")
#define HAVE_QUERY_MAP
#endif

#ifdef HAVE_QUERY_MAP
#include "ARGraphQLQueryMap.m"
#else
#ifndef DEBUG
#error Expected to have ARPreloadQueryMap.m in release mode.
#endif

static
NSDictionary *
ARGraphQLQueryMap(void) {
    NSURL *queryMapURL = [[NSBundle bundleForClass:ARGraphQLQueryPreloader.class] URLForResource:@"complete"
                                                                                   withExtension:@".queryMap.json"];
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

- (instancetype)initWithConfiguration:(AREmissionConfiguration *)configuration;
{
    if ((self = [super init])) {
        _configuration = configuration;
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
#ifdef HAVE_QUERY_MAP
        body = @{ @"documentID": ID, @"variables": query.variables };
#else
        body = @{ @"query": ARGraphQLQueryIDToText(ID), @"variables": query.variables };
#endif
        
        NSError *error = nil;
        NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body options:0 error:&error];
        if (error) {
            NSLog(@"Unable to generate JSON for GraphQL query %@: %@", query.queryName, error);
            continue;
        }
//        NSLog(@"%@", [[NSString alloc] initWithData:bodyData encoding:NSUTF8StringEncoding]);
        
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:metaphysicsURL];
        request.HTTPMethod = @"POST";
        request.HTTPBody = bodyData;
        [request setValue:self.configuration.userAgent forHTTPHeaderField:@"User-Agent"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setValue:self.configuration.userID forHTTPHeaderField:@"X-USER-ID"];
        [request setValue:self.configuration.authenticationToken forHTTPHeaderField:@"X-ACCESS-TOKEN"];
        
        NSURLSessionDownloadTask *task = [session downloadTaskWithRequest:request
                                                        completionHandler:^(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error) {
           // TODO: Reject promise
           if (error) {
               NSLog(@"Unable to download response: %@", error);
           } else if ([(NSHTTPURLResponse *)response statusCode] != 200) {
               NSLog(@"Got unexpected HTTP response %ld and therefor discarding response body", [(NSHTTPURLResponse *)response statusCode]);
           } else {
           // TODO: Resolve promise
               NSLog(@"Downloaded response body to: %@", location);
               NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
               NSString *cacheDirectory = paths[0];
               NSURL *responseCacheDirectory = [NSURL fileURLWithPath:[cacheDirectory stringByAppendingPathComponent:@"RelayResponseCache"]];
               NSError *fsError = nil;
               [[NSFileManager defaultManager] createDirectoryAtURL:responseCacheDirectory withIntermediateDirectories:YES attributes:nil error:&fsError];
               if (fsError) {
                   NSLog(@"Unable to create response cache directory: %@", fsError);
                   return;
               }
               NSURL *responseCacheFile = [responseCacheDirectory URLByAppendingPathComponent:[ID stringByAppendingPathExtension:@"json"]];
               [[NSFileManager defaultManager] replaceItemAtURL:responseCacheFile withItemAtURL:location backupItemName:nil options:0 resultingItemURL:nil error:&fsError];
               if (fsError) {
                   NSLog(@"Unable to move response body to response cache directory: %@", fsError);
                   return;
               }
               NSLog(@"Moved response body to: %@", responseCacheFile);
           }
        }];
        [task resume];
    }
}

@end
