#import <Foundation/Foundation.h>

@interface ARFairContentPreloader : NSObject

@property (nonatomic, readonly) BOOL isResolvingService;
@property (nonatomic, readonly) BOOL hasResolvedService;
@property (nonatomic, readonly) NSString *serviceName;
@property (nonatomic, readonly) NSURL *serviceURL;
@property (nonatomic, readonly) NSURL *manifestURL;
@property (nonatomic, readonly) NSDictionary *manifest;
@property (nonatomic, readonly) NSString *fairName;

+ (instancetype)contentPreloader;
- (instancetype)initWithServiceName:(NSString *)serviceName;

- (void)discoverFairService;
- (void)fetchManifest:(void(^)(NSError *))completionBlock;

@end
