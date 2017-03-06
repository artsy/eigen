#import "ARLoginButtonsView.h"
#import "ARButtonSubclasses.h"
#import "UIColor+ArtsyColors.h"
#import "Artsy+UILabels.h"
#import "UIFont+ArtsyFonts.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARLoginButtonsView ()


@end


@implementation ARLoginButtonsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _actionButton = [[UIButton alloc] init];
    }

    return self;
}

- (void)setupForFacebookWithLargeLayout:(BOOL)useLargeLayout
{

    [self commonSetupWithLargeLayout:useLargeLayout];
    
    NSString *titleString = @"You can also ";
    NSString *facebookLink = @"CONNECT WITH FACEBOOK";
    
    UIColor *facebookBlue = [UIColor colorWithRed:60.0 / 225.0 green:89.0 / 225.0 blue:155.0 / 255.0 alpha:1.0];
    
    NSMutableAttributedString *attributedTitle = [[NSMutableAttributedString alloc] initWithString:titleString attributes: @{NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];
    
    NSAttributedString *facebookPart = [[NSAttributedString alloc] initWithString:facebookLink attributes:@{NSForegroundColorAttributeName : [UIColor whiteColor], NSFontAttributeName : [UIFont sansSerifFontWithSize:useLargeLayout ? 16.0 : 12.0]}];

    UIView *tempView = [[UIView alloc] init];
    
    UILabel *firstbit = [[UILabel alloc] init];
    firstbit.attributedText = attributedTitle;
    firstbit.textAlignment = useLargeLayout ? NSTextAlignmentCenter : NSTextAlignmentLeft;
    
    UILabel *secondbit = [[UILabel alloc] init];
    secondbit.attributedText = facebookPart;
    secondbit.textAlignment = NSTextAlignmentCenter;
    secondbit.layer.cornerRadius = useLargeLayout ? 20 : 17;
    secondbit.layer.backgroundColor = facebookBlue.CGColor;
    
    [tempView addSubview:firstbit];
    [tempView addSubview:secondbit];

    [self.actionButton addSubview:tempView];
    
    if (useLargeLayout) {
        [tempView alignCenterWithView:self.actionButton];
    } else {
        [tempView alignTop:@"0" leading:@"0" toView:self.actionButton];
    }
    [tempView constrainWidth:useLargeLayout ? @"400" : @"300"];
    [tempView constrainHeightToView:self.actionButton predicate:@"0"];
    
    [firstbit constrainWidth:useLargeLayout? @"140" : @"100"];
    [firstbit constrainHeightToView:tempView predicate:@"0"];
    
    [secondbit constrainWidth:useLargeLayout? @"260" : @"200"];
    [secondbit constrainHeightToView:tempView predicate:useLargeLayout ? @"0" : @"-6"];
    
    [firstbit constrainTrailingSpaceToView:secondbit predicate:@"0"];
    [firstbit alignTop:@"0" leading:@"0" toView:tempView];
    [secondbit alignTopEdgeWithView:tempView predicate:@"0"];
    
    tempView.userInteractionEnabled = NO;
}

- (void)setupForLoginWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    
    NSString *titleString = @"Forgot password";
        NSAttributedString *attributedTitle = [[NSAttributedString alloc] initWithString:titleString attributes:@{NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle), NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];

    [self.actionButton setAttributedTitle:attributedTitle forState:UIControlStateNormal];
}

- (void)setupForSignUpWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    
    NSString *titleString = @"Already have an account? ";
    NSString *backLink = @"Go back";
    
    NSMutableAttributedString *attributedTitle = [[NSMutableAttributedString alloc] initWithString:titleString attributes: @{NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];
    
    NSAttributedString *linkPart = [[NSAttributedString alloc] initWithString:backLink attributes:@{NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle), NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];
    
    [attributedTitle appendAttributedString:linkPart];
    
    [self.actionButton setAttributedTitle:attributedTitle forState:UIControlStateNormal];
}


- (void)commonSetupWithLargeLayout:(BOOL)useLargeLayout
{
    [self addSubview:self.actionButton];

    self.actionButton.titleLabel.font = [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0];
    
    [self.actionButton constrainWidthToView:self predicate:@"0"];
    [self.actionButton constrainHeight:@"40"];
    [self.actionButton alignLeadingEdgeWithView:self predicate:@"0"];
    [self.actionButton alignTopEdgeWithView:self predicate:@"0"];
}


@end
