#import "AROnboardingHeaderView.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingHeaderView ()

@property (nonatomic) UIView *progressBar;
@property (nonatomic) UIView *progressBackgroundBar;
@property (nonatomic) UILabel *titleLabel;

@end


@implementation AROnboardingHeaderView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _progressBar = [[UIView alloc] init];
        _progressBackgroundBar = [[UIView alloc] init];
        _titleLabel = [[UILabel alloc] init];
    }

    return self;
}

- (void)setup
{
    self.progressBackgroundBar.backgroundColor = [UIColor artsyGrayMedium];
    [self addSubview:self.progressBackgroundBar];

    [self.progressBackgroundBar constrainHeight:@"5"];
    [self.progressBackgroundBar constrainWidthToView:self predicate:@"0"];
    [self.progressBackgroundBar alignTopEdgeWithView:self predicate:@"0"];
    [self.progressBackgroundBar alignLeadingEdgeWithView:self predicate:@"0"];

    self.progressBar.backgroundColor = [UIColor blackColor];
    [self addSubview:self.progressBar];

    [self.progressBar constrainHeight:@"5"];
    [self.progressBar constrainWidthToView:self predicate:@"*.5"]; // percentage of completeness
    [self.progressBar alignTopEdgeWithView:self predicate:@"0"];
    [self.progressBar alignLeadingEdgeWithView:self predicate:@"0"];

    self.titleLabel.textColor = [UIColor blackColor];
    self.titleLabel.font = [UIFont serifFontWithSize:30.0];
    self.titleLabel.text = @"Follow artists that most interest you.";
    self.titleLabel.numberOfLines = 0;
    [self addSubview:self.titleLabel];

    [self.titleLabel constrainWidthToView:self predicate:@"-40"];
    [self.titleLabel alignLeadingEdgeWithView:self predicate:@"20"];
    [self.titleLabel constrainTopSpaceToView:self.progressBar predicate:@"30"];
    [self.titleLabel constrainHeight:@"80"];
}


@end
