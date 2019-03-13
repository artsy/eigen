#import "ARGraphQLQueryCache.h"

#import <CommonCrypto/CommonDigest.h>

#ifdef DEBUG
#define DLog(...) NSLog(__VA_ARGS__)
#else
#define DLog(...) /* */
#endif

const NSTimeInterval ARGraphQLQueryCacheDefaultTTL = 3600;

typedef NSMutableArray<NSDictionary *> PromiseQueue;

// We (ab)use the file creation date as a date beyond which a on-disk cache entry is expired.
#define CacheValidUntil NSFileCreationDate

@interface ARGraphQLQueryCache ()
@property (nonatomic, strong, nonnull) NSCache *inMemoryCache;
@property (nonatomic, strong, nonnull) NSMutableDictionary<NSString *, PromiseQueue *> *inFlightRequests;
@end

@implementation ARGraphQLQueryCache

@synthesize methodQueue = _methodQueue;

static NSURL *_cacheDirectory = nil;

+ (void)load;
{
    // RN ceremony
    RCT_EXTERN void RCTRegisterModule(Class);
    RCTRegisterModule(self);

    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    _cacheDirectory = [NSURL fileURLWithPath:[paths[0] stringByAppendingPathComponent:@"RelayResponseCache"]];

    // Ensure the cache directory exists
    [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                             withIntermediateDirectories:YES
                                              attributes:nil
                                                   error:nil];

    dispatch_async(dispatch_get_global_queue(QOS_CLASS_UTILITY, 0), ^{
        NSError *error = nil;

        NSURL *preHeatedCacheDirectory = [[NSBundle mainBundle] URLForResource:@"PreHeatedGraphQLCache" withExtension:nil];
        NSArray<NSURL *> *preHeatedCacheEntries = ReadCacheEntries(preHeatedCacheDirectory, &error);
        NSArray<NSURL *> *existingCacheEntries = error ? nil : ReadCacheEntries(_cacheDirectory, &error);
        if (error) {
            NSLog(@"[ARGraphQLQueryCache] Error while loading pre-heated GraphQL cache: %@", error);
            return;
        }

        NSArray<NSString *> *existingCacheEntryKeys = [existingCacheEntries valueForKey:@"lastPathComponent"];

        for (NSURL *cacheEntryURL in preHeatedCacheEntries) {
            error = nil;

            NSDictionary *cacheEntry = ReadCacheEntry(cacheEntryURL, &error);
            if (error) {
                NSLog(@"[ARGraphQLQueryCache] Error while loading pre-heated GraphQL cache entry `%@': %@", cacheEntryURL.path, error);
                continue;
            }

            NSNumber *freshness = cacheEntry[@"freshness"];
            NSParameterAssert(freshness);
            // Skip pre-heated cache that is considered out-of-date.
            if (!IsCacheValid([NSDate dateWithTimeIntervalSince1970:freshness.unsignedIntegerValue])) {
                DLog(@"[ARGraphQLQueryCache] Stale pre-heated GraphQL cache entry will be ignored: %@", cacheEntryURL.path);
                continue;
            }

            NSDictionary *queryParams = cacheEntry[@"queryParams"];
            NSParameterAssert(queryParams);
            NSString *queryID = queryParams[@"documentID"];
            NSParameterAssert(queryID);
            NSDictionary *variables = queryParams[@"variables"];
            NSParameterAssert(variables);
            NSString *cacheKey = CacheKey(queryID, variables);

            // Skip pre-heated cache entries that already exist.
            if ([existingCacheEntryKeys indexOfObject:cacheKey] != NSNotFound) {
                DLog(@"[ARGraphQLQueryCache] Existing pre-heated GraphQL cache entry will be ignored: %@", cacheEntryURL.path);
                continue;
            }

            NSDictionary *graphqlResponse = cacheEntry[@"graphqlResponse"];
            NSParameterAssert(graphqlResponse);
            NSData *responseData = [NSJSONSerialization dataWithJSONObject:graphqlResponse options:0 error:&error];
            if (error) {
                NSLog(@"[ARGraphQLQueryCache] Error while preparing pre-heated GraphQL cache entry `%@': %@", cacheEntryURL.path, error);
            } else {
                NSDate *ttl = CacheExpirationDate(cacheEntry[@"ttl"] ? [cacheEntry[@"ttl"] unsignedIntegerValue] : 0);
                PersistCacheEntry(cacheKey, responseData, ttl);
            }
        }
    });
}

// RN ceremony
+ (NSString *)moduleName
{
    return @"ARGraphQLQueryCache";
}

