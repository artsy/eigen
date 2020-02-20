#import "ARNotificationsManager.h"
#import <React/RCTBridgeModule.h>

@implementation ARNotificationsManager

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"PaymentRequestPaid"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(paymentRequestPaidReceived:) name:@"ARPaymentRequestPaid" object:nil];
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"ARPaymentRequestPaid" object:nil];
}

- (void)paymentRequestPaidReceived:(NSNotification *)notification
{
    NSURL *URL = notification.userInfo[@"ARPaymentRequestURL"];
    [self sendEventWithName:@"PaymentRequestPaid" body:@{ @"url": URL.absoluteString }];
}

RCT_EXPORT_METHOD(postNotificationName:(nonnull NSString *)notificationName userInfo:(NSDictionary *)userInfo)
{
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName object:nil userInfo:userInfo];
}

// All notification JS methods occur on the main queue/thread.
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
