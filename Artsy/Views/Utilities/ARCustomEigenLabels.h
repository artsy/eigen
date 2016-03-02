#import <Artsy_UILabels/ARLabelSubclasses.h>


@interface ARArtworkTitleLabel : ARItalicsSerifLabel
@property (nonatomic, assign) CGFloat lineHeight;
- (void)setTitle:(NSString *)artworkTitle date:(NSString *)date;
- (void)setText:(NSString *)text __attribute__((unavailable("Please use setTitle:date:.")));
@end

// Title label for use at the top of certain views


@interface ARSansSerifHeaderLabel : ARLabel
@end


@interface ARWarningView : ARSerifLabel
@end
