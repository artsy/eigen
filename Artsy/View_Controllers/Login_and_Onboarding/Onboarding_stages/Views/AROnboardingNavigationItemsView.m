#import "AROnboardingNavigationItemsView.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingNavigationItemsView ()

@property (nonatomic, strong) UILabel *warningLabel;
@property (nonatomic, strong) NSLayoutConstraint *warningLabelHeightConstraint;
@property (nonatomic, strong) NSLayoutConstraint *selfHeightConstraint;
@end


@implementation AROnboardingNavigationItemsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _back = [[ARWhiteFlatButton alloc] init];
        [_back setTitle:@"Back" forState:UIControlStateNormal];
        [_back setBorderColor:[UIColor artsyGrayRegular] forState:UIControlStateNormal];

        _next = [[ARWhiteFlatButton alloc] init];
        [_next setTitle:@"Next" forState:UIControlStateNormal];
        [_next setBorderColor:[UIColor artsyGrayRegular] forState:UIControlStateNormal];

        [self addSubview:_back];
        [self addSubview:_next];

        [_back alignBottomEdgeWithView:self predicate:@"0"];
        [_back alignLeadingEdgeWithView:self predicate:@"0"];
        [_back constrainWidthToView:self predicate:@"*.5"];
        [_back constrainHeight:@"50"];

        [_next alignBottomEdgeWithView:self predicate:@"0"];
        [_next alignTrailingEdgeWithView:self predicate:@"0"];
        [_next constrainWidthToView:self predicate:@"*.5"];
        [_next constrainHeight:@"50"];

        _warningLabel = [[UILabel alloc] init];
        _warningLabel.backgroundColor = [UIColor artsyYellowRegular];
        _warningLabel.textColor = [UIColor blackColor];
        _warningLabel.font = [UIFont serifFontWithSize:15.0];
        _warningLabel.textAlignment = NSTextAlignmentCenter;

        [self addSubview:_warningLabel];

        [_warningLabel constrainWidthToView:self predicate:@"0"];
        _warningLabelHeightConstraint = [_warningLabel constrainHeight:@"0"];
        [_warningLabel alignLeadingEdgeWithView:self predicate:@"0"];
        [_warningLabel constrainBottomSpaceToView:_back predicate:@"0"];

        self.selfHeightConstraint = [self constrainHeight:@"50"];
    }

    return self;
}

- (void)disableNextStep
{
    [self.next setTitleColor:[UIColor artsyGrayMedium] forState:UIControlStateNormal];
}

- (void)enableNextStep
{
    [self.next setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
}

- (void)showWarning:(NSString *)text
{
    self.warningLabel.text = text;
    self.selfHeightConstraint.constant = 80;
    self.warningLabelHeightConstraint.constant = 30;
}

- (void)hideWarning
{
    self.selfHeightConstraint.constant = 50;
    self.warningLabelHeightConstraint.constant = 0;
}

@end
