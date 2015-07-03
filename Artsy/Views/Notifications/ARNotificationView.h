//  An Artsy styled version of AJNotificationView
//  https://github.com/ajerez/AJNotificationView


@interface ARNotificationView : UIView
+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title hideAfter:(NSTimeInterval)hideInterval response:(void (^)(void))response;
+ (void)hideCurrentNotificationView;
- (void)hide;
@end
