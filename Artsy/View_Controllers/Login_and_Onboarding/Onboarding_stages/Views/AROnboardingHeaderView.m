#import "AROnboardingHeaderView.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingHeaderView ()

@property (nonatomic, strong) UIView *progressBar;
@property (nonatomic, strong) UIView *progressBackgroundBar;
@property (nonatomic, strong) UILabel *titleLabel;

@end


@implementation AROnboardingHeaderView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _progressBar = [[UIView alloc] init];
        _progressBackgroundBar = [[UIView alloc] init];
        _titleLabel = [[UILabel alloc] init];
        _searchField = [[AROnboardingSearchField alloc] init];
    }

    return self;
}

- (void)setupHeaderViewWithTitle:(NSString *)title andProgress:(CGFloat)progress
{
    self.progressBackgroundBar.backgroundColor = [UIColor artsyGrayMedium];
    [self addSubview:self.progressBackgroundBar];

    [self.progressBackgroundBar constrainHeight:@"5"];
    [self.progressBackgroundBar constrainWidthToView:self predicate:@"0"];
    [self.progressBackgroundBar alignTopEdgeWithView:self predicate:@"0"];
    [self.progressBackgroundBar alignLeadingEdgeWithView:self predicate:@"0"];

    self.progressBar.backgroundColor = [UIColor blackColor];
    [self addSubview:self.progressBar];

    NSString *progressWidth = [NSString stringWithFormat:@"*.%1.0f", progress * 100];

    [self.progressBar constrainHeight:@"5"];
    [self.progressBar constrainWidthToView:self predicate:progressWidth];
    [self.progressBar alignTopEdgeWithView:self predicate:@"0"];
    [self.progressBar alignLeadingEdgeWithView:self predicate:@"0"];

    self.titleLabel.textColor = [UIColor blackColor];
    self.titleLabel.font = [UIFont serifFontWithSize:30.0];
    self.titleLabel.text = title;
    self.titleLabel.numberOfLines = 0;
    [self addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self predicate:@"-40"];
    [self.titleLabel alignLeadingEdgeWithView:self predicate:@"20"];
    [self.titleLabel constrainTopSpaceToView:self.progressBar predicate:@"30"];
    [self.titleLabel constrainHeight:@"80"];

    [self addSubview:self.searchField];

    [self.searchField constrainHeight:@"40"];
    [self.searchField constrainTopSpaceToView:self.titleLabel predicate:@"20"];
    [self.searchField alignLeadingEdgeWithView:self predicate:@"20"];
    [self.searchField alignTrailingEdgeWithView:self predicate:@"-20"];
    self.searchField.tintColor = [UIColor blackColor];
}


@end
