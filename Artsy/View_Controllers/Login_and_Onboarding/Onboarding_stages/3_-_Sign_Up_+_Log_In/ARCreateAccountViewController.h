#import <UIKit/UIKit.h>

@class AROnboardingViewController, ARTextFieldWithPlaceholder;


@interface ARCreateAccountViewController : UIViewController

@property (nonatomic, weak) AROnboardingViewController *delegate;

- (void)showWarning:(NSString *)msg animated:(BOOL)animates;
- (void)removeWarning:(BOOL)animates;

@end
