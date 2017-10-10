#import "ARNotificationsManager.h"

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
    NSDictionary *info = notification.userInfo;
    [self sendEventWithName:@"PaymentRequestPaid" body:@{ @"url": info[@"ARPaymentRequestURL"] }];
}

@end