- (instancetype)init;
{
    if ((self = [super init])) {
        _inMemoryCache = [NSCache new];
        _inFlightRequests = [NSMutableDictionary new];
        _methodQueue = dispatch_queue_create("net.artsy.emission.ARGraphQLQueryCache", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

#pragma mark Utilities

static NSArray<NSURL *> *
ReadCacheEntries(NSURL *directory, NSError * __autoreleasing *error) {
    return [[NSFileManager defaultManager] contentsOfDirectoryAtURL:directory
                                         includingPropertiesForKeys:@[(__bridge NSString *)kCFURLNameKey]
                                                            options:NSDirectoryEnumerationSkipsHiddenFiles
                                                              error:error];
}

static NSDictionary *
ReadCacheEntry(NSURL *cacheEntryURL, NSError * __autoreleasing *error) {
    NSData *data = [NSData dataWithContentsOfURL:cacheEntryURL options:0 error:error];
    if (*error == nil) {
        return [NSJSONSerialization JSONObjectWithData:data options:0 error:error];
    }
    return nil;
}

static NSString *
CacheKey(NSString *queryID, NSDictionary *variables) {
    // THe variables dictionary may come from anywhere and that may influence the order in many ways,
    // as such we apply some sorting to generate a stable key.
    NSArray *sortedKeys = [[variables allKeys] sortedArrayUsingSelector:@selector(compare:)];
    NSArray *sortedValues = [variables objectsForKeys:sortedKeys notFoundMarker:@""];
    NSArray *sortedVariables = [sortedKeys arrayByAddingObjectsFromArray:sortedValues];

    NSData *variablesJSONData = [NSJSONSerialization dataWithJSONObject:sortedVariables options:0 error:nil];
    NSString *variablesJSON = [[NSString alloc] initWithData:variablesJSONData encoding:NSUTF8StringEncoding];
    NSString *longCacheKey = [queryID stringByAppendingString:variablesJSON];

    const char *pointer = longCacheKey.UTF8String;
    unsigned char md5Buffer[CC_MD5_DIGEST_LENGTH];

    CC_MD5(pointer, (CC_LONG)strlen(pointer), md5Buffer);

    NSMutableString *encodedCacheKey = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
        [encodedCacheKey appendFormat:@"%02x", md5Buffer[i]];
    }

    return encodedCacheKey;
}

static NSURL * _Nonnull
CacheFile(NSString *cacheKey) {
    return [_cacheDirectory URLByAppendingPathComponent:cacheKey];
}

static BOOL
IsCacheValid(NSDate *validUntil) {
    return [validUntil compare:[NSDate date]] == NSOrderedDescending;
}

static NSDate *
CacheExpirationDate(NSTimeInterval ttl) {
    if (ttl == 0) {
        ttl = ARGraphQLQueryCacheDefaultTTL;
    }
    return [NSDate dateWithTimeIntervalSinceNow:ttl];
}

static void
ResolvePromiseQueue(NSString *cacheKey, PromiseQueue *promiseQueue, id value) {
    if (promiseQueue) {
#ifdef DEBUG
        if (promiseQueue.count > 0) {
            DLog(@"[ARGraphQLQueryCache] [%@] Dispatching %@ queued promises", cacheKey, @(promiseQueue.count));
        }
#endif
        for (NSDictionary *promise in promiseQueue) {
            RCTPromiseResolveBlock resolve = promise[@"resolve"];
            NSCParameterAssert(resolve);
            resolve(value);
        }
    }
}

static void
InvalidateExpiredCacheEntry(NSCache * _Nullable cache, NSString * _Nonnull cacheKey, NSError **error) {
    DLog(@"[ARGraphQLQueryCache] [%@] Invalidating expired entry", cacheKey);
    [cache removeObjectForKey:cacheKey];
    [[NSFileManager defaultManager] removeItemAtURL:CacheFile(cacheKey) error:error];
}

static void
PersistCacheEntry(NSString *cacheKey, NSData *responseData, NSDate *validUntil) {
    NSURL *cacheFile = CacheFile(cacheKey);
    DLog(@"[ARGraphQLQueryCache] [%@] Caching response with expiration date %@ to %@", cacheKey, validUntil, cacheFile);
    [[NSFileManager defaultManager] createFileAtPath:cacheFile.path
                                            contents:responseData
                                          attributes:@{ CacheValidUntil: validUntil }];
}

#pragma mark Objective-C API

- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables;
{
    [self setResponse:response forQueryID:queryID withVariables:variables ttl:0];
}

- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables
                ttl:(NSTimeInterval)ttl;
{
    dispatch_async(self.methodQueue, ^{
        [self _setResponseForQueryIDWithVariables:response :queryID :variables :ttl];
    });
}

- (void)clearQueryID:(nonnull NSString *)queryID withVariables:(nonnull NSDictionary *)variables;
{
    dispatch_async(self.methodQueue, ^{
        [self _clearQueryIDWithVariables:queryID :variables];
    });
}

- (void)clearAll;
{
    dispatch_async(self.methodQueue, ^{
        [self _clearAll];
    });
}

#pragma mark React Native API

RCT_EXPORT_METHOD(_setResponseForQueryIDWithVariables:(nullable NSString *)response
                                                     :(nonnull NSString *)queryID
                                                     :(nonnull NSDictionary *)variables
                                                     :(NSTimeInterval)ttl)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    if (response == nil) {
        // this is a sentinel to indicate the value is being fetched and a place where interested parties can request a
        // future resolved value as a promise
        if (self.inFlightRequests[cacheKey] == nil) {
            DLog(@"[ARGraphQLQueryCache] [%@] Expected no promise queue to exist yet", cacheKey);
        }
        DLog(@"[ARGraphQLQueryCache] [%@] Marking as in-flight request", cacheKey);
        self.inFlightRequests[cacheKey] = [NSMutableArray new];
    } else {
        NSDate *validUntil = CacheExpirationDate(ttl);
        // resolve parties that were already interested
        ResolvePromiseQueue(cacheKey, self.inFlightRequests[cacheKey], response);
        [self.inFlightRequests removeObjectForKey:cacheKey];
        // in-memory
        [self.inMemoryCache setObject:@{ @"response": response, @"validUntil": validUntil } forKey:cacheKey];
        // on-disk
        dispatch_async(self.methodQueue, ^{
            // this can be done async, because next readers will fetch from in-memory cache
            PersistCacheEntry(cacheKey, [response dataUsingEncoding:NSUTF8StringEncoding], validUntil);
        });
    }
}

RCT_EXPORT_METHOD(_responseForQueryIDWithVariables:(nonnull NSString *)queryID
                                                  :(nonnull NSDictionary *)variables
                                                  :(RCTPromiseResolveBlock)resolve
                                                  :(RCTPromiseRejectBlock)reject)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    DLog(@"[ARGraphQLQueryCache] [%@] Fetch response", cacheKey);
    NSString *response = nil;
    NSError *error = nil;
    // in-memory
    id cacheResult = [self.inMemoryCache objectForKey:cacheKey];
    if (cacheResult) {
        if ([cacheResult isKindOfClass:NSMutableDictionary.class]) {
            // wait for in-progress result
            DLog(@"[ARGraphQLQueryCache] [%@] Queue promise", cacheKey);
            [cacheResult addObject:@{ @"resolve": resolve, @"reject": reject }];
            // don’t resolve at all right now
            return;
        } else if (IsCacheValid(cacheResult[@"validUntil"])) {
            DLog(@"[ARGraphQLQueryCache] [%@] In-memory cache hit", cacheKey);
            response = cacheResult[@"response"];
        } else {
            InvalidateExpiredCacheEntry(self.inMemoryCache, cacheKey, &error);
        }
    } else {
        // on-disk
        NSURL *cacheFile = CacheFile(cacheKey);
        NSError *error = nil;
        NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:cacheFile.path error:&error];
        NSDate *validUntil = attributes[CacheValidUntil];
        if (validUntil) {
            if (IsCacheValid(validUntil)) {
                DLog(@"[ARGraphQLQueryCache] [%@] On-disk cache hit", cacheKey);
                response = [NSString stringWithContentsOfURL:cacheFile encoding:NSUTF8StringEncoding error:&error];
                // cache in-memory for next time
                [self.inMemoryCache setObject:@{ @"response": response, @"validUntil": validUntil } forKey:cacheKey];
            } else {
                InvalidateExpiredCacheEntry(nil, cacheKey, &error);
            }
        }
        if (error) {
            NSLog(@"[ARGraphQLQueryCache] [%@] Error occurred during file reading: %@", cacheKey, error);
        }
    }
