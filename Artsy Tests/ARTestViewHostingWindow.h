#import <UIKit/UIKit.h>


// (lldb) reveal_load_sim
// (void *) $0 = 0x00007fa37ac57f70
// (lldb) reveal_start
// 2015-04-28 18:23:41.374 Artsy[36212:993856]  INFO: Reveal Server started (Protocol Version 18).
// (lldb) expr (void)[ARTestViewHostingWindow hostView:view]
@interface ARTestViewHostingWindow : UIWindow
+ (void)hostView:(UIView *)view;
+ (void)continue;
@end
