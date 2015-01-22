@interface ARLabel (Private)
- (void)setup;
@end

@implementation ARArtworkTitleLabel

- (void)setTitle:(NSString *)artworkTitle date:(NSString *)date;
{
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];

    NSMutableAttributedString *titleAndDate = [[NSMutableAttributedString alloc] initWithString:artworkTitle ?: @"" attributes:@{
        NSParagraphStyleAttributeName: paragraphStyle
    }];

    if (date.length > 0) {
        NSString *formattedTitleDate = [@", " stringByAppendingString:date];
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