#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARModalWithBottomSafeAreaViewController : UIViewController
-(instancetype)initWithStack:(UINavigationController *)stack;
@property (nonatomic, assign) UINavigationController *stack;
@end

NS_ASSUME_NONNULL_END