#ifdef DEBUG
    if (response == nil) {
        NSLog(@"[ARGraphQLQueryCache] [%@] Cache miss", cacheKey);
    }
#endif
    resolve(response);
}

RCT_EXPORT_METHOD(_clearAll)
{
    DLog(@"[ARGraphQLQueryCache] [-] Clear all entries");
    // reject promises that were waiting
    for (NSString *cacheKey in self.inFlightRequests) {
        PromiseQueue *promiseQueue = self.inFlightRequests[cacheKey];
        ResolvePromiseQueue(cacheKey, promiseQueue, nil);
    }
    [self.inFlightRequests removeAllObjects];
    // in-memory
    [self.inMemoryCache removeAllObjects];
    // on-disk
    // this cannot be done async, because next readers may fetch from disk
    [[NSFileManager defaultManager] removeItemAtURL:_cacheDirectory error:nil];
    [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                             withIntermediateDirectories:YES
                                              attributes:nil
                                                   error:nil];
}

RCT_EXPORT_METHOD(_clearQueryIDWithVariables:(nonnull NSString *)queryID
                                            :(nonnull NSDictionary *)variables)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    DLog(@"[ARGraphQLQueryCache] [%@] Clear entry", cacheKey);
    // reject promises that were waiting
    ResolvePromiseQueue(cacheKey, self.inFlightRequests[cacheKey], nil);
    // in-memory
    [self.inMemoryCache removeObjectForKey:cacheKey];
    // on-disk
    // this cannot be done async, because next readers may fetch from disk
    [[NSFileManager defaultManager] removeItemAtURL:CacheFile(cacheKey) error:nil];
}

@end
