#import <UIKit/UIKit.h>

@interface ARParallaxHeaderViewController : UIViewController

- (instancetype)initWithContainingScrollView:(UIScrollView *)containingScrollView fair:(Fair *)fair profile:(Profile *)profile __attribute((objc_designated_initializer));
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil __attribute__((unavailable("Designated Initializer initWithContainingScrollView:fair:profile: must be used.")));

@property (nonatomic, weak, readonly) UIScrollView *containingScrollView;
@property (nonatomic, weak, readonly) Fair *fair;
@property (nonatomic, weak, readonly) Profile *profile;

@end
