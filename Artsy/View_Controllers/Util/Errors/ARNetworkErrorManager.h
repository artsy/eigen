#import <Foundation/Foundation.h>


@protocol ARNetworkErrorAwareViewController
@property (readonly, nonatomic, assign) BOOL shouldShowActiveNetworkError;
@end


@interface ARNetworkErrorManager : NSObject

/// Present banner, used when a user interaction has failed
+ (void)presentActiveError:(NSError *)error;
+ (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;

@end
