#import <UIKit/UIKit.h>


@interface AROnboardingNavigationItemsView : UIView

- (void)showWarning:(NSString *)text;
- (void)hideWarning;
- (void)disableNextStep;
- (void)enableNextStep;


@end
