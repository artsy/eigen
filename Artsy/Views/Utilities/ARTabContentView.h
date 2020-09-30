#import <UIKit/UIKit.h>
#import "ARTopMenuNavigationDataSource.h"

@class ARTabContentView;

@protocol ARTabViewDelegate <NSObject>
@optional
- (void)tabContentView:(ARTabContentView *)tabContentView didChangeToTab:(NSString *)tabType;
@end

/**

 The ARTabContentView is a Child View Controller compliant tab view, it is only the viewport itself,
 and is a view for a view controller like ARTabbedViewController, or ARTopViewController.

 ViewControllers are added as children to the hostVC, and it has built-in support for hooking
 up with the ARSwitchView subclasses for the usual tab & switch.

**/


@interface ARTabContentView : UIView

- (id)initWithFrame:(CGRect)frame hostViewController:(UIViewController *)controller delegate:(id<ARTabViewDelegate>)delegate dataSource:(id)dataSource;

@property (nonatomic, weak, readonly) UIViewController *hostViewController;

@property (nonatomic, weak) id<ARTabViewDelegate> delegate;

@property (nonatomic, strong, readonly) UINavigationController *currentNavigationController;

@end
