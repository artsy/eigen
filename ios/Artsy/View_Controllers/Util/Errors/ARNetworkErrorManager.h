#import <Foundation/Foundation.h>

@interface ARNetworkErrorManager : NSObject

/// Present banner, used when a user interaction has failed
+ (void)presentActiveError:(NSError *)error;
+ (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;

@end
