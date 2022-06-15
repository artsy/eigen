#import "ARButtonSubclasses.h"

#import "UIColor+ArtsyColors.h"

#if __has_include(<UIView+BooleanAnimations/UIView+BooleanAnimations.h>)
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#endif

#if __has_include(<UIView_BooleanAnimations/UIView+BooleanAnimations.h>)
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#endif

#import "UIFont+ArtsyFonts.h"

const CGFloat ARButtonAnimationDuration = 0.15;

@implementation ARButton

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) { return nil; }

    [self setup];

    return self;
}

- (void)awakeFromNib
{
    [super awakeFromNib];
    [self setup];
}

- (void)setEnabled:(BOOL)enabled
{
    [self setEnabled:enabled animated:self.shouldAnimateStateChange];
}

- (void)setEnabled:(BOOL)enabled animated:(BOOL)animated
{
    [super setEnabled:enabled];
    if (!self.shouldDimWhenDisabled) { return; }
    CGFloat alpha = enabled ? 1 : 0.1;
    [UIView animateIf:animated duration:ARButtonAnimationDuration :^{
        self.alpha = alpha;
    }];
}

- (void)setup
{
    self.shouldDimWhenDisabled = YES;
    self.shouldAnimateStateChange = YES;
}

@end


@interface ARFlatButton ()
@property (nonatomic, strong) NSMutableDictionary *backgroundColors;
@property (nonatomic, strong) NSMutableDictionary *borderColors;
@end

@implementation ARFlatButton

- (id)init
{
    return [self initWithFrame:CGRectZero];
}

- (void)setup
{
    [super setup];
    self.backgroundColors = [NSMutableDictionary dictionary];
    self.borderColors = [NSMutableDictionary dictionary];

    self.titleLabel.font = [UIFont sansSerifFontWithSize:12];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.titleLabel attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterX multiplier:1 constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:self.titleLabel attribute:NSLayoutAttributeCenterY relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeCenterY multiplier:1 constant:0]];

    CALayer *layer = [self layer];
    [layer setMasksToBounds: YES];
    [layer setCornerRadius: 2.0];
    [layer setBorderWidth: 1.0];
}

- (void)setBackgroundColor:(UIColor *)backgroundColor forState:(UIControlState)state
{
    [self setBackgroundColor:backgroundColor forState:state animated:self.shouldAnimateStateChange];
}

- (void)setBorderColor:(UIColor *)borderColor forState:(UIControlState)state
{
    [self setBorderColor:borderColor forState:state animated:self.shouldAnimateStateChange];

}

- (void)setBackgroundColor:(UIColor *)backgroundColor forState:(UIControlState)state animated:(BOOL)animated
{
    [self.backgroundColors setObject:backgroundColor forKey:@(state)];
    if (state == self.state) {
        [self changeColorsForStateChangeAnimated:animated];
    }
}

- (void)setBorderColor:(UIColor *)borderColor forState:(UIControlState)state animated:(BOOL)animated
{
    [self.borderColors setObject:borderColor forKey:@(state)];
    if (state == self.state) {
        [self changeColorsForStateChangeAnimated:animated];
    }
}

- (void)setSelected:(BOOL)selected
{
    [self setSelected:selected animated:self.shouldAnimateStateChange];
}

- (void)setHighlighted:(BOOL)highlighted
{
    [self setHighlighted:highlighted animated:self.shouldAnimateStateChange];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected];
    [self changeColorsForStateChangeAnimated:(BOOL)animated];
}

