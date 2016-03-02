
#import "ARAnalyticsVisualizer.h"
#import "ARNotificationView.h"
#import "ARTopMenuViewController.h"

#import <MobileCoreServices/MobileCoreServices.h>


@implementation ARAnalyticsVisualizer

- (void)event:(NSString *)event withProperties:(NSDictionary *)properties
{
    NSLog(@"Event: %@", event);
    [ARNotificationView showNoticeInView:[self findVisibleWindow] title:event response:^{
        NSLog(@"Tapped");
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:event message:[properties description] preferredStyle:UIAlertControllerStyleAlert];
        
//        UIAlertAction *copyIDToPasteboard = [ UIAlertAction actionWithTitle:@"Copy ID to Pasteboard" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//            NSLog(@"Copy ID to Pasteboard");
//            [UIPasteboard generalPasteboard] setValue:<#(nonnull id)#> forPasteboardType:<#(nonnull NSString *)#>
//        }];
//        [alert addAction:copyIDToPasteboard];
        
        UIAlertAction *copyDescriptionToPasteboard = [UIAlertAction actionWithTitle:@"Copy Description to Pasteboard" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            NSLog(@"Copy Description to Pasteboard");
            [[UIPasteboard generalPasteboard] setValue:[properties description]forPasteboardType:(NSString *)kUTTypePlainText];
        }];
        [alert addAction:copyDescriptionToPasteboard];
        
        UIAlertAction *ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            NSLog(@"OK");
        }];
        [alert addAction:ok];
        
        [[ARTopMenuViewController sharedController] presentViewController:alert animated:YES completion:nil];
    }];
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
