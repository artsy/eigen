


@interface ARLabel (Private)
- (void)setup;
@end


@implementation ARArtworkTitleLabel

- (void)setTitle:(NSString *)artworkTitle date:(NSString *)date;
{
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];

    NSMutableAttributedString *titleAndDate = [[NSMutableAttributedString alloc] initWithString:artworkTitle ?: @"" attributes:@{
        NSParagraphStyleAttributeName : paragraphStyle
    }];

    if (date.length > 0) {
        NSString *separator = (artworkTitle.length > 0) ? @", " : @"";
        NSString *formattedTitleDate = [separator stringByAppendingString:date];
        NSAttributedString *andDate = [[NSAttributedString alloc] initWithString:formattedTitleDate attributes:@{
            NSFontAttributeName : [UIFont serifFontWithSize:self.font.pointSize]
        }];
        [titleAndDate appendAttributedString:andDate];
    }

    self.font = [UIFont serifItalicFontWithSize:self.font.pointSize];
    self.numberOfLines = 0;
    self.attributedText = titleAndDate;
}

@end


@implementation ARSansSerifHeaderLabel

- (void)setup
{
    self.backgroundColor = [UIColor whiteColor];
    self.opaque = YES;
    CGFloat fontSize = [UIDevice isPad] ? 25 : 18;
    self.font = [UIFont sansSerifFontWithSize:fontSize];
    self.numberOfLines = 0;
    self.lineBreakMode = NSLineBreakByWordWrapping;

    self.textAlignment = NSTextAlignmentCenter;
    self.preferredMaxLayoutWidth = [UIDevice isPad] ? 640 : 200;
}

- (void)setText:(NSString *)text
{
    [self setText:text.uppercaseString withLetterSpacing:[UIDevice isPad] ? 1.9 : 0.5];
}

@end


@interface ARWarningView ()
@property (readwrite, nonatomic, strong) UIImageView *attentionSign;
@end

static CGFloat ARWarningViewInset = 60;


@implementation ARWarningView

- (void)setup
{
    [super setup];
    self.textAlignment = NSTextAlignmentCenter;
    self.backgroundColor = [UIColor artsyAttention];
    self.attentionSign = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"AttentionIcon"]];
    [self addSubview:self.attentionSign];
}

- (void)drawTextInRect:(CGRect)rect
{
    CGSize size = self.attentionSign.image.size;
    UIEdgeInsets insets = {0, ARWarningViewInset + 8 + size.width, 0, ARWarningViewInset};
    [super drawTextInRect:UIEdgeInsetsInsetRect(rect, insets)];
}

- (void)layoutSubviews;
{
    [super layoutSubviews];

    CGRect frame = self.attentionSign.bounds;
    frame.origin.x = ((CGRectGetWidth(self.bounds) - self.intrinsicContentSize.width) / 2) - ARWarningViewInset - CGRectGetWidth(frame) - 8;
    frame.origin.y = (CGRectGetHeight(self.bounds) - CGRectGetHeight(frame)) / 2;
    self.attentionSign.frame = frame;
}

@end
