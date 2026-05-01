#import <UIKit/UIKit.h>

@interface ARLabel : UILabel
@end

@interface ARSerifLabel : ARLabel
@end


@interface ARSansSerifLabel : ARLabel
@end

@interface ARItalicsSerifLabel : ARLabel
@end


/// Will convert the text into an attributed string with the correct line height.
@interface ARSerifLineHeightLabel : ARSerifLabel
- (instancetype)initWithLineSpacing:(CGFloat)lineHeight;
@property (nonatomic, assign) CGFloat lineHeight;
@end
