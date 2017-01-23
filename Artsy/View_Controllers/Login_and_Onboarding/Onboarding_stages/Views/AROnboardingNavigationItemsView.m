#import "AROnboardingNavigationItemsView.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingNavigationItemsView ()

@property (nonatomic, strong) UILabel *warningLabel;
@property (nonatomic, strong) NSLayoutConstraint *warningLabelHeightConstraint;
@property (nonatomic, strong) NSLayoutConstraint *selfHeightConstraint;
@property (nonatomic, strong) NSLayoutConstraint *nextWidthConstraintHalf;
@property (nonatomic, strong) NSLayoutConstraint *nextWidthConstraintFull;
@property (nonatomic, strong) UIView *separatorBorder;
@end


@implementation AROnboardingNavigationItemsView

- (instancetype)init
{
    self = [super init];
    if (self) {

        _back = [[ARWhiteFlatButton alloc] init];
        [_back setTitle:@"Back" forState:UIControlStateNormal];
        
        _next = [[ARWhiteFlatButton alloc] init];
        [_next setTitle:@"Next" forState:UIControlStateNormal];
        
        UIView *topBorder = [[UIView alloc] init];
        _separatorBorder = [[UIView alloc] init];
        topBorder.backgroundColor = [UIColor artsyGrayRegular];
        _separatorBorder.backgroundColor = [UIColor artsyGrayRegular];
        
        [self addSubview:_back];
        [self addSubview:_next];
        [self addSubview:topBorder];
        [self addSubview:_separatorBorder];
        
        [topBorder constrainHeight:@"0.5"];
        [topBorder constrainWidthToView:self predicate:@"0"];
        [topBorder alignTop:@"0" leading:@"0" toView:self];
        
        [_separatorBorder constrainWidth:@"0.5"];
        [_separatorBorder constrainHeightToView:self predicate:@"0"];
        [_separatorBorder alignCenterWithView:self];
        
        [_back alignBottomEdgeWithView:self predicate:@"0"];
        [_back alignLeadingEdgeWithView:self predicate:@"0"];
        [_back constrainWidthToView:self predicate:@"*.5"];
        [_back constrainHeight:@"50"];
        
        _back.hidden = YES;
        _separatorBorder.hidden = YES;
        
        [_next alignBottomEdgeWithView:self predicate:@"0"];
        [_next alignTrailingEdgeWithView:self predicate:@"0"];
        _nextWidthConstraintFull = [_next constrainWidthToView:self predicate:@"1"];
        _nextWidthConstraintHalf = [_next constrainWidthToView:self predicate:@"*.5"];
        _nextWidthConstraintHalf.active = NO;
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
        [_warningLabel constrainBottomSpaceToView:_next predicate:@"0"];

        self.selfHeightConstraint = [self constrainHeight:@"50"];
    }

    return self;
}

- (void)addBackButton
{
    self.back.hidden = NO;
    self.separatorBorder.hidden = NO;
    self.nextWidthConstraintFull.active = NO;
    self.nextWidthConstraintHalf.active = YES;
}

- (void)hideBackButton
{
    self.back.hidden = YES;
    self.separatorBorder.hidden = YES;
    self.nextWidthConstraintHalf.active = NO;
    self.nextWidthConstraintFull.active = YES;
}

- (void)disableNextStep
{
    [self.next setTitleColor:[UIColor artsyGrayMedium] forState:UIControlStateNormal];
}

- (void)enableNextStep
{
    [self.next setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self.next setBackgroundColor:[UIColor blackColor] forState:UIControlStateNormal];
    
    [self.next setTitleColor:[UIColor blackColor] forState:UIControlStateHighlighted];
    [self.next setBackgroundColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
}

- (void)defaultNextStep
{
    [self.next setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [self.next setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal];
    
    [self.next setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    [self.next setBackgroundColor:[UIColor blackColor] forState:UIControlStateHighlighted];
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
