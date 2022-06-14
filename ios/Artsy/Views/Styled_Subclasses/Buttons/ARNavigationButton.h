#import <UIKit/UIKit.h>


@interface ARNavigationButton : UIButton

- (id)initWithTitle:(NSString *)title;
- (id)initWithTitle:(NSString *)title andSubtitle:(NSString *)subtitle;
- (id)initWithTitle:(NSString *)title andSubtitle:(NSString *)subtitle withBorder:(CGFloat)borderWidth;
- (id)initWithFrame:(CGRect)frame withBorder:(CGFloat)borderWidth;
- (id)initWithFrame:(CGRect)frame andTitle:(NSString *)title andSubtitle:(NSString *)subtitle withBorder:(CGFloat)borderWidth;

@property (readwrite, nonatomic, copy) NSString *title;
@property (readwrite, nonatomic, copy) NSString *subtitle;
@property (readwrite, nonatomic, copy) void (^onTap)(UIButton *button);
@end


@interface ARSerifNavigationButton : ARNavigationButton
@end
