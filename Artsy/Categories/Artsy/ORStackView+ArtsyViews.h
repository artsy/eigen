#import <ORStackView/ORStackView.h>


@interface ORStackView (ArtsyViews)

/// Use the consistently styled page title which is has
/// a larger letter spacing.

- (UILabel *)addPageTitleWithString:(NSString *)title;
- (UILabel *)addPageTitleWithString:(NSString *)title tag:(NSInteger)tag;

/// An alternative page title style
- (void)addSerifPageTitle:(NSString *)title subtitle:(NSString *)subtitle;
- (void)addSerifPageTitle:(NSString *)title subtitle:(NSString *)subtitle tag:(NSInteger)tag;

/// An alternative page subtitle style
- (UILabel *)addSerifPageSubtitle:(NSString *)subtitle;
- (UILabel *)addSerifPageSubtitle:(NSString *)subtitle tag:(NSInteger)tag;

/// Use a consistent subtitle
- (UILabel *)addPageSubtitleWithString:(NSString *)title;
- (UILabel *)addPageSubtitleWithString:(NSString *)title tag:(NSInteger)tag;
- (UILabel *)addPageSubtitleWithString:(NSString *)title withTopMargin:(NSString *)topMargin tag:(NSInteger)tag;

/// Use a consistent seperator
- (UIView *)addGenericSeparatorWithSideMargin:(NSString *)sideMargin;
- (UIView *)addGenericSeparatorWithSideMargin:(NSString *)sideMargin tag:(NSInteger)tag;

/// Sometimes there should be a whitespace
- (UIView *)addWhiteSpaceWithHeight:(NSString *)height;
- (UIView *)addWhiteSpaceWithHeight:(NSString *)height tag:(NSInteger)tag;

/// Ensure scrolling behavior by adding a whitespace gobbler and a full height constraint.
- (UIView *)ensureScrollingWithHeight:(CGFloat)height;
- (UIView *)ensureScrollingWithHeight:(CGFloat)height tag:(NSInteger)tag;
@end
