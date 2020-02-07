#import "ARTermsAndConditionsView.h"

#import "ARFonts.h"

@implementation ARTermsAndConditionsView


- (void)awakeFromNib
{
    [super awakeFromNib];
    [self setup];
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }
    [self setup];
    return self;
}

- (void)setup
{
    UIColor *textColor = ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad) ? [UIColor whiteColor] : [UIColor blackColor];
    self.tintColor = textColor;
    self.editable = NO;
    self.scrollEnabled = NO;
    NSString *string = @"By creating your Artsy account you agree\nto our Terms of Use and Privacy Policy.";
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:string
                                                                                         attributes:@{
                                                                                             NSFontAttributeName : [UIFont serifFontWithSize:14],
                                                                                             NSForegroundColorAttributeName : textColor
                                                                                         }];

    NSRange termsRange = [attributedString.string rangeOfString:@"Terms of Use"];
    NSRange privacyRange = [attributedString.string rangeOfString:@"Privacy Policy"];
    [attributedString beginEditing];
    [attributedString addAttribute:NSLinkAttributeName
                             value:[NSURL URLWithString:@"/terms"]
                             range:termsRange];

    [attributedString addAttribute:NSUnderlineStyleAttributeName
                             value:[NSNumber numberWithInt:NSUnderlineStyleSingle]
                             range:termsRange];

    [attributedString addAttribute:NSUnderlineStyleAttributeName
                             value:@(NSUnderlineStyleSingle)
                             range:privacyRange];

    [attributedString addAttribute:NSLinkAttributeName
                             value:[NSURL URLWithString:@"/privacy"]
                             range:privacyRange];
    [attributedString endEditing];

    [self setAttributedText:attributedString];

    self.textAlignment = NSTextAlignmentCenter;
    self.delegate = self;
    self.backgroundColor = [UIColor clearColor];
}

- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction
{
    NSString *path = [[URL.absoluteString componentsSeparatedByString:@"/"] lastObject];
    if ([path isEqualToString:@"terms"]) {
        [[UIApplication sharedApplication] sendAction:@selector(openTerms) to:nil from:self forEvent:nil];

    } else if ([path isEqualToString:@"privacy"]) {
        [[UIApplication sharedApplication] sendAction:@selector(openPrivacy) to:nil from:self forEvent:nil];
    }

    return NO;
}

@end
