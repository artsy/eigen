#import <UIKit/UIKit.h>


@interface ARAnimatedTickView : UIView
- (id)initWithSelection:(BOOL)selected;

- (BOOL)selected;
- (void)setSelected:(BOOL)selected animated:(BOOL)animated;
@end
