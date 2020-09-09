#import "ORStackView+ArtsyViews.h"

#import "ARFonts.h"
#import "ARWhitespaceGobbler.h"
#import "ARSeparatorViews.h"
#import "ARCustomEigenLabels.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation ORStackView (ArtsyViews)

- (UILabel *)addPageTitleWithString:(NSString *)title
{
    return [self addPageTitleWithString:title tag:0];
}

- (UILabel *)addPageTitleWithString:(NSString *)title tag:(NSInteger)tag
{
    UILabel *titleLabel = [[ARSansSerifHeaderLabel alloc] init];
    titleLabel.tag = tag;
    [titleLabel setText:title];
    [self addSubview:titleLabel withTopMargin:[UIDevice isPad] ? @"50" : @"20" sideMargin:@"120"];
    return titleLabel;
}

- (UILabel *)addPageSubtitleWithString:(NSString *)title
{
    return [self addPageSubtitleWithString:title tag:0];
}

- (UILabel *)addPageSubtitleWithString:(NSString *)title tag:(NSInteger)tag
{
    return [self addPageSubtitleWithString:title withTopMargin:@"44" tag:tag];
}

- (UILabel *)addPageSubtitleWithString:(NSString *)title withTopMargin:(NSString *)topMargin tag:(NSInteger)tag;
{
    UILabel *featuredTitle = [self labelForViewSubHeaders];
    featuredTitle.text = title.uppercaseString;
    featuredTitle.tag = tag;
    [self addSubview:featuredTitle withTopMargin:topMargin sideMargin:@"40"];
    return featuredTitle;
}

- (void)addSerifPageTitle:(NSString *)title subtitle:(NSString *)subtitle
{
    return [self addSerifPageTitle:title subtitle:subtitle tag:0];
}

- (void)addSerifPageTitle:(NSString *)title subtitle:(NSString *)subtitle tag:(NSInteger)tag
{
    UILabel *titleLabel = [self labelForSerifHeaders];
    titleLabel.text = title;
    titleLabel.tag = tag;
    [self addSubview:titleLabel withTopMargin:@"20" sideMargin:@"80"];

    [self addSerifPageSubtitle:subtitle tag:tag + 1];
}

- (UILabel *)addSerifPageSubtitle:(NSString *)subtitle;
{
    return [self addSerifPageSubtitle:subtitle tag:0];
}

- (UILabel *)addSerifPageSubtitle:(NSString *)subtitle tag:(NSInteger)tag;
{
    UILabel *subtitleLabel = [self labelForSerifSubHeaders];
    subtitleLabel.text = subtitle;
    subtitleLabel.tag = tag;
    subtitleLabel.font = [UIFont serifFontWithSize:16];
    subtitleLabel.textColor = [UIColor blackColor];
    [self addSubview:subtitleLabel withTopMargin:@"8" sideMargin:@"48"];
    return subtitleLabel;
}

- (UIView *)addGenericSeparatorWithSideMargin:(NSString *)sideMargin
{
    return [self addGenericSeparatorWithSideMargin:sideMargin tag:0];
}

- (UIView *)addGenericSeparatorWithSideMargin:(NSString *)sideMargin tag:(NSInteger)tag
{
    ARSeparatorView *separator = [[ARSeparatorView alloc] init];
    separator.tag = tag;
    [self addSubview:separator withTopMargin:@"12" sideMargin:sideMargin];
    return separator;
}

- (UIView *)addWhiteSpaceWithHeight:(NSString *)height
{
    return [self addWhiteSpaceWithHeight:height tag:0];
}

- (UIView *)addWhiteSpaceWithHeight:(NSString *)height tag:(NSInteger)tag
{
    UIView *gap = [[UIView alloc] init];
    gap.tag = tag;
    gap.backgroundColor = [UIColor whiteColor];
    [self addSubview:gap withTopMargin:height sideMargin:nil];
    return gap;
}

- (UIView *)ensureScrollingWithHeight:(CGFloat)height
{
    return [self ensureScrollingWithHeight:height tag:0];
}

- (UIView *)ensureScrollingWithHeight:(CGFloat)height tag:(NSInteger)tag
{
    NSString *heightConstraint = [NSString stringWithFormat:@">=%.0f@800", height];
    [self constrainHeight:heightConstraint];

    ARWhitespaceGobbler *whitespaceGobbler = [[ARWhitespaceGobbler alloc] init];
    whitespaceGobbler.tag = tag;
    [self addSubview:whitespaceGobbler withTopMargin:nil sideMargin:nil];
    return whitespaceGobbler;
}

- (UILabel *)labelForViewSubHeaders
{
    UILabel *label = [[UILabel alloc] init];
    label.backgroundColor = [UIColor whiteColor];
    label.opaque = YES;
    label.font = [UIFont sansSerifFontWithSize:16];
    label.numberOfLines = 0;
    label.lineBreakMode = NSLineBreakByWordWrapping;
    label.textAlignment = NSTextAlignmentCenter;
    label.preferredMaxLayoutWidth = 220;
    return label;
}

- (UILabel *)labelForSerifHeaders
{
    UILabel *label = [[UILabel alloc] init];
    label.backgroundColor = [UIColor whiteColor];
    label.opaque = YES;
    label.font = [UIFont serifFontWithSize:21];
    label.numberOfLines = 0;
    label.lineBreakMode = NSLineBreakByWordWrapping;
    label.textAlignment = NSTextAlignmentCenter;
    label.preferredMaxLayoutWidth = 200;
    return label;
}

- (UILabel *)labelForSerifSubHeaders
{
    UILabel *label = [[UILabel alloc] init];
    label.backgroundColor = [UIColor whiteColor];
    label.opaque = YES;
    label.font = [UIFont serifFontWithSize:18];
    label.numberOfLines = 0;
    label.lineBreakMode = NSLineBreakByWordWrapping;
    label.textAlignment = NSTextAlignmentCenter;
    label.preferredMaxLayoutWidth = 220;
    return label;

}

@end
