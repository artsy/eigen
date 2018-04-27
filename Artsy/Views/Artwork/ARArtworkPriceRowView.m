#import "ARArtworkPriceRowView.h"

#import "ARFonts.h"

#import <Artsy+UILabels/Artsy+UILabels.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


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

        // As the prefix & price share a horizontal constraint, so we use the hugging priority
        // to let them decide who gets more of the bed. In this case, the price.

        [messageLabel setContentHuggingPriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisHorizontal];
        [priceLabel setContentHuggingPriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
    }
    return self;
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
}

@end
