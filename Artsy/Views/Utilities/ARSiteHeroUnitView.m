#import "ARSiteHeroUnitView.h"
#import "ARParallaxEffect.h"

#define AR_HERO_TITLE_FONT 26

static ARParallaxEffect *backgroundParallax;
static const NSInteger ARHeroUnitParallaxDistance = 30;
static const CGFloat ARHeroUnitBottomMargin = 34;
static const CGFloat ARHeroUnitDescriptionButtonMargin = 25;
static const CGFloat ARHeroUnitButtonCreditMargin = 21;
static const CGFloat ARHeroUnitTopMargin = 97;
static CGFloat ARHeroUnitSideMargin;
static CGFloat ARHeroUnitHeadingTitleMargin;
static CGFloat ARHeroUnitTitleDescriptionMargin;
static CGFloat ARHeroUnitDescriptionFont;


@interface ARSiteHeroUnitView ()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, readonly) ARHeroUnitAlignment alignment;
@end


@implementation ARSiteHeroUnitView

+ (void)initialize
{
    backgroundParallax = [[ARParallaxEffect alloc] initWithOffset:ARHeroUnitParallaxDistance];
    if ([UIDevice isPad]) {
        ARHeroUnitSideMargin = 44;
        ARHeroUnitHeadingTitleMargin = 26;
        ARHeroUnitTitleDescriptionMargin = 31;
        ARHeroUnitDescriptionFont = 22;
    } else {
        ARHeroUnitSideMargin = 20;
        ARHeroUnitHeadingTitleMargin = 25;
        ARHeroUnitTitleDescriptionMargin = 22;
        ARHeroUnitDescriptionFont = 16;
    }
}

- (id)initWithFrame:(CGRect)frame unit:(SiteHeroUnit *)unit
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }

    self.clipsToBounds = YES;

    _style = unit.backgroundStyle;
    _alignment = [UIDevice isPad] ? unit.alignment : ARHeroUnitAlignmentLeft;
    UIImageView *imageView = [[UIImageView alloc] init];
    [self addSubview:imageView];
    [imageView constrainWidthToView:self predicate:@(ARHeroUnitParallaxDistance * 2).stringValue];
    [imageView constrainHeightToView:self predicate:@(ARHeroUnitParallaxDistance * 2).stringValue];
    [imageView alignCenterWithView:self];
    [imageView ar_setImageWithURL:unit.preferredImageURL];
    imageView.contentMode = UIViewContentModeScaleAspectFill;
    imageView.clipsToBounds = YES;
    imageView.backgroundColor = (self.style == ARHeroUnitImageColorBlack) ? [UIColor blackColor] : [UIColor whiteColor];
    _imageView = imageView;


    ORStackView *textViewsContainer = [[ORStackView alloc] init];
    textViewsContainer.bottomMarginHeight = 0;
    [self addSubview:textViewsContainer];
    CGFloat leftMarginMultiplier = _alignment == ARHeroUnitAlignmentLeft ? 1 : 1.5;
    CGFloat rightMarginMultiplier = _alignment == ARHeroUnitAlignmentLeft ? 1.5 : 1;
    [textViewsContainer alignLeadingEdgeWithView:self predicate:NSStringWithFormat(@"%f", ARHeroUnitSideMargin * leftMarginMultiplier)];
    [textViewsContainer alignTrailingEdgeWithView:self predicate:NSStringWithFormat(@"-%f", ARHeroUnitSideMargin * rightMarginMultiplier)];

    UILabel *headingLabel = [self createHeadingLabelWithText:unit.heading ?: @""];
    UIView *titleView;
    if ([UIDevice isPad] && unit.titleImageURL) {
        titleView = [self createTitleImageWithImageURL:unit.titleImageURL];
    } else {
        titleView = [self createTitleLabelWithText:unit.title ?: @""];
    }
    UILabel *descriptionLabel = [self createDescriptionLabelWithText:unit.body ?: @""];

    [textViewsContainer addSubview:headingLabel withTopMargin:nil sideMargin:nil];

    [textViewsContainer addSubview:titleView withTopMargin:NSStringWithFormat(@"%f", ARHeroUnitHeadingTitleMargin)
                        sideMargin:nil];

    [textViewsContainer addSubview:descriptionLabel withTopMargin:NSStringWithFormat(@"%f", ARHeroUnitTitleDescriptionMargin)
                        sideMargin:nil];

    if ([UIDevice isPad]) {
        ARHeroUnitButton *button = [self createButtonWithColor:unit.buttonColor inverseColor:unit.inverseButtonColor andText:unit.linkText];
        [textViewsContainer addSubview:button withTopMargin:NSStringWithFormat(@"%f", ARHeroUnitDescriptionButtonMargin)];
        if (self.alignment == ARHeroUnitAlignmentRight) {
            [button alignTrailingEdgeWithView:textViewsContainer predicate:@"0"];
        } else {
            [button alignLeadingEdgeWithView:textViewsContainer predicate:@"0"];
        }
        UILabel *credit = [self createCreditLabelWithText:unit.creditLine];
        [textViewsContainer addSubview:credit withTopMargin:NSStringWithFormat(@"%f", ARHeroUnitButtonCreditMargin) sideMargin:nil];
        [textViewsContainer alignTopEdgeWithView:self predicate:NSStringWithFormat(@"%f", ARHeroUnitTopMargin)];
    } else {
        [textViewsContainer alignBottomEdgeWithView:self predicate:NSStringWithFormat(@"-%f", ARHeroUnitBottomMargin)];
    }

    self.userInteractionEnabled = YES;
    [self.imageView addMotionEffect:backgroundParallax];

    return self;
}

