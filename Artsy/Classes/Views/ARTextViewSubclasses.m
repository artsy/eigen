#import "ARTextViewSubclasses.h"

// UITextView has a bit of padding by default
#define ARTextViewContentInset UIEdgeInsetsMake(-8, -8, -8, -8)


@implementation ARArtworkTitleTextView

- (id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        self.textContainer.lineFragmentPadding = 0;
    }
    return self;
}

- (void)setTitleFromArtwork:(Artwork *)artwork
{
    NSAssert(artwork.title, @"Artwork With no title given to an ARArtworkTitleTextView");

    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];

    NSMutableAttributedString *titleAndDate = [[NSMutableAttributedString alloc] initWithString:artwork.title attributes:@{NSParagraphStyleAttributeName : paragraphStyle}];

    [titleAndDate addAttribute:NSFontAttributeName value:[UIFont serifItalicFontWithSize:16] range:NSMakeRange(0, [artwork.title length])];

    if (artwork.date.length) {
        NSString *formattedTitleDate = [NSString stringWithFormat:@", %@", artwork.date];
        NSAttributedString *andDate = [[NSAttributedString alloc] initWithString:formattedTitleDate attributes:@{NSFontAttributeName : [UIFont serifFontWithSize:16]}];
        [titleAndDate appendAttributedString:andDate];
    }

    self.attributedText = titleAndDate;
}

@end
