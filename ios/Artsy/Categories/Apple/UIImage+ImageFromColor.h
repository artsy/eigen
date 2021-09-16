#import <UIKit/UIKit.h>


@interface UIImage (ImageWithColor)
+ (UIImage *)imageFromColor:(UIColor *)color;
+ (UIImage *)imageFromColor:(UIColor *)color withSize:(CGSize)size;
@end
