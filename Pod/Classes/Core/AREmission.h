#import <Foundation/Foundation.h>

@class ARSwitchBoardModule, ARTemporaryAPIModule, RCTBridge;

NS_ASSUME_NONNULL_BEGIN

@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARSwitchBoardModule *switchBoardModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;

- (instancetype)initWithPackagerURL:(nullable NSURL *)packagerURL NS_DESIGNATED_INITIALIZER;

@end

NS_ASSUME_NONNULL_END