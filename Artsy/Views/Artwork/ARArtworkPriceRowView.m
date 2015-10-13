#import "ARArtworkPriceRowView.h"

#import "ARFonts.h"

@interface ARArtworkPriceRowView ()
@property (nonatomic, strong, readonly) ARSerifLabel *bidStatusLabel;
@end


@implementation ARArtworkPriceRowView

- (id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        UILabel *messageLabel = [[ARSerifLabel alloc] init];
        [self addSubview:messageLabel];
        self.messageLabel = messageLabel;

        UILabel *priceLabel = [[ARSerifLabel alloc] init];
        priceLabel.textAlignment = NSTextAlignmentRight;
        [self addSubview:priceLabel];
        self.priceLabel = priceLabel;

        _bidStatusLabel = [[ARSerifLabel alloc] init];
        self.bidStatusLabel.font = [UIFont serifFontWithSize:16];
        self.bidStatusLabel.textColor = [UIColor artsyHeavyGrey];
        self.bidStatusLabel.hidden = YES;
        [self addSubview:self.bidStatusLabel];

        // As the prefix & price share a horizontal constraint, so we use the hugging priority
        // to let them decide who gets more of the bed. In this case, the price.

        [messageLabel setContentHuggingPriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisHorizontal];
        [priceLabel setContentHuggingPriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
    }
    return self;
}

- (void)setBidStatusText:(NSString *)bidStatusText
{
    self.bidStatusLabel.text = bidStatusText;
    [self updateConstraints];
}

- (void)updateConstraints
{
    [super updateConstraints];
    [self.messageLabel alignLeadingEdgeWithView:self predicate:@"0"];
    [self.messageLabel alignTopEdgeWithView:self predicate:@(self.margin).stringValue];
    [self.priceLabel alignTrailingEdgeWithView:self predicate:@"0"];
    [self.priceLabel constrainLeadingSpaceToView:self.messageLabel predicate:@"4"];
    [self.priceLabel alignTopEdgeWithView:self predicate:@(self.margin).stringValue];
    [self.messageLabel alignCenterYWithView:self.priceLabel predicate:@"0"];

    [self alignBottomEdgeWithView:self.messageLabel predicate:NSStringWithFormat(@">=%@@1000", @(self.margin).stringValue)];
    [self alignBottomEdgeWithView:self.priceLabel predicate:NSStringWithFormat(@">=%@@1000", @(self.margin).stringValue)];


    [self alignBottomEdgeWithView:self.messageLabel predicate:NSStringWithFormat(@"%@@250", @(self.margin))];
    [self alignBottomEdgeWithView:self.priceLabel predicate:NSStringWithFormat(@"%@@250", @(self.margin))];

    if (self.bidStatusLabel.text.length > 0) {
        self.bidStatusLabel.hidden = NO;
        [self.bidStatusLabel constrainTopSpaceToView:self.messageLabel predicate:@"0"];
        [self.bidStatusLabel alignLeadingEdgeWithView:self.messageLabel predicate:@"0"];
        [self alignBottomEdgeWithView:self.bidStatusLabel predicate:NSStringWithFormat(@">=%@@1000", @(self.margin - 4).stringValue)];
        [self alignBottomEdgeWithView:self.bidStatusLabel predicate:NSStringWithFormat(@"%@@250", @(self.margin - 4).stringValue)];
    }
}

@end
