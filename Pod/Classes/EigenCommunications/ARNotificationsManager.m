#import "ARNotificationsManager.h"

@implementation ARNotificationsManager

RCT_EXPORT_MODULE();

- (instancetype)init;
{
    if ((self = [super init])) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(paymentRequestPaidReceived:) name:@"ARPaymentRequestPaid" object:nil];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"PaymentRequestPaid"];
}

- (void)paymentRequestPaidReceived:(NSNotification *)notification
{
    NSDictionary *info = notification.userInfo;
    [self sendEventWithName:@"PaymentRequestPaid" body:@{@"url": info[@"ARPaymentRequestURL"] }];
}

@end
