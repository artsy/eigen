#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface ARGraphQLQueryCache : NSObject <RCTBridgeModule>

- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables;

- (void)setResponse:(nullable NSString *)response
         forQueryID:(nonnull NSString *)queryID
      withVariables:(nonnull NSDictionary *)variables
                ttl:(NSTimeInterval)ttl;

- (void)clearQueryID:(nonnull NSString *)queryID
       withVariables:(nonnull NSDictionary *)variables;

@end
