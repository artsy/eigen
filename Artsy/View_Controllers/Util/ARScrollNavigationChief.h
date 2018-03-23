/// Psh, managers are for Java

#import <UIKit/UIKit.h>


@interface ARScrollNavigationChief : NSObject <UIScrollViewDelegate, UICollectionViewDelegate>

+ (ARScrollNavigationChief *)chief;

// Swift has problems accessing chief, so we provide this more method-looking version that just calls through.
+ (ARScrollNavigationChief *)getChief;

@property (readonly, nonatomic, assign) BOOL allowsMenuButtons;
@property (readonly, nonatomic, strong) UIScrollView *currentScrollView;

@end