- (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated
{
    [super setHighlighted:highlighted];
    [self changeColorsForStateChangeAnimated:animated];
}

- (void)setEnabled:(BOOL)enabled animated:(BOOL)animated
{
    [super setEnabled:enabled animated:animated];
    [self changeColorsForStateChangeAnimated:animated];
}

- (void)changeColorsForStateChangeAnimated:(BOOL)animated
{
    [self changeBackgroundColorForStateChangeAnimated:animated];
    [self changeBorderColorForStateChangeAnimated:animated];
}

- (void)changeBackgroundColorForStateChangeAnimated:(BOOL)animated{
    [self changeBackgroundColorForStateChangeAnimated:animated layer:self.layer];
}

- (void)changeBorderColorForStateChangeAnimated:(BOOL)animated{
    [self changeBorderColorForStateChangeAnimated:animated layer:self.layer];
}

- (void)changeBackgroundColorForStateChangeAnimated:(BOOL)animated layer:(CALayer *)layer
{
    if (!layer.backgroundColor) {
        layer.backgroundColor = [UIColor clearColor].CGColor;
    }

    UIColor *newBackgroundColor = [self.backgroundColors objectForKey:@(self.state)] ?: [self.backgroundColors objectForKey:@(UIControlStateNormal)];
    if (newBackgroundColor && newBackgroundColor.CGColor != layer.backgroundColor) {
        if (animated) {
            [self animateLayer:layer fromColor:layer.backgroundColor toColor:newBackgroundColor.CGColor forKey:@"backgroundColor"];
        }
        layer.backgroundColor = newBackgroundColor.CGColor;
    };
}

- (void)changeBorderColorForStateChangeAnimated:(BOOL)animated  layer:(CALayer *)layer
{
    if (!layer.borderColor) {
        layer.borderColor = [UIColor clearColor].CGColor;
    }

    UIColor *newBorderColor = [self.borderColors objectForKey:@(self.state)] ?: [self.borderColors objectForKey:@(UIControlStateNormal)];
    if (newBorderColor && newBorderColor.CGColor != layer.borderColor) {
        if (animated) {
            [self animateLayer:layer fromColor:layer.borderColor toColor:newBorderColor.CGColor forKey:@"borderColor"];

        }
        layer.borderColor = newBorderColor.CGColor;
    };
}

- (void)animateLayer:(CALayer *)layer fromColor:(CGColorRef)fromColor toColor:(CGColorRef)toColor forKey:(NSString *)key
{
    CABasicAnimation *fade = [CABasicAnimation animation];
    fade.fromValue = (__bridge id)(fromColor);
    fade.toValue = (__bridge id)(toColor);
    fade.duration = ARButtonAnimationDuration;
    [layer addAnimation:fade forKey:key];
}

@end

@interface ARMenuButton()
@property(nonatomic, strong, readonly) CALayer *backgroundLayer;
@end

@implementation ARMenuButton

- (void)setup
{
    [super setup];
    self.layer.backgroundColor = [UIColor clearColor].CGColor;

    _backgroundLayer = [CALayer layer];
    _backgroundLayer.masksToBounds = YES;
    _backgroundLayer.bounds = self.layer.bounds;

    [self setBorderColor:[UIColor whiteColor] forState:UIControlStateNormal animated:NO];
    [self setBackgroundColor:[UIColor blackColor] forState:UIControlStateNormal animated:NO];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];

    [self.layer insertSublayer:_backgroundLayer atIndex:0];
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    CGFloat borderWidth = self.layer.borderWidth;
    CGFloat width = CGRectGetWidth(self.layer.bounds);
    CGFloat height = CGRectGetHeight(self.layer.bounds);
    CGFloat smallestDimension = MIN(width, height);
    self.layer.cornerRadius = smallestDimension / 2.0;

    CGRect insetRect = CGRectInset(self.layer.bounds, borderWidth, borderWidth);
    self.backgroundLayer.frame = insetRect;
    self.backgroundLayer.cornerRadius = self.layer.cornerRadius - borderWidth;

    [self bringSubviewToFront:self.imageView];
    [self bringSubviewToFront:self.titleLabel];
}

- (void)changeBackgroundColorForStateChangeAnimated:(BOOL)animated{
    [self changeBackgroundColorForStateChangeAnimated:animated layer:self.backgroundLayer];
}


- (CGSize)intrinsicContentSize
{
    return (CGSize){ 40, 40 };
}

@end

@implementation  ARClearFlatButton

- (void)setup
{
    [super setup];

    self.layer.borderWidth = 2;

    [self setBackgroundColor:[UIColor clearColor] forState:UIControlStateNormal animated:NO];
    [self setBorderColor:[UIColor whiteColor] forState:UIControlStateNormal animated:NO];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];

    [self setBackgroundColor:[UIColor artsyPurpleRegular] forState:UIControlStateHighlighted animated:NO];
    [self setBorderColor:[UIColor artsyPurpleRegular] forState:UIControlStateHighlighted animated:NO];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ 280, 44 };
}

@end


@implementation  ARWhiteFlatButton

- (void)setup
{
    [super setup];

    [self setBackgroundColor:[UIColor whiteColor] forState:UIControlStateNormal animated:NO];
    [self setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];

    [self setBackgroundColor:[UIColor blackColor] forState:UIControlStateHighlighted animated:NO];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];

    self.layer.borderWidth = 0;
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ 280, 44 };
}

@end



@implementation ARBlackFlatButton

- (void)setup
{
    [super setup];

    self.titleLabel.font = [UIFont sansSerifFontWithSize:15];
    self.layer.borderWidth = 0;

    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];

    [self setBackgroundColor:[UIColor blackColor] forState:UIControlStateNormal animated:NO];
    [self setBackgroundColor:[UIColor artsyPurpleRegular] forState:UIControlStateHighlighted animated:NO];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ 280, 46 };
}

@end
