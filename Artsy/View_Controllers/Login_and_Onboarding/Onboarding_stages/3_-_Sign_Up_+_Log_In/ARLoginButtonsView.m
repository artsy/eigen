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
    NSString *facebookLink = @"connect with Facebook";
    
    UIColor *facebookBlue = [UIColor colorWithRed:60.0 / 225.0 green:89.0 / 225.0 blue:155.0 / 255.0 alpha:1.0];
    
    NSMutableAttributedString *attributedTitle = [[NSMutableAttributedString alloc] initWithString:titleString attributes: @{NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];
    
    NSAttributedString *facebookPart = [[NSAttributedString alloc] initWithString:facebookLink attributes:@{NSUnderlineStyleAttributeName : @(NSUnderlineStyleSingle), NSForegroundColorAttributeName : facebookBlue, NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0]}];
    
    [attributedTitle appendAttributedString:facebookPart];
    
    [self.actionButton setAttributedTitle:attributedTitle forState:UIControlStateNormal];
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
