#import "AROnboardingHeaderView.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingHeaderView ()


@property (nonatomic, strong) UILabel *titleLabel;

@property (nonatomic, strong) NSLayoutConstraint *searchHeightConstraint;

@end


@implementation AROnboardingHeaderView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _titleLabel = [[UILabel alloc] init];
        _searchField = [[AROnboardingSearchField alloc] init];
    }

    return self;
}

- (void)setupHeaderViewWithTitle:(NSString *)title
{
    self.titleLabel.textColor = [UIColor blackColor];
    self.titleLabel.font = [UIFont serifFontWithSize:30.0];
    self.titleLabel.text = title;
    self.titleLabel.numberOfLines = 0;
    [self addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self predicate:@"-40"];
    [self.titleLabel alignLeadingEdgeWithView:self predicate:@"15"];
    [self.titleLabel alignTopEdgeWithView:self predicate:@"35"];
    [self.titleLabel constrainHeight:@"80"];

    [self addSubview:self.searchField];

    self.searchHeightConstraint = [self.searchField constrainHeight:@"40"];
    [self.searchField constrainTopSpaceToView:self.titleLabel predicate:@"20"];
    [self.searchField alignLeadingEdgeWithView:self predicate:@"15"];
    [self.searchField alignTrailingEdgeWithView:self predicate:@"-15"];
    self.searchField.tintColor = [UIColor blackColor];
}

- (void)hideSearchBar
{
    self.searchHeightConstraint.constant = 0;
}

@end