- (UILabel *)createHeadingLabelWithText:(NSString *)text
{
    UILabel *headingLabel = [[UILabel alloc] init];
    headingLabel.font = [UIDevice isPad] ? [UIFont serifFontWithSize:17] : [UIFont sansSerifFontWithSize:14];

    NSMutableAttributedString *attributedHeader = nil;
    attributedHeader = [[NSMutableAttributedString alloc] initWithString:[text uppercaseString]];
    [attributedHeader addAttribute:NSKernAttributeName value:@0.9 range:NSMakeRange(0, text.length)];

    headingLabel.attributedText = attributedHeader;
    [self styleLabel:headingLabel withAlignment:self.alignment andStyle:self.style];
    return headingLabel;
}

- (UILabel *)createTitleLabelWithText:(NSString *)text
{
    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.font = [UIFont sansSerifFontWithSize:AR_HERO_TITLE_FONT];

    NSMutableAttributedString *attributedTitle = nil;
    NSString *title = [text stringByReplacingOccurrencesOfString:@"\n\n" withString:@"\n"];
    attributedTitle = [[NSMutableAttributedString alloc] initWithString:[title uppercaseString]];
    [attributedTitle addAttribute:NSKernAttributeName value:@1.5 range:NSMakeRange(0, title.length)];
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    [style setMaximumLineHeight:27];
    [attributedTitle addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, title.length)];

    titleLabel.attributedText = attributedTitle;
    [self styleLabel:titleLabel withAlignment:self.alignment andStyle:self.style];
    return titleLabel;
}

- (UIImageView *)createTitleImageWithImageURL:(NSURL *)titleImageURL
{
    UIImageView *titleImageView = [[UIImageView alloc] init];
   @_weakify(titleImageView);
    [titleImageView ar_setImageWithURL:titleImageURL completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            @_strongify(titleImageView);
            titleImageView.image = [UIImage imageWithCGImage:image.CGImage scale:2.58 orientation:image.imageOrientation];
    }];
    if (self.alignment == ARHeroUnitAlignmentRight) {
        titleImageView.contentMode = UIViewContentModeRight;
    } else {
        titleImageView.contentMode = UIViewContentModeLeft;
    }
    return titleImageView;
}

- (UILabel *)createDescriptionLabelWithText:(NSString *)text
{
    UILabel *descriptionLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    descriptionLabel.font = [UIFont serifFontWithSize:ARHeroUnitDescriptionFont];

    // On the site they use double \n which looks ugly when small
    text = [text stringByReplacingOccurrencesOfString:@"\n\n" withString:@"\n"];

    // They also have a tendency to only check line-break alignment on desktop
    descriptionLabel.text = [text stringByReplacingOccurrencesOfString:@"\n" withString:@" "];

    [self styleLabel:descriptionLabel withAlignment:self.alignment andStyle:self.style];
    return descriptionLabel;
}
- (UILabel *)createCreditLabelWithText:(NSString *)text
{
    ARItalicsSerifLabel *creditLabel = [[ARItalicsSerifLabel alloc] init];
    creditLabel.font = [[creditLabel font] fontWithSize:9];
    creditLabel.text = text;
    [self styleLabel:creditLabel withAlignment:self.alignment andStyle:self.style];
    return creditLabel;
}
- (void)styleLabel:(UILabel *)label withAlignment:(ARHeroUnitAlignment)alignment andStyle:(ARHeroUnitImageColor)style
{
    label.backgroundColor = [UIColor clearColor];
    label.numberOfLines = 0;
    if (alignment == ARHeroUnitAlignmentRight) {
        [label setTextAlignment:NSTextAlignmentRight];
    }
    if (style == ARHeroUnitImageColorBlack) {
        [self applyShadowToLabel:label];
    }
    label.textColor = [self textColorForStyle:style];
}

- (UIColor *)textColorForStyle:(ARHeroUnitImageColor)style
{
    return style == ARHeroUnitImageColorBlack ? [UIColor whiteColor] : [UIColor blackColor];
}

- (void)applyShadowToLabel:(UILabel *)label
{
    label.clipsToBounds = NO;
    label.layer.shadowOpacity = 0.8;
    label.layer.shadowRadius = 2.0;
    label.layer.shadowOffset = CGSizeZero;
    label.layer.shadowColor = [UIColor artsyHeavyGrey].CGColor;
    label.layer.shouldRasterize = YES;
}

- (ARHeroUnitButton *)createButtonWithColor:(UIColor *)color inverseColor:(UIColor *)inverseColor andText:(NSString *)text
{
    ARHeroUnitButton *button = [[ARHeroUnitButton alloc] init];
    [button setColor:color];
    [button setInverseColor:inverseColor];
    [button setTitle:text forState:UIControlStateNormal];
    return button;
}

@end
