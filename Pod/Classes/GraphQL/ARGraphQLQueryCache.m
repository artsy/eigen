#import "ARGraphQLQueryCache.h"

#import <CommonCrypto/CommonDigest.h>

#ifdef DEBUG
#define DLog(...) NSLog(__VA_ARGS__)
#else
#define DLog(...) /* */
#endif

const NSTimeInterval ARGraphQLQueryCacheDefaultTTL = 86400;

typedef NSMutableArray<ARGraphQLQueryCachePromise> PromiseQueue;

// We (ab)use the file creation date as a date beyond which a on-disk cache entry is expired.
#define CacheValidUntil NSFileCreationDate

@interface ARGraphQLQueryCache ()
@property (nonatomic, strong, nonnull) dispatch_queue_t dispatchQueue;
@property (nonatomic, strong, nonnull) NSCache *inMemoryCache;
@property (nonatomic, strong, nonnull) NSMutableDictionary<NSString *, PromiseQueue *> *inFlightRequests;
@end

@implementation ARGraphQLQueryCache

static ARGraphQLQueryCache *_sharedInstance = nil;
static NSURL *_cacheDirectory = nil;

+ (instancetype)sharedInstance;
{
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [self new];
        // Ensure the cache directory exists
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
        _cacheDirectory = [NSURL fileURLWithPath:[paths[0] stringByAppendingPathComponent:@"RelayResponseCache"]];
        [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                                 withIntermediateDirectories:YES
                                                  attributes:nil
                                                       error:nil];
    });
    return _sharedInstance;
}

- (instancetype)init;
{
    if ((self = [super init])) {
        _inMemoryCache = [NSCache new];
        _inFlightRequests = [NSMutableDictionary new];
        _dispatchQueue = dispatch_queue_create("net.artsy.emission.ARGraphQLQueryCache", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

#pragma mark Utilities

static NSString *
CacheKey(NSString *queryID, NSDictionary *variables) {
    NSData *variablesJSONData = [NSJSONSerialization dataWithJSONObject:variables options:0 error:nil];
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

static void
ResolvePromiseQueue(NSString *cacheKey, PromiseQueue *promiseQueue, id value) {
    if (promiseQueue) {
#ifdef DEBUG
        if (promiseQueue.count > 0) {
            DLog(@"[ARGraphQLQueryCache] [%@] Dispatching %ld queued promises", cacheKey, promiseQueue.count);
        }
#endif
        for (ARGraphQLQueryCachePromise promise in promiseQueue) {
            promise(value);
        }
    }
}

static void
InvalidateExpiredCacheEntry(NSCache * _Nullable cache, NSString * _Nonnull cacheKey, NSError **error) {
    DLog(@"[ARGraphQLQueryCache] [%@] Invalidating expired entry", cacheKey);
    [cache removeObjectForKey:cacheKey];
    [[NSFileManager defaultManager] removeItemAtURL:CacheFile(cacheKey) error:error];
}

#pragma mark API

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
    if (ttl == 0) {
        ttl = ARGraphQLQueryCacheDefaultTTL;
    }
    dispatch_async(self.dispatchQueue, ^{
        NSString *cacheKey = CacheKey(queryID, variables);
        if (response == nil) {
            // this is a sentinel to indicate the value is being fetched and a place where interested parties can request a
            // future resolved value as a promise
            NSAssert(self.inFlightRequests[cacheKey] == nil, @"[ARGraphQLQueryCache] [%@] Expected no promise queue to exist yet", cacheKey);
            DLog(@"[ARGraphQLQueryCache] [%@] Marking as in-flight request", cacheKey);
            self.inFlightRequests[cacheKey] = [NSMutableArray new];
        } else {
            NSDate *validUntil = [NSDate dateWithTimeIntervalSinceNow:ttl];
            DLog(@"[ARGraphQLQueryCache] [%@] Caching response with expiration date %@", cacheKey, validUntil);
            // resolve parties that were already interested
            ResolvePromiseQueue(cacheKey, self.inFlightRequests[cacheKey], response);
            [self.inFlightRequests removeObjectForKey:cacheKey];
            // in-memory
            [self.inMemoryCache setObject:@{ @"response": response, @"validUntil": validUntil } forKey:cacheKey];
            // on-disk
            dispatch_async(self.dispatchQueue, ^{
                // this can be done async, because next readers will fetch from in-memory cache
                NSURL *cacheFile = CacheFile(cacheKey);
                DLog(@"[ARGraphQLQueryCache] [%@] Write %@", cacheKey, cacheFile);
                [[NSFileManager defaultManager] createFileAtPath:cacheFile.path
                                                        contents:[response dataUsingEncoding:NSUTF8StringEncoding]
                                                      attributes:@{ CacheValidUntil: validUntil }];
            });
        }
    });
}

- (void)responseForQueryID:(nonnull NSString *)queryID
             withVariables:(nonnull NSDictionary *)variables
                completion:(nonnull ARGraphQLQueryCachePromise)promise;
{
    dispatch_async(self.dispatchQueue, ^{
        NSString *cacheKey = CacheKey(queryID, variables);
        DLog(@"[ARGraphQLQueryCache] [%@] Fetch response", cacheKey);
        NSString *response = nil;
        NSError *error = nil;
        // in-flight
        PromiseQueue *promiseQueue = [self.inFlightRequests objectForKey:cacheKey];
        if (promiseQueue) {
            DLog(@"[ARGraphQLQueryCache] [%@] Queue promise", cacheKey);
            [promiseQueue addObject:[promise copy]];
            return;
        }
        // in-memory
        id cacheResult = [self.inMemoryCache objectForKey:cacheKey];
        if (cacheResult) {
            if (IsCacheValid(cacheResult[@"validUntil"])) {
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
        promise(response);
    });
}

- (void)clearQueryID:(nonnull NSString *)queryID withVariables:(nonnull NSDictionary *)variables;
{
    dispatch_async(self.dispatchQueue, ^{
        NSString *cacheKey = CacheKey(queryID, variables);
        DLog(@"[ARGraphQLQueryCache] [%@] Clear entry", cacheKey);
        // reject promises that were waiting
        ResolvePromiseQueue(cacheKey, self.inFlightRequests[cacheKey], nil);
        // in-memory
        [self.inMemoryCache removeObjectForKey:cacheKey];
        // on-disk
        [[NSFileManager defaultManager] removeItemAtURL:CacheFile(cacheKey) error:nil];
    });
}

- (void)clearAll;
{
    dispatch_async(self.dispatchQueue, ^{
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
        [[NSFileManager defaultManager] removeItemAtURL:_cacheDirectory error:nil];
        [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                                 withIntermediateDirectories:YES
                                                  attributes:nil
                                                       error:nil];
    });
}

@end
