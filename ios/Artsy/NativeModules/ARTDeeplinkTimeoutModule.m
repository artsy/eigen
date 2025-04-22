#import "ARTDeeplinkTimeoutModule.h"
#import "AppDelegate.h"
#import "AppDelegate+DeeplinkTimeout.h"

@implementation ARTDeeplinkTimeoutModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(invalidateDeeplinkTimeout) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[ARAppDelegate sharedInstance]  invalidateDeeplinkTimeout];
    });
}

@end
