#import <Foundation/Foundation.h>

@class ARTemporaryAPIModule, RCTBridge;

NS_ASSUME_NONNULL_BEGIN

@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;

- (instancetype)initWithPackagerURL:(nullable NSURL *)packagerURL NS_DESIGNATED_INITIALIZER;

@end

NS_ASSUME_NONNULL_END