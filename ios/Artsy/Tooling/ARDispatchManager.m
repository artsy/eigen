#import "ARDispatchManager.h"

#import "ARAppConstants.h"

void ar_dispatch_async(dispatch_block_t block)
{
    ar_dispatch_on_queue(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), block);
}

void ar_dispatch_main_queue(dispatch_block_t block)
{
    ar_dispatch_on_queue(dispatch_get_main_queue(), block);
}

void ar_dispatch_on_queue(dispatch_queue_t queue, dispatch_block_t block)
{
    if (!ARPerformWorkAsynchronously) {
        if ([NSThread isMainThread]) {
            block();
        } else {
            dispatch_sync(queue, block);
        }
    } else {
        dispatch_async(queue, block);
    }
}

void ar_dispatch_after_on_queue(float seconds, dispatch_queue_t queue, dispatch_block_t block)
{
    if (!ARPerformWorkAsynchronously) {
        block();
    } else {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, seconds * NSEC_PER_SEC), queue, block);
    }
}

void ar_dispatch_after(float seconds, dispatch_block_t block)
{
    ar_dispatch_after_on_queue(seconds, dispatch_get_main_queue(), block);
}


@implementation ARDispatchManager

+ (instancetype)sharedManager
{
    static ARDispatchManager *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];
    });

    return _sharedManager;
}

@end
