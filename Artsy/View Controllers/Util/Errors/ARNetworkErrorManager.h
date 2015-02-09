@interface ARNetworkErrorManager : NSObject

/// Present full screen modal, used when a user interaction has failed
+ (void)presentActiveErrorModalWithError:(NSError *)error;

@end
