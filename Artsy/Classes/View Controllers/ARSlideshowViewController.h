#import <UIKit/UIKit.h>
#import "AROnboardingViewController.h"

@interface ARSlideshowViewController : UIViewController
- (instancetype)initWithSlides:(NSArray *)slides;
@property (nonatomic, weak) AROnboardingViewController *delegate;
@end
