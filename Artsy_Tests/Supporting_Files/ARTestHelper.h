
#import <UIKit/UIKit.h>


@interface ARTestHelper : NSObject <UIApplicationDelegate>
@end


@interface ARTestViewHostingWindow : UIWindow
+ (void)hostView:(UIView *)view;
@end
