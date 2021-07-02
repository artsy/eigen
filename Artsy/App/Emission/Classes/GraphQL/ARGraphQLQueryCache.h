#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface ARGraphQLQueryCache : NSObject <RCTBridgeModule>

/**
 * Uses the default TTL defined by `ARGraphQLQueryCacheDefaultTTL`.
 *
 * @see -setResponse:forQueryID:withVariables:ttl:
 */
- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables;

/**
 * Stores, or promises to store, response data to the cache.
 *
 * @param response
 *        When response is `nil`, it means the request is in progress. Any subsequent requests for that response will be
 *        queue to be resolved/rejected until the actual response is written to the cache or the cache entry is cleared.
 * @param queryID
 *        The persisted ID of the GraphQL document.
 * @param variables
 *        The variables used for this query, which combined with the `queryID` make the cache key.
 * @param ttl
 *        The number of seconds after which to invalidate this cached response. A value of `0` will apply the default
 *        value defined by `ARGraphQLQueryCacheDefaultTTL`.
 */
- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables
                ttl:(NSTimeInterval)ttl;

/**
 * Removes an individual response from the cache. Also resolves any pending promises for the key with a `nil` value.
 *
 * @param queryID
 *        The persisted ID of the GraphQL document.
 * @param variables
 *        The variables used for this query, which combined with the `queryID` make the cache key.
 */
- (void)clearQueryID:(nonnull NSString *)queryID
       withVariables:(nonnull NSDictionary *)variables;

/**
 * Removes all cached responses. Also resolves any pending promises with a `nil` value.
 */
- (void)clearAll;

@end
