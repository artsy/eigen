#import "ARLoginButtonsView.h"
#import "ARButtonSubclasses.h"
#import "UIColor+ArtsyColors.h"
#import "Artsy+UILabels.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARLoginButtonsView ()

@property (nonatomic, strong) UIView *separatorLine;
@property (nonatomic, strong) ARSansSerifLabel *separatorLabel;

@end


@implementation ARLoginButtonsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _emailActionButton = [[ARBlackFlatButton alloc] init];
        _facebookActionButton = [[ARBlackFlatButton alloc] init];
        _twitterActionButton = [[ARBlackFlatButton alloc] init];
        _separatorLine = [[UIView alloc] init];
        _separatorLabel = [[ARSansSerifLabel alloc] init];
    }

    return self;
}

- (void)setupForLogin
{
    [self.emailActionButton setTitle:@"LOGIN" forState:UIControlStateNormal];
    [self commonSetup];

    [self.twitterActionButton setTitle:@"CONNECT WITH TWITTER" forState:UIControlStateNormal];
    [self.twitterActionButton setBackgroundColor:[UIColor colorWithRed:85.0 / 225.0 green:172.0 / 225.0 blue:238.0 / 255.0 alpha:1.0] forState:UIControlStateNormal];

    [self addSubview:self.twitterActionButton];

    [self.twitterActionButton constrainWidthToView:self predicate:@"0"];
    [self.twitterActionButton constrainHeight:@"40"];
    [self.twitterActionButton alignCenterXWithView:self predicate:@"0"];
    [self.twitterActionButton constrainTopSpaceToView:self.facebookActionButton predicate:@"10"];
}

- (void)setupForSignUp
{
    [self.emailActionButton setTitle:@"JOIN" forState:UIControlStateNormal];
    [self commonSetup];
}


- (void)commonSetup
{
    [self addSubview:self.emailActionButton];

    [self.emailActionButton constrainWidthToView:self predicate:@"0"];
    [self.emailActionButton constrainHeight:@"40"];
    [self.emailActionButton alignCenterXWithView:self predicate:@"0"];
    [self.emailActionButton alignTopEdgeWithView:self predicate:@"5"];

    self.separatorLine.backgroundColor = [UIColor artsyGrayRegular];
    [self addSubview:self.separatorLine];

    [self.separatorLine constrainHeight:@"0.5"];
    [self.separatorLine constrainWidthToView:self predicate:@"0"];
    [self.separatorLine alignCenterXWithView:self predicate:@"0"];
    [self.separatorLine constrainTopSpaceToView:self.emailActionButton predicate:@"50"];

    self.separatorLabel.text = @"OR";
    self.separatorLabel.backgroundColor = [UIColor whiteColor];
    self.separatorLabel.textAlignment = NSTextAlignmentCenter;
    [self addSubview:self.separatorLabel];

    [self.separatorLabel constrainWidth:@"60" height:@"20"];
    [self.separatorLabel alignCenterXWithView:self predicate:@"0"];
    [self.separatorLabel alignCenterYWithView:self.separatorLine predicate:@"0"];

    [self.facebookActionButton setTitle:@"CONNECT WITH FACEBOOK" forState:UIControlStateNormal];
    [self.facebookActionButton setBackgroundColor:[UIColor colorWithRed:60.0 / 225.0 green:89.0 / 225.0 blue:155.0 / 255.0 alpha:1.0] forState:UIControlStateNormal];

    [self addSubview:self.facebookActionButton];

    [self.facebookActionButton constrainWidthToView:self predicate:@"0"];
    [self.facebookActionButton constrainHeight:@"40"];
    [self.facebookActionButton alignCenterXWithView:self predicate:@"0"];
    [self.facebookActionButton constrainTopSpaceToView:self.separatorLine predicate:@"50"];
}

@end
