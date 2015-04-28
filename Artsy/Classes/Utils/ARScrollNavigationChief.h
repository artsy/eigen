/// Psh, managers are for Java

#import "ARExternalWebBrowserViewController.h"

@interface ARScrollNavigationChief : NSObject <UIScrollViewDelegate, UICollectionViewDelegate>

+ (ARScrollNavigationChief *)chief;

@property (readonly, nonatomic, assign) BOOL allowsMenuButtons;
@property (readonly, nonatomic, strong) UIScrollView *currentScrollView;

@end
