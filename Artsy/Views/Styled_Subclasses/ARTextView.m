#import "ARLogger.h"
#import "ARTextView.h"

#import "ARTheme.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARDispatchManager.h"
#import "Artsy-Swift.h"

#import <MMMarkdown/MMMarkdown.h>


@implementation ARTextView

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.font = [ARTheme defaultTheme].fonts[@"BodyText"];
    self.scrollEnabled = NO;
    self.editable = NO;
    self.selectable = YES;
    self.bounces = NO;
    self.dataDetectorTypes = UIDataDetectorTypeNone;
    self.tintColor = [UIColor blackColor];
    self.delegate = self;
    self.opaque = YES;
    self.textContainerInset = UIEdgeInsetsZero;
    self.textContainer.lineFragmentPadding = 0;

    return self;
}

- (void)setMarkdownString:(NSString *)string
{
    if (string.length == 0) {
        DDLogWarn(@"You shouldn't be using markdown with an empty string. Noop-ing.");
        return;
    }

    ar_dispatch_on_queue(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSError *error = nil;
        NSString *HTML = [MMMarkdown HTMLStringWithMarkdown:string error:&error];
        ar_dispatch_main_queue(^{
            if (error) {
                ARErrorLog(@"Error Parsing markdown! %@", string);
                self.text = @"Error Parsing markdown";
            } else {
                [self setHTMLString:HTML];
            }
        });
    });
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
    [super setBackgroundColor:backgroundColor];

    // If we want the layer to not blend
    // we need to get the _UITextContainerView off UIColor clearColor
    for (UIView *subview in self.subviews) {
        subview.backgroundColor = backgroundColor;
    }
}

- (void)setHTMLString:(NSString *)HTMLstring
{
    NSAssert([NSThread isMainThread], @"HTML content must be assigned from the main thread.");

    // This *MUST* be performed on the next runloop iteration, otherwise the HTML parsing of NSAttributedString will
    // crash. For more information see https://github.com/artsy/eigen/issues/348.
    ar_dispatch_on_queue(dispatch_get_main_queue(), ^{
        NSAttributedString *string = [self.class artsyBodyTextAttributedStringFromHTML:HTMLstring withFont:self.font useSemiBold:self.useSemiBold];

        // SCREW IT MEGAHACK to get paragraph spacing right.
        NSMutableAttributedString *mutableCopy = string.mutableCopy;
        
        NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];

        if (self.expectsSingleLine) {
            [style setParagraphSpacing:-1 * self.font.pointSize];
        } else {
            [style setParagraphSpacing:20];
        }

        [style setLineSpacing:5];
        [mutableCopy addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, mutableCopy.length)];

        if (self.plainLinks) {
            [mutableCopy addAttribute:NSUnderlineStyleAttributeName value:@0 range:NSMakeRange(0, mutableCopy.length)];
        }

        self.attributedText = mutableCopy;

        [self.superview setNeedsUpdateConstraints];
    });
}

+ (NSAttributedString *)artsyBodyTextAttributedStringFromHTML:(NSString *)HTML withFont:(UIFont *)font useSemiBold:(BOOL)useSemiBold
{
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    style.lineHeightMultiple = 1.2;

    style.paragraphSpacing = font.pointSize * .5;

    NSDictionary *textParams = @{
        NSFontAttributeName : font,
        NSParagraphStyleAttributeName : style,
        NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle)
    };

    return [self _attributedStringWithTextParams:textParams andHTML:HTML useSemiBold:useSemiBold];
}


+ (NSString *)_cssStringFromAttributedStringAttributes:(NSDictionary *)dictionary
{
    NSMutableString *cssString = [NSMutableString stringWithString:@"<style> p {"];

    if ([dictionary objectForKey:NSFontAttributeName]) {
        UIFont *font = dictionary[NSFontAttributeName];
        [cssString appendFormat:@"font-family:'%@'; font-size: %0.fpx;", font.fontName, roundf(font.pointSize)];
    }

    if (dictionary[NSParagraphStyleAttributeName]) {
        NSParagraphStyle *style = dictionary[NSParagraphStyleAttributeName];
        [cssString appendFormat:@"line-height:%0.1f em;", style.lineHeightMultiple];
    }

    [cssString appendString:@"}"];

    [cssString appendString:@"</style><body>"];
    return cssString;
}

+ (NSAttributedString *)_attributedStringWithTextParams:(NSDictionary *)textParams andHTML:(NSString *)HTML useSemiBold:(BOOL)useSemiBold
{
    NSDictionary *importParams = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType};

    NSError *error = nil;
    NSString *formatString = [[self _cssStringFromAttributedStringAttributes:textParams] stringByAppendingFormat:@"%@</body>", HTML];
    NSData *stringData = [formatString dataUsingEncoding:NSUnicodeStringEncoding];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithData:stringData options:importParams documentAttributes:NULL error:&error];
    if (error) {
        ARErrorLog(@"Error creating NSAttributedString from HTML %@", error.localizedDescription);
        return nil;
    }

    if (useSemiBold) {
        attributedString = [attributedString makeBoldOccurencesSansSerifSemiBold];
    }

    return attributedString;
}

- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction
{
    UIViewController *viewController = nil;
    if ([URL.scheme isEqualToString:@"applewebdata"]) {
        viewController = [ARSwitchBoard.sharedInstance loadPath:URL.path];
    } else {
        viewController = [ARSwitchBoard.sharedInstance loadURL:URL];
    }

    if (viewController) {
        [self.viewControllerDelegate textView:self shouldOpenViewController:viewController];
    }

    return NO;
}

@end
