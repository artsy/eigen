/// Psh, managers are for Java

#import "ARExternalWebBrowserViewController.h"

@protocol ARScrollNavigationChiefAwareViewController <UIScrollViewDelegate>

- (void)scrollViewDidScroll:(UIScrollView *)scrollView;

@end

@interface ARScrollNavigationChief : NSObject <UIScrollViewDelegate, UICollectionViewDelegate, ARWebViewControllerScrollDelegate>

+ (ARScrollNavigationChief *)chief;

@property (readonly, nonatomic, assign) BOOL allowsMenuButtons;

@property (readonly, nonatomic, strong) UIScrollView *currentScrollView;

@property (readwrite, nonatomic, weak) id<ARScrollNavigationChiefAwareViewController> awareViewController;

@end
