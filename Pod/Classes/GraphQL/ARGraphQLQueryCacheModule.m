#import "ARGraphQLQueryCacheModule.h"
#import "ARGraphQLQueryCache.h"

@implementation ARGraphQLQueryCacheModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setResponseForQueryIDWithVariables:(nullable NSString *)response
                  :(nonnull NSString *)queryID
                  :(nonnull NSDictionary *)variables
                  :(NSTimeInterval)ttl)
{
    [[ARGraphQLQueryCache sharedInstance] setResponse:response forQueryID:queryID withVariables:variables ttl:ttl];
}

RCT_EXPORT_METHOD(responseForQueryIDWithVariables:(nonnull NSString *)queryID
                  :(nonnull NSDictionary *)variables
                  :(RCTPromiseResolveBlock)resolve
                  :(RCTPromiseRejectBlock)reject)
{
    // There’s no rejections, so optimistic.
    [[ARGraphQLQueryCache sharedInstance] responseForQueryID:queryID withVariables:variables completion:resolve];
}

RCT_EXPORT_METHOD(clearAll)
{
    [[ARGraphQLQueryCache sharedInstance] clearAll];
}

RCT_EXPORT_METHOD(clearQueryIDWithVariables:(nonnull NSString *)queryID
                  :(nonnull NSDictionary *)variables)
{
    [[ARGraphQLQueryCache sharedInstance] clearQueryID:queryID withVariables:variables];
}

@end
