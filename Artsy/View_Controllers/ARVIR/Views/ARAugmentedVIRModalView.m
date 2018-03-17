#import "ARAugmentedVIRModalView.h"

#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

@implementation ARAugmentedVIRModalView

- (instancetype)initWithTitle:(NSString *)title delegate:(id <VIRModalDelegate>)delegate
{
    self = [super initWithFrame:CGRectMake(0, 0, 320, 480)];
    if (!self) {
        return nil;
    }

    _delegate = delegate;

    UIBlurEffect *blur = [UIBlurEffect effectWithStyle:UIBlurEffectStyleDark];
    UIVisualEffectView *blurView = [[UIVisualEffectView alloc] initWithEffect:blur];
    [self addSubview:blurView];
    [blurView alignToView:self];

    ARButton *allowAccessButton = [[ARWhiteFlatButton alloc] init];
    [allowAccessButton setTitle:@"TRY AGAIN" forState:UIControlStateNormal];
    [allowAccessButton addTarget:self.delegate action:@selector(hitRetry) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:allowAccessButton];

    UILabel *subtitle = [[UILabel alloc] init];
    subtitle.numberOfLines = 0;
    subtitle.font = [UIFont displaySansSerifFontWithSize:16];
    subtitle.backgroundColor = [UIColor clearColor];
    subtitle.textColor = [UIColor whiteColor];
    subtitle.text = title;
    subtitle.textAlignment = NSTextAlignmentCenter;
    [self addSubview:subtitle];

    // Align the button to the exact center of the view
    [allowAccessButton alignCenterWithView:self];
    [allowAccessButton constrainWidth:@"136"];

    // Push up subtitle from the button
    [subtitle constrainBottomSpaceToView:allowAccessButton predicate:@"-35"];
    [subtitle alignCenterXWithView:self predicate:@"0"];
    [subtitle alignLeading:@"40" trailing:@"-40" toView:self];

    return self;
}

- (void)hitRetry
{
    [self.delegate hitTryAgainFromModal:self];
}

@end
