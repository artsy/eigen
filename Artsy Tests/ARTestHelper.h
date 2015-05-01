#import <UIKit/UIKit.h>

void ARTestWrapView(UIView *view);

@interface ARTestHelper : NSObject
@end

@interface ARTestViewHostingWindow : UIWindow
+ (void)hostView:(UIView *)view;
@end
