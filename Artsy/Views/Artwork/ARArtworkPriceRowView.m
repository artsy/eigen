#import "ARArtworkPriceRowView.h"

#import "ARFonts.h"

#import <Artsy+UILabels/Artsy+UILabels.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARArtworkPriceRowView()

@property (nonatomic, strong) UIImageView *priceAccessoryImageView;

@end

@implementation ARArtworkPriceRowView

- (id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        [self initialSetup];
    }
    return self;
}

- (void)initialSetup {
    UILabel *messageLabel = [[ARSerifLabel alloc] init];
    messageLabel.font = [UIFont serifSemiBoldFontWithSize:18];
    [self addSubview:messageLabel];
    self.messageLabel = messageLabel;

    UILabel *priceLabel = [[ARSerifLabel alloc] init];
    priceLabel.textAlignment = NSTextAlignmentRight;
    priceLabel.font = [UIFont serifSemiBoldFontWithSize:18];
    [self addSubview:priceLabel];
    self.priceLabel = priceLabel;

    UIImageView *priceAccessoryImageView = [[UIImageView alloc] init];
    [self addSubview:priceAccessoryImageView];
    self.priceAccessoryImageView = priceAccessoryImageView;

    // As the prefix & price share a horizontal constraint, so we use the hugging priority
    // to let them decide who gets more of the bed. In this case, the price.

    [messageLabel setContentHuggingPriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisHorizontal];
    [priceLabel setContentHuggingPriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
}

- (void)updateConstraints
{
    [super updateConstraints];
    [self.messageLabel alignLeadingEdgeWithView:self predicate:@"0"];
    [self.messageLabel alignTopEdgeWithView:self predicate:@(self.margin).stringValue];
    [self.priceLabel alignTrailingEdgeWithView:self predicate:@"0"];
    if (self.priceAccessoryImageView.image) {
        [self.priceAccessoryImageView constrainLeadingSpaceToView:self.messageLabel predicate:@">=4"];
        [self.priceLabel constrainLeadingSpaceToView:self.priceAccessoryImageView predicate:@"5"];
    } else {
        [self.priceLabel constrainLeadingSpaceToView:self.messageLabel predicate:@"4"];
    }
    [self.priceLabel alignTopEdgeWithView:self predicate:@(self.margin).stringValue];
    [self.messageLabel alignCenterYWithView:self.priceLabel predicate:@"0"];
    [self.priceAccessoryImageView alignCenterYWithView:self.priceLabel predicate:@"-2"];

    [self alignBottomEdgeWithView:self.messageLabel predicate:NSStringWithFormat(@">=%@@1000", @(self.margin).stringValue)];
    [self alignBottomEdgeWithView:self.priceLabel predicate:NSStringWithFormat(@">=%@@1000", @(self.margin).stringValue)];


    [self alignBottomEdgeWithView:self.messageLabel predicate:NSStringWithFormat(@"%@@250", @(self.margin))];
    [self alignBottomEdgeWithView:self.priceLabel predicate:NSStringWithFormat(@"%@@250", @(self.margin))];
}

#pragma mark - Public Methods

- (void)setPriceAccessoryImage:(UIImage *)image
{
    self.priceAccessoryImageView.image = image;
    [self setNeedsLayout];
}

@end
