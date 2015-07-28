//  An Artsy styled version of AJNotificationView
//  https://github.com/ajerez/AJNotificationView

@interface ARNotificationView : UIView
+ (ARNotificationView *)showNoticeInView:(UIView *)view title:(NSString *)title response:(void (^)(void))response;
+ (void)hideCurrentNotificationView;
- (void)hide;
@end
