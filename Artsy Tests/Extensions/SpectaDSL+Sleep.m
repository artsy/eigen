#import "SpectaDSL+Sleep.h"

void activelyWaitFor(double seconds, void (^block)()){

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        [NSThread sleepForTimeInterval:seconds];
        dispatch_async(dispatch_get_main_queue(), ^{
            block();
        });
    });
}
