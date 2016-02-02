//  An Artsy styled version of AJNotificationView
//  https://github.com/ajerez/AJNotificationView

#import <UIKit/UIKit.h>


@interface ARNotificationView : UIView
+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title response:(void (^)(void))response;
+ (void)hideCurrentNotificationView;
- (void)hide;
@end
