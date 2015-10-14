#import <Artsy+UILabels/ARLabelSubclasses.h>


@interface ARArtworkTitleLabel : ARItalicsSerifLabel
@property (nonatomic, assign) CGFloat lineHeight;
- (void)setTitle:(NSString *)artworkTitle date:(NSString *)date;
@end

// Title label for use at the top of certain views


@interface ARSansSerifHeaderLabel : ARLabel
@end


@interface ARWarningView : ARSerifLabel
@end
