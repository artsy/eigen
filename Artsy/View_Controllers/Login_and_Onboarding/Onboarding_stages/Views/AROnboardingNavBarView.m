#import "AROnboardingNavBarView.h"

#import "ARFonts.h"

#import "UIDevice-Hardware.h"

#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@implementation AROnboardingNavBarView

- (instancetype)init
{
    self = [super init];
    if (self) {
        // back
        _back = [[UIButton alloc] initWithFrame:CGRectZero];
        self.back.backgroundColor = [UIColor clearColor];
        [self.back setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
        [self.back setImage:[UIImage imageNamed:@"BackArrow_Highlighted"] forState:UIControlStateHighlighted];

        self.back.contentEdgeInsets = UIEdgeInsetsMake(0, 12, 0, 12);

        [self addSubview:self.back];
        [self.back alignCenterYWithView:self predicate:@"0"];
        [self.back alignLeadingEdgeWithView:self predicate:[UIDevice isPad] ? @"22" : @"0"];

        // title
        _title = [[UILabel alloc] initWithFrame:CGRectZero];
        self.title.backgroundColor = [UIColor clearColor];
        self.title.font = [UIFont serifFontWithSize:20];
        self.title.textAlignment = NSTextAlignmentCenter;
        self.title.textColor = [UIColor whiteColor];

        [self addSubview:self.title];
        [self.title alignCenterWithView:self];

        // forward
        _forward = [[ARUppercaseButton alloc] initWithFrame:CGRectZero];
        [self.forward setEnabled:NO animated:NO];
        self.forward.titleLabel.font = [UIFont sansSerifFontWithSize:14];
        self.forward.titleLabel.textAlignment = NSTextAlignmentCenter;
        [self.forward setTitleColor:[UIColor artsyGraySemibold] forState:UIControlStateDisabled];
        [self.forward setTitleColor:[UIColor artsyPurpleRegular] forState:UIControlStateHighlighted];

        self.forward.contentEdgeInsets = UIEdgeInsetsMake(0, 20, 0, 20);
        ;

        [self addSubview:self.forward];
        [self.forward alignCenterYWithView:self predicate:@"0"];
        [self.forward alignTrailingEdgeWithView:self predicate:[UIDevice isPad] ? @"-22" : @"0"];
        [self.forward constrainLeadingSpaceToView:self.title predicate:@">=0"];

        [self.back constrainHeight:@"44"];
        [self.forward constrainHeightToView:self.back predicate:@"0"];
        [self constrainHeightToView:self.back predicate:[UIDevice isPad] ? @"*2" : @"0"];
    }

    return self;
}

- (void)didMoveToSuperview
{
    if (self.superview) {
        [self alignLeading:@"0" trailing:@"0" toView:self.superview];
        [self alignTopEdgeWithView:self.superview predicate:@"0"];
    }
}

@end
