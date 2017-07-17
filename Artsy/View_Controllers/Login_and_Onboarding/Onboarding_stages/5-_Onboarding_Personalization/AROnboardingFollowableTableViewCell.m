#import "AROnboardingFollowableTableViewCell.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingFollowableTableViewCell ()

@property (nonatomic, strong, readwrite) NSLayoutConstraint *imageWidthConstraint;
@property (nonatomic, strong, readwrite) UIView *separator;
@end


@implementation AROnboardingFollowableTableViewCell


- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        _thumbnail = [[UIImageView alloc] init];
        _title = [[ARSansSerifLabel alloc] init];
        _follow = [[UIImageView alloc] init];
        _separator = [[UIView alloc] init];

        [self addSubview:self.thumbnail];
        [self addSubview:self.title];
        [self addSubview:self.follow];
        [self addSubview:self.separator];

        [self.thumbnail alignLeadingEdgeWithView:self predicate:@"20"];
        self.imageWidthConstraint = [self.thumbnail constrainWidth:@"50"];
        [self.thumbnail constrainHeight:@"50"];
        [self.thumbnail alignCenterYWithView:self predicate:@"0"];

        self.thumbnail.clipsToBounds = YES;
        self.thumbnail.contentMode = UIViewContentModeScaleAspectFill;

        [self.title constrainLeadingSpaceToView:self.thumbnail predicate:@"10"];
        [self.title alignCenterYWithView:self predicate:@"0"];
        [self.title constrainHeight:@"50"];
        [self.title constrainTrailingSpaceToView:self.follow predicate:@"15"];

        self.title.font = [UIFont sansSerifFontWithSize:14.0f];

        [self.follow constrainWidth:@"26" height:@"26"];
        [self.follow alignTrailingEdgeWithView:self predicate:@"-20"];
        [self.follow alignCenterYWithView:self predicate:@"0"];

        self.follow.contentMode = UIViewContentModeCenter;

        self.selectionStyle = UITableViewCellSelectionStyleNone;

        self.separator.backgroundColor = [UIColor artsyGrayRegular];
        [self.separator constrainHeight:@"0.5"];
        [self.separator alignBottomEdgeWithView:self predicate:@"-1"];
        [self.separator alignLeading:@"20" trailing:@"-20" toView:self];
    }

    return self;
}

- (void)prepareForReuse
{
    [super prepareForReuse];
    
    _thumbnail.image = nil;
    _title.text = nil;
    _follow.image = nil;
}

- (void)prepareForBudgetUse
{
    self.imageWidthConstraint.constant = 0;
}

@end
