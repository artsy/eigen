#import "AROnboardingNavigationItemsView.h"
#import "ARButtonSubclasses.h"
#import "UIColor+ArtsyColors.h"
#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface AROnboardingNavigationItemsView ()

@property (nonatomic) ARWhiteFlatButton *back;
@property (nonatomic) ARWhiteFlatButton *next;
@property (nonatomic) UILabel *warningLabel;

@end


@implementation AROnboardingNavigationItemsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        //self.backgroundColor = [UIColor whiteColor];

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
        [_back constrainHeightToView:self predicate:@"0"];

        [_next alignBottomEdgeWithView:self predicate:@"0"];
        [_next alignTrailingEdgeWithView:self predicate:@"0"];
        [_next constrainWidthToView:self predicate:@"*.5"];
        [_next constrainHeightToView:self predicate:@"0"];

        _warningLabel = [[UILabel alloc] init];
        _warningLabel.backgroundColor = [UIColor artsyYellowMedium];
        _warningLabel.textColor = [UIColor blackColor];
        _warningLabel.font = [UIFont serifFontWithSize:14.0];
        _warningLabel.hidden = YES;

        [self addSubview:_warningLabel];

        [_warningLabel constrainWidthToView:self predicate:@"0"];
        [_warningLabel constrainHeight:@"30"];
        [_warningLabel alignLeadingEdgeWithView:self predicate:@"0"];
        [_warningLabel constrainBottomSpaceToView:_back predicate:@"0"];
    }

    return self;
}

- (void)disableNextStep
{
    self.next.titleLabel.textColor = [UIColor artsyGrayMedium];
}

- (void)enableNextStep
{
    self.next.titleLabel.textColor = [UIColor blackColor];
}

- (void)showWarning:(NSString *)text
{
    self.warningLabel.text = text;
    self.warningLabel.hidden = NO;
}

- (void)hideWarning
{
    self.warningLabel.hidden = YES;
}

@end
