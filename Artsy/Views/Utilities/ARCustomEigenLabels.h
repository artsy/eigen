#import <Artsy+UILabels/Artsy+UILabels.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARArtworkTitleLabel : ARItalicsSerifLabel
@property (nonatomic, assign) CGFloat lineHeight;
- (void)setTitle:(NSString *)artworkTitle date:( NSString * _Nullable )date;
- (void)setText:(NSString * _Nullable )text __attribute__((unavailable("Please use setTitle:date:.")));
@end

// Title label for use at the top of certain views


@interface ARSansSerifHeaderLabel : ARLabel
@end


@interface ARWarningView : ARSerifLabel
@end

NS_ASSUME_NONNULL_END
