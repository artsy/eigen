#import "AROnboardingFollowableTableViewCell.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingFollowableTableViewCell ()


@end


@implementation AROnboardingFollowableTableViewCell


- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        _thumbnail = [[UIImageView alloc] init];
        _title = [[ARSansSerifLabel alloc] init];
        _follow = [[UIImageView alloc] init];

        [self addSubview:self.thumbnail];
        [self addSubview:self.title];
        [self addSubview:self.follow];

        [self.thumbnail alignLeadingEdgeWithView:self predicate:@"5"];
        [self.thumbnail alignTopEdgeWithView:self predicate:@"5"];
        [self.thumbnail alignBottomEdgeWithView:self predicate:@"-5"];
        [self.thumbnail constrainWidthToView:self predicate:@"*.2"];

        self.thumbnail.contentMode = UIViewContentModeScaleAspectFit;

        [self.title constrainLeadingSpaceToView:self.thumbnail predicate:@"5"];
        [self.title constrainWidthToView:self predicate:@"*.6"];
        [self.title constrainHeightToView:self predicate:@"0"];

        [self.follow alignTrailingEdgeWithView:self predicate:@"5"];
        [self.follow alignTopEdgeWithView:self predicate:@"5"];
        [self.follow alignBottomEdgeWithView:self predicate:@"-5"];
        [self.follow constrainWidthToView:self predicate:@"*.2"];


        self.follow.contentMode = UIViewContentModeScaleAspectFit;
    }

    return self;
}

- (void)prepareForReuse
{
    _thumbnail = nil;
    _title = nil;
    _follow = nil;
}

- (void)updateConstraints
{
    [super updateConstraints];
}
@end
