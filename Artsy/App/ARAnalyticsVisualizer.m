

#import "ARAnalyticsVisualizer.h"
#import "ARNotificationView.h"
#import "ARTopMenuViewController.h"

#import <MobileCoreServices/MobileCoreServices.h>


@implementation ARAnalyticsVisualizer

- (void)event:(NSString *)event withProperties:(NSDictionary *)properties
{
    NSString *title = [self alertTitleForEvent:event withProperties:properties];

    [ARNotificationView showNoticeInView:[self findVisibleWindow] title:title time:1.5 response:^{
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:[properties description] preferredStyle:UIAlertControllerStyleActionSheet];
        
        [alert addAction:[UIAlertAction actionWithTitle:@"Copy Description" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            [[UIPasteboard generalPasteboard] setValue:[properties description]forPasteboardType:(NSString *)kUTTypePlainText];
        }]];

        [alert addAction:[UIAlertAction actionWithTitle:@"Copy Stack Trace for Devs" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            NSString *stack = [NSString stringWithFormat:@"%@", [NSThread callStackSymbols]];
            [[UIPasteboard generalPasteboard] setValue:stack forPasteboardType:(NSString *)kUTTypePlainText];
        }]];

        [alert addAction:[UIAlertAction actionWithTitle:@"Great, continue." style:UIAlertActionStyleCancel handler:nil]];

        // Sometimes the TopVC is being presented, e.g. for onboarding/ showing login, or the alerts
        UIViewController *topVC = [ARTopMenuViewController sharedController];
        topVC = topVC.presentedViewController ?: topVC;
        [topVC presentViewController:alert animated:YES completion:nil];
    }];
}

- (NSString *)alertTitleForEvent:(NSString *)event withProperties:(NSDictionary *)properties
{
    if ([event isEqualToString:@"Screen view"]) {
        return [NSString stringWithFormat:@"Screen View: %@", properties[@"slug"] ?: properties[@"screen"]];
    } else {
        if (properties.allKeys.count == 1) {
            return [NSString stringWithFormat:@"%@: %@ - %@", event, properties.allKeys.firstObject, properties.allValues.firstObject];

        } else {
            return event;
        }
    }
}

- (UIWindow *)findVisibleWindow
{
    NSArray *windows = [[UIApplication sharedApplication] windows];
    for (UIWindow *window in [windows reverseObjectEnumerator]) {
        if (!window.hidden) {
            return window;
        }
    }
    return nil;
}

@end
