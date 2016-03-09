#import <UIKit/UIKit.h>


@interface ARNotificationView : UIView
+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title response:(void (^)(void))response;
+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title time:(CGFloat)time response:(void (^)(void))response;

+ (void)hideCurrentNotificationView;
- (void)hide;
@end
