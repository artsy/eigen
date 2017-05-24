#import <UIKit/UIKit.h>


@implementation UILabel (ArtsyTypography)

- (void)setText:(NSString *)text withLineHeight:(CGFloat)lineHeight
{
    if (!text) {
        return;
    }
    NSMutableAttributedString *attr = [[NSMutableAttributedString alloc] initWithString:text];
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:lineHeight];
    [paragraphStyle setAlignment:self.textAlignment];

    [attr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [text length])];
    self.attributedText = attr;
}

- (void)setText:(NSString *)text withLetterSpacing:(CGFloat)letterSpacing
{
    if (!text) {
        return;
    }
    NSMutableAttributedString *attributedText = nil;
    attributedText = [[NSMutableAttributedString alloc] initWithString:text];
    [attributedText addAttribute:NSKernAttributeName value:@(letterSpacing) range:NSMakeRange(0, text.length)];
    self.attributedText = attributedText;
}

@end
