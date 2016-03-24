#import <UIKit/UIKit.h>


@interface ARSerifNavigationViewController : UINavigationController

@end

/// Creates a button for showing in the nav's top right


@interface ARSerifToolbarButtonItem : UIBarButtonItem

- (instancetype)initWithImage:(UIImage *)image;
@property (nonatomic, strong, readonly) UIButton *button;

@end
