#import <UIKit/UIKit.h>


@interface ARTestHelper : NSObject
@end


@interface ARTestViewHostingWindow : UIWindow
+ (void)hostView:(UIView *)view;
@end
