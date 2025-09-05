#import "ARTDeeplinkTimeoutModule.h"
#import "ARAppDelegateHelper.h"
#import "AppDelegate+DeeplinkTimeout.h"

@implementation ARTDeeplinkTimeoutModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(invalidateDeeplinkTimeout) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[ARAppDelegateHelper sharedInstance]  invalidateDeeplinkTimeout];
    });
}

@end
