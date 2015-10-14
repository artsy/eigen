#import "Artwork.h"
#import "ARArtworkBlurbView.h"
#import "ARTextView.h"

#import "ORStackView+ArtsyViews.h"
#import "UIDevice-Hardware.h"

@interface ARArtworkBlurbView () <ARTextViewDelegate>
@property (nonatomic, strong) UILabel *aboutHeading;
@property (nonatomic, strong) ARTextView *blurbTextView;

@end


@implementation ARArtworkBlurbView

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    self = [super init];
    if (!self) {
        return nil;
    }

   __weak typeof (self) wself = self;
    [artwork onArtworkUpdate:^{
        __strong typeof (wself) sself = wself;
        [sself updateWithArtwork:artwork];
    } failure:nil];

    return self;
}

- (void)updateWithArtwork:(Artwork *)artwork
{
    BOOL showBio = (artwork.blurb.length > 0);
    self.bottomMarginHeight = 0;

    if (showBio) {
        if (!self.aboutHeading) {
            self.aboutHeading = [self addPageSubtitleWithString:[NSLocalizedString(@"About this Artwork", @"About this artwork header") uppercaseString]];
        }

        if (!self.blurbTextView) {
            self.blurbTextView = [[ARTextView alloc] init];
            self.blurbTextView.viewControllerDelegate = self;
        }

        [self.blurbTextView setMarkdownString:artwork.blurb];

        NSString *sideMargin = [UIDevice isPad] ? @"280" : @"0";
        [self addSubview:self.blurbTextView withTopMargin:@"16" sideMargin:sideMargin];
        [self invalidateIntrinsicContentSize];
    }
}

- (CGSize)intrinsicContentSize
{
    CGFloat height = self.blurbTextView.text.length > 0 ? UIViewNoIntrinsicMetric : 0;
    return CGSizeMake(UIViewNoIntrinsicMetric, height);
}

#pragma mark - ARTextViewDelegate

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.delegate artworkBlurView:self shouldPresentViewController:viewController];
}

@end
