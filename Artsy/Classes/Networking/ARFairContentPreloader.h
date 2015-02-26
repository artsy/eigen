#import <Foundation/Foundation.h>

@interface ARFairContentPreloader : NSObject

@property (nonatomic, readonly) BOOL isResolvingService;
@property (nonatomic, readonly) BOOL hasResolvedService;
@property (nonatomic, readonly) NSString *serviceName;
@property (nonatomic, readonly) NSString *fairName;

+ (instancetype)contentPreloader;
- (instancetype)initWithServiceName:(NSString *)serviceName;

- (void)discoverFairService;
- (void)fetchManifest:(void(^)(NSError *))completionBlock;
- (void)fetchPackage:(void(^)(NSError *))completionBlock;
- (void)unpackPackage:(void(^)(NSError *))completionBlock;
- (void)preload:(void(^)(NSError *))completionBlock;

@end
