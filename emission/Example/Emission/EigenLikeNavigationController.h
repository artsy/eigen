#import <UIKit/UIKit.h>

// A very simple reimplmentation of Eigen's ARNavigationViewController

@interface EigenLikeNavigationController : UINavigationController

@property (readonly, nonatomic, strong) UIButton *backButton;
@property (nonatomic, assign) BOOL showBackButtonOnRoot;

@end
