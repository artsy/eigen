#import <Foundation/Foundation.h>

@interface ARFairContentPreloader : NSObject

@property (nonatomic, readonly) NSString *serviceName;

+ (instancetype)contentPreloader;
- (instancetype)initWithServiceName:(NSString *)serviceName;

- (void)discoverFairService;

@end
