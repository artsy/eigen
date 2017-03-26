#import <Foundation/Foundation.h>

/// Dispatches asynchronously when ARPerformWorkAsynchronously is set to true, and synchronously otherwise
extern void ar_dispatch_async(dispatch_block_t block);

/// Dispatches to the main queue unless ARPerformWorkAsynchronously is set to false
extern void ar_dispatch_main_queue(dispatch_block_t block);

/// Dispatches to a queue unless ARPerformWorkAsynchronously is set to false
extern void ar_dispatch_on_queue(dispatch_queue_t queue, dispatch_block_t block);

extern void ar_dispatch_after_on_queue(float seconds, dispatch_queue_t queue, dispatch_block_t block);

extern void ar_dispatch_after(float seconds, dispatch_block_t block);


@interface ARDispatchManager : NSObject

+ (instancetype)sharedManager;

@end
