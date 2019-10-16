#import <Foundation/Foundation.h>

@interface AppSetup: NSObject

+ (instancetype)ambientSetup;

- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

@property (nonatomic, readonly) BOOL inStaging;

@property (nonatomic, readonly) BOOL usingRNP;
@property (nonatomic, readonly) BOOL usingMaster;
@property (nonatomic, readonly) BOOL usingPRBuild;

@property (nonatomic, readonly) BOOL inSimulator;

@property (copy, nonatomic, readonly) NSString *gravityURL;
@property (copy, nonatomic, readonly) NSString *metaphysicsURL;
@property (copy, nonatomic, readonly) NSString *predictionURL;
@property (copy, nonatomic, readonly) NSString *packagerURL;

@property (nonatomic, strong, readonly) NSString *emissionLoadedFromString;
@property (nonatomic, strong, readonly) NSURL *jsCodeLocation;

@property (nonatomic, strong, readonly) NSDictionary *options;

@end
