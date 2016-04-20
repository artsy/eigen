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

        [self.thumbnail alignLeadingEdgeWithView:self predicate:@"15"];
        [self.thumbnail constrainWidth:@"50" height:@"50"];
        [self.thumbnail alignCenterYWithView:self predicate:@"0"];

        self.thumbnail.contentMode = UIViewContentModeScaleAspectFit;

        [self.title constrainLeadingSpaceToView:self.thumbnail predicate:@"15"];
        [self.title alignCenterYWithView:self predicate:@"0"];
        [self.title constrainHeight:@"50"];
        [self.title constrainTrailingSpaceToView:self.follow predicate:@"15"];

        self.title.font = [UIFont sansSerifFontWithSize:14.0f];

        [self.follow constrainWidth:@"50" height:@"50"];
        [self.follow alignTrailingEdgeWithView:self predicate:@"-15"];
        [self.follow alignCenterYWithView:self predicate:@"0"];

        self.follow.contentMode = UIViewContentModeCenter;

        self.selectionStyle = UITableViewCellSelectionStyleNone;
    }

    return self;
}

- (void)prepareForReuse
{
    _thumbnail.image = nil;
    _title.text = nil;
    _follow.image = nil;
}

- (void)updateConstraints
{
    [super updateConstraints];
}
@end
