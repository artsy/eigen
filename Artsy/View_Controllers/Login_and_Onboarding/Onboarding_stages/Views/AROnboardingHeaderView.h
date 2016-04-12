#import <UIKit/UIKit.h>


@interface AROnboardingHeaderView : UIView

// progress here is a percentage, as used in FLKAutolayout, e.g. 50% is @"*.5". 
- (void)setupHeaderViewWithTitle:(NSString *)title andProgress:(NSString *)progress;

@end
