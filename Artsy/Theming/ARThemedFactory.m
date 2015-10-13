#import "ARSeparatorViews.h"

#import "ARTheme.h"

@implementation ARThemedFactory

+ (UIView *)viewForFeedItemSeperatorAttachedToView:(UIView *)container
{
    ARTheme *theme = [ARTheme defaultTheme];
    ARThemeLayoutVendor *layout = [theme layout];

    ARSeparatorView *separatorView = [[ARSeparatorView alloc] init];
    separatorView.backgroundColor = theme.colors[@"FeedItemSeperatorBackgroundColor"];

    // This has to be added in this function or the constraints won't work
    [container addSubview:separatorView];

    [separatorView constrainHeight:layout[@"FeedItemSeperatorHeight"]];
    [separatorView constrainWidthToView:container predicate:layout[@"FeedItemSeperatorHorizontalMargin"]];
    [separatorView alignCenterXWithView:container predicate:layout[@"FeedItemSeperatorXOffset"]];
    [separatorView alignAttribute:NSLayoutAttributeBottom toAttribute:NSLayoutAttributeBottom ofView:container predicate:layout[@"FeedItemSeperatorBottomMargin"]];

    return separatorView;
}

+ (UILabel *)labelForFeedSectionHeaders
{
    return [self _labelForIdentifier:@"FeedSectionTitle"];
}

+ (UILabel *)labelForFeedItemHeaders
{
    return [self _labelForIdentifier:@"FeedHeaderTitle"];
}

+ (UILabel *)labelForFeedItemSubheadings
{
    return [self _labelForIdentifier:@"FeedHeaderSubtitle"];
}

+ (UILabel *)labelForBodyText
{
    return [self _labelForIdentifier:@"BodyText"];
}

+ (UILabel *)labelForViewSubHeaders
{
    UILabel *titleLabel = [self _labelForIdentifier:@"ViewSubHeader"];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.preferredMaxLayoutWidth = 220;
    return titleLabel;
}

+ (UILabel *)labelForSerifHeaders
{
    UILabel *titleLabel = [self _labelForIdentifier:@"AltViewHeader"];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.preferredMaxLayoutWidth = 200;
    return titleLabel;
}

+ (UILabel *)labelForSerifSubHeaders
{
    UILabel *titleLabel = [self _labelForIdentifier:@"AltViewSubHeader"];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.preferredMaxLayoutWidth = 220;
    return titleLabel;
}


+ (UILabel *)_labelForIdentifier:(NSString *)identifier
{
    UILabel *label = [[UILabel alloc] init];
    label.backgroundColor = [UIColor whiteColor];
    label.opaque = YES;
    label.font = [ARTheme defaultTheme].fonts[identifier];
    label.numberOfLines = 0;
    label.lineBreakMode = NSLineBreakByWordWrapping;
    return label;
}

+ (UILabel *)labelForLinkItemTitles
{
    return [self _labelForIdentifier:@"LinkItemTitle"];
}

+ (UILabel *)labelForLinkItemSubtitles
{
    return [self _labelForIdentifier:@"LinkItemSubtitle"];
}

@end
