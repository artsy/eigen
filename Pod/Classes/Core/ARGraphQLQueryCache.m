#import "ARGraphQLQueryCache.h"

#import <CommonCrypto/CommonDigest.h>

RCT_EXTERN void RCTRegisterModule(Class);

static NSURL *_cacheDirectory = nil;

@interface ARGraphQLQueryCache ()
@property (nonatomic, strong, nonnull) NSCache *inMemoryCache;
@property (nonatomic, strong, nonnull) NSMutableDictionary *inFlightRequests;
@end

@implementation ARGraphQLQueryCache

@synthesize methodQueue = _methodQueue;

+ (void)load;
{
    // RN ceremony
    RCTRegisterModule(self);
    
    // Ensure the cache directory exists
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    _cacheDirectory = [NSURL fileURLWithPath:[paths[0] stringByAppendingPathComponent:@"RelayResponseCache"]];
    [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                             withIntermediateDirectories:YES
                                              attributes:nil
                                                   error:nil];
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
        [self setResponseForQueryIDWithVariables:response :queryID :variables :ttl];
    });
}

// When response is `nil`, it means the request is in progress
RCT_EXPORT_METHOD(setResponseForQueryIDWithVariables:(nullable NSString *)response
                                                    :(nonnull NSString *)queryID
                                                    :(nonnull NSDictionary *)variables
                                                    :(NSTimeInterval)ttl)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    if (ttl == 0) {
        // default to a full day
        ttl = 60 * 60 * 24;
    }
    NSDate *validUntil = [NSDate dateWithTimeIntervalSinceNow:ttl];
    if (response == nil) {
        // this is a sentinel to indicate the value is being fetched and a place where interested parties can request a
        // future resolved value as a promise
        NSMutableArray *completionPromises = [NSMutableArray new];
        [self.inFlightRequests setValue:completionPromises forKey:cacheKey];
    } else {
        // resolve parties that were already interested
        NSArray *completionPromises = [self.inFlightRequests valueForKey:cacheKey];
        if ([completionPromises isKindOfClass:NSArray.class]) {
            for (NSDictionary *promise in completionPromises) {
                RCTPromiseResolveBlock resolve = promise[@"resolve"];
                resolve(response);
            }
        }
        [self.inFlightRequests removeObjectForKey:cacheKey];

        // in-memory
        [self.inMemoryCache setObject:@{ @"response": response, @"validUntil": validUntil } forKey:cacheKey];

        // on-disk
        dispatch_async(self.methodQueue, ^{
            NSLog(@"WRITING: %@", CacheFile(cacheKey));
            [[NSFileManager defaultManager] createFileAtPath:CacheFile(cacheKey).path
                                                    contents:[response dataUsingEncoding:NSUTF8StringEncoding]
                                                  attributes:@{ NSFileCreationDate: validUntil }];
        });
    }
}

RCT_EXPORT_METHOD(responseForQueryIDWithVariables:(nonnull NSString *)queryID
                                                 :(nonnull NSDictionary *)variables
                                                 :(RCTPromiseResolveBlock)resolve
                                                 :(RCTPromiseRejectBlock)reject)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    NSString *response = nil;
    // in-memory
    id cacheResult = [self.inMemoryCache objectForKey:cacheKey];
    if (cacheResult) {
        if ([cacheResult isKindOfClass:NSMutableDictionary.class]) {
            // wait for in-progress result
            [cacheResult addObject:@{ @"resolve": resolve, @"reject": reject }];
        } else if (IsCacheValid(cacheResult[@"validUntil"])) {
            response = cacheResult[@"response"];
        } else {
            // invalidate
            [self.inMemoryCache removeObjectForKey:cacheKey];
        }
    }
    // on-disk
    NSURL *cacheFile = CacheFile(cacheKey);
    NSError *error = nil;
    NSDictionary *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:cacheFile.path error:&error];
    NSDate *validUntil = attributes[NSFileCreationDate];
    if (validUntil) {
        if (IsCacheValid(validUntil)) {
            response = [NSString stringWithContentsOfURL:cacheFile encoding:NSUTF8StringEncoding error:&error];
            // cache in-memory for next time
            [self.inMemoryCache setObject:@{ @"response": response, @"validUntil": validUntil } forKey:cacheKey];
        } else {
            // invalidate
            NSLog(@"[ARGraphQLQueryCache] Invalidate cache: %@", cacheFile);
            [[NSFileManager defaultManager] removeItemAtURL:cacheFile error:&error];
        }
    }
    if (error) {
        NSLog(@"[ARGraphQLQueryCache] Error occurred during file reading: %@", error);
    }
    resolve(response);
}

RCT_EXPORT_METHOD(clearAll)
{
    // reject promises that were waiting
    for (NSDictionary *promise in self.inFlightRequests.allValues) {
        RCTPromiseRejectBlock reject = promise[@"reject"];
        reject(@"CACHE_CLEARED", @"The cache entry for the requested key is cleared.", nil);
    }
    [self.inFlightRequests removeAllObjects];
    [self.inMemoryCache removeAllObjects];
    dispatch_async(self.methodQueue, ^{
        [[NSFileManager defaultManager] removeItemAtURL:_cacheDirectory error:nil];
        [[NSFileManager defaultManager] createDirectoryAtURL:_cacheDirectory
                                 withIntermediateDirectories:YES
                                                  attributes:nil
                                                       error:nil];
    });
}

- (void)clearQueryID:(nonnull NSString *)queryID withVariables:(nonnull NSDictionary *)variables;
{
    dispatch_async(self.methodQueue, ^{
        [self clearQueryIDWithVariables:queryID :variables];
    });
}

RCT_EXPORT_METHOD(clearQueryIDWithVariables:(nonnull NSString *)queryID
                                           :(nonnull NSDictionary *)variables)
{
    NSString *cacheKey = CacheKey(queryID, variables);
    NSDictionary *promise = [self.inFlightRequests valueForKey:cacheKey];
    if (promise) {
        RCTPromiseRejectBlock reject = promise[@"reject"];
        reject(@"CACHE_CLEARED", @"The cache entry for the requested key is cleared.", nil);
    }
    [self.inMemoryCache removeObjectForKey:cacheKey];
    dispatch_async(self.methodQueue, ^{
        [[NSFileManager defaultManager] removeItemAtURL:CacheFile(cacheKey) error:nil];
    });
}

@end
