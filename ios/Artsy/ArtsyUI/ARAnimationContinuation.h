#import <Foundation/Foundation.h>

@class CALayer;

/**
 * Adding this to a layer will make sure that animations continue when the app is brought back to the foreground.
 */
@interface ARAnimationContinuation : NSObject
+ (void)addToLayer:(CALayer *)layer;
+ (void)removeFromLayer:(CALayer *)layer;
@end

