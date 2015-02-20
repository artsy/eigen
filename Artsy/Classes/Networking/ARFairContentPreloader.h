#import <Foundation/Foundation.h>

@interface ARFairContentPreloader : NSObject

@property (nonatomic, readonly) BOOL isResolvingService;
@property (nonatomic, readonly) BOOL hasResolvedService;
@property (nonatomic, readonly) NSString *serviceName;

+ (instancetype)contentPreloader;
- (instancetype)initWithServiceName:(NSString *)serviceName;

- (void)discoverFairService;

@end
