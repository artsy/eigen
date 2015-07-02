#import <UIKit/UIKit.h>


@interface UIViewController (ScreenSize)
/**
 *  Returns whether the current view controller has been rendered on a small device,
 *  such as an iPhone4 (480px tall) vs. a tall device, such as an iPhone5 (568px tall).
 *
 *  @return YES if the screen is small, NO otherwise
 */
- (BOOL)smallScreen;
@end
