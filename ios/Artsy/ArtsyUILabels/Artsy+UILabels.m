#import "Artsy+UILabels.h"
#import "UIView+ARDrawing.h"
#import "UIColor+ArtsyColors.h"
#import "UIFont+ArtsyFonts.h"


@implementation ARLabel

- (id)init
{
    return [self initWithFrame:CGRectZero];
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) return nil;

    [self setup];

    return self;
}

- (void)awakeFromNib
{
    [super awakeFromNib];
    [self setup];
}

- (void)setup
{
    self.numberOfLines = 0;
    self.backgroundColor = [UIColor whiteColor];
    self.opaque = YES;
}

@end


@implementation ARSerifLabel

- (void)setup
{
    [super setup];
    self.font = [UIFont serifFontWithSize:self.font.pointSize];
}

@end

@implementation ARItalicsSerifLabel

- (void)setup
{
    [super setup];
    self.font = [UIFont serifItalicFontWithSize:self.font.pointSize];
}

@end

@implementation ARSansSerifLabel

- (void)setup
{
    [super setup];
    self.font = [UIFont sansSerifFontWithSize:self.font.pointSize];
}

- (void)setText:(NSString *)text
{
    [super setText:text.uppercaseString];
}

@end


@interface ARSerifLineHeightLabel()

@end

@implementation ARSerifLineHeightLabel

- (instancetype)initWithLineSpacing:(CGFloat)lineHeight
{
    self = [super init];
    if (!self) { return nil; }

    _lineHeight = lineHeight;

    return self;
}

- (void)setText:(NSString *)text
{
    NSMutableAttributedString *attr = [[NSMutableAttributedString alloc] initWithString:text];
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:self.lineHeight];
    [paragraphStyle setAlignment:self.textAlignment];

    [attr addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:NSMakeRange(0, [text length])];

    self.numberOfLines = 0;
    self.attributedText = attr;
}

@end
