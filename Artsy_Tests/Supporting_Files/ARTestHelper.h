#import <UIKit/UIKit.h>


@interface ARTestHelper : NSObject <UIApplicationDelegate>
@property (strong, nonatomic) UIWindow *window;
@end


@interface ARTestViewHostingWindow : UIWindow
+ (void)hostView:(UIView *)view;
@end
