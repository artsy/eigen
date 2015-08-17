// Dispatches asyncronously unless ARPerformWorkSynchronously is set on the shared dispatch manager
extern void ar_dispatch_async(dispatch_block_t block);

// Dispatches to the main queue unless ARPerformWorkSynchronously is set on the shared dispatch manager
extern void ar_dispatch_main_queue(dispatch_block_t block);

// Dispatches to a queue unless ARPerformWorkSynchronously is set on the shared dispatch manager
extern void ar_dispatch_on_queue(dispatch_queue_t queue, dispatch_block_t block);

extern void ar_dispatch_after_on_queue(float seconds, dispatch_queue_t queue, dispatch_block_t block);

extern void ar_dispatch_after(float seconds, dispatch_block_t block);


@interface ARDispatchManager : NSObject

+ (instancetype)sharedManager;

@end
