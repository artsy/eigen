#import <UIKit/UIKit.h>

@class ARTabContentView;

@protocol ARTabViewDataSource <NSObject>
@required
- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index;
- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index;
- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView;
- (NSUInteger)badgeNumberForTabAtIndex:(NSInteger)index;
- (void)setBadgeNumber:(NSUInteger)number forTabAtIndex:(NSInteger)index;
- (BOOL)searchButtonAtIndex:(NSInteger)index;
@end

@protocol ARTabViewDelegate <NSObject>
@optional
- (BOOL)tabContentView:(ARTabContentView *)tabContentView shouldChangeToIndex:(NSInteger)index;
- (void)tabContentView:(ARTabContentView *)tabContentView didChangeSelectedIndex:(NSInteger)index;
@end

/**

 The ARTabContentView is a Child View Controller compliant tab view, it is only the viewport itself,
 and is a view for a view controller like ARTabbedViewController, or ARTopViewController.

 ViewControllers are added as children to the hostVC, and it has built-in support for hooking
 up with the ARSwitchView subclasses for the usual tab & switch.

**/


@interface ARTabContentView : UIView

- (id)initWithFrame:(CGRect)frame hostViewController:(UIViewController *)controller delegate:(id<ARTabViewDelegate>)delegate dataSource:(id<ARTabViewDataSource>)dataSource;

@property (nonatomic, strong, readwrite) NSArray *buttons;
@property (nonatomic, weak, readonly) UIViewController *hostViewController;

@property (nonatomic, weak) id<ARTabViewDelegate> delegate;
@property (nonatomic, weak) id<ARTabViewDataSource> dataSource;


@property (nonatomic, strong, readonly) UINavigationController *currentNavigationController;
@property (nonatomic, assign) BOOL supportSwipeGestures;

@property (nonatomic, strong, readonly) UISwipeGestureRecognizer *leftSwipeGesture;
@property (nonatomic, strong, readonly) UISwipeGestureRecognizer *rightSwipeGesture;

@property (nonatomic, assign, readonly) NSInteger currentViewIndex;
@property (nonatomic, assign, readonly) NSInteger previousViewIndex;
- (void)setCurrentViewIndex:(NSInteger)currentViewIndex animated:(BOOL)animated;
- (void)forceSetViewController:(UINavigationController *)viewController atIndex:(NSInteger)index animated:(BOOL)animated;
- (void)returnToPreviousViewIndex;

// Move to the next or previous tab, if you're at the end it does nothing
- (void)showNextTabAnimated:(BOOL)animated;
- (void)showPreviousTabAnimated:(BOOL)animated;

- (void)buttonTapped:(id)sender;

@end
