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
    
    UIButton *appleSignInButton = [[UIButton alloc] init];
    UIImage *appleImage = [UIImage imageNamed:@"apple-login"];
    [appleSignInButton setImage:appleImage forState:UIControlStateNormal];

    [containerView addSubview:appleSignInButton];
    
    [appleSignInButton alignLeadingEdgeWithView:containerView predicate:@"0"];
    [appleSignInButton alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:titleLabel predicate:@"8"];
    [appleSignInButton constrainWidth:@"50"];
    [appleSignInButton constrainHeight:@"50"];
    
    UIButton *facebookSignInButton = [[UIButton alloc] init];
    UIImage *facebookImage = [UIImage imageNamed:@"facebook-login"];
    [facebookSignInButton setImage:facebookImage forState:UIControlStateNormal];

    [containerView addSubview:facebookSignInButton];

    [facebookSignInButton alignAttribute:NSLayoutAttributeLeading toAttribute:NSLayoutAttributeTrailing ofView:appleSignInButton predicate:@"12"];
    [facebookSignInButton alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:titleLabel predicate:@"8"];
    [facebookSignInButton constrainWidth:@"50"];
    [facebookSignInButton constrainHeight:@"50"];

    [self.actionButton addSubview:containerView];
    
    [containerView alignCenterWithView:self.actionButton];
    [containerView constrainWidth:@"112"];
    [containerView constrainHeightToView:self.actionButton predicate:@"0"];
    
    [titleLabel constrainHeightToView:containerView predicate:@"0"];
    [titleLabel constrainWidthToView:containerView predicate:@"0"];
    
    containerView.userInteractionEnabled = NO;
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
