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
        _appleButton = [[UIButton alloc] init];
        _facebookButton = [[UIButton alloc] init];
    }

    return self;
}

- (void)setupForThirdPartyLoginsWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    
    NSString *titleString = @"Or sign in with:";
    
    NSMutableAttributedString *attributedTitle = [[NSMutableAttributedString alloc] initWithString:titleString attributes: @{NSForegroundColorAttributeName : [UIColor artsyGraySemibold], NSFontAttributeName : [UIFont displaySansSerifFontWithSize: 14.0]}];
    
    UIView *containerView = [[UIView alloc] init];

    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.attributedText = attributedTitle;
    titleLabel.textAlignment = NSTextAlignmentCenter;
    
    [containerView addSubview:titleLabel];
    
    UIImage *appleImage = [UIImage imageNamed:@"apple-login"];
    [self.appleButton setImage:appleImage forState:UIControlStateNormal];

    [containerView addSubview:self.appleButton];
    
    [self.appleButton alignLeadingEdgeWithView:containerView predicate:@"0"];
    [self.appleButton alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:titleLabel predicate:@"8"];
    [self.appleButton constrainWidth:@"50"];
    [self.appleButton constrainHeight:@"50"];
    [self.appleButton alignBottomEdgeWithView:containerView predicate:@"0"];
    
    UIImage *facebookImage = [UIImage imageNamed:@"facebook-login"];
    [self.facebookButton setImage:facebookImage forState:UIControlStateNormal];

    [containerView addSubview:self.facebookButton];

    [self.facebookButton alignAttribute:NSLayoutAttributeLeading toAttribute:NSLayoutAttributeTrailing ofView:self.appleButton predicate:@"12"];
    [self.facebookButton alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:titleLabel predicate:@"8"];
    [self.facebookButton constrainWidth:@"50"];
    [self.facebookButton constrainHeight:@"50"];
    [self.facebookButton alignBottomEdgeWithView:containerView predicate:@"0"];
    [self.facebookButton alignTrailingEdgeWithView:containerView predicate:@"0"];

    [self addSubview:containerView];
    
    [containerView alignCenterWithView:self];
    [containerView alignBottomEdgeWithView:self predicate:@"0"];
    
    [titleLabel alignTopEdgeWithView:containerView predicate:@"0"];
    [titleLabel constrainWidthToView:containerView predicate:@"0"];
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
