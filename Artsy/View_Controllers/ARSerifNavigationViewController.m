#import "ARSerifNavigationViewController.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"


@interface ARSerifNavigationBar : UINavigationBar
@end


@interface ARSerifNavigationViewController ()

@end


@implementation ARSerifNavigationViewController

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
{
    static dispatch_once_t dispatchOnceLocker = 0;
    dispatch_once(&dispatchOnceLocker, ^{
        [ARSerifNavigationViewController setupAppearance];
    });

    self = [super initWithNavigationBarClass:ARSerifNavigationBar.class toolbarClass:nil];
    if (!self) {
        return nil;
    }

    [self setViewControllers:@[ rootViewController ]];
    return self;
}

+ (void)setupAppearance
{
    // Buttons
    UIBarButtonItem *buttons = [UIBarButtonItem appearanceWhenContainedIn:self.class, nil];
    UINavigationBar *nav = [UINavigationBar appearanceWhenContainedIn:self.class, nil];

    [nav setBarTintColor:UIColor.whiteColor];
    [nav setTintColor:UIColor.blackColor];
    [nav setTitleTextAttributes:@{
        NSForegroundColorAttributeName : UIColor.blackColor,
        NSFontAttributeName : [UIFont serifFontWithSize:20]
    }];

    [buttons setBackgroundVerticalPositionAdjustment:-15 forBarMetrics:UIBarMetricsDefault];
}

- (BOOL)definesPresentationContext
{
    return YES;
}

- (UIModalPresentationStyle)modalPresentationStyle
{
    return [UIDevice isPad] ? UIModalPresentationFormSheet : UIModalPresentationFullScreen;
}

@end


@implementation ARSerifNavigationBar

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) return nil;

    self.translucent = NO;
    [self removeNavigationBarShadow];
    [self tintColorDidChange];

    return self;
}

- (void)removeNavigationBarShadow
{
    // Removes a single line from the nav bar.

    for (UIView *view in self.subviews) {
        for (UIView *view2 in view.subviews) {
            if ([view2 isKindOfClass:[UIImageView class]] && view2.frame.size.height < 2) {
                [view2 removeFromSuperview];
                return;
            }
        }
    }
}

- (CGSize)sizeThatFits:(CGSize)size
{
    size.height = 64;
    size.width = self.superview.bounds.size.width;
    return size;
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    if (self.topItem) {
        [self verticallyCenterView:self.topItem.titleView];
        [self verticallyCenterView:self.topItem.leftBarButtonItems];
        [self verticallyCenterView:self.topItem.rightBarButtonItems];
    }
}

- (void)verticallyCenterView:(id)viewOrArray
{
    if ([viewOrArray isKindOfClass:[UIView class]]) {
        [self center:viewOrArray];

    } else {
        for (UIBarButtonItem *button in viewOrArray) {
            [self center:button.customView];
        }
    }
}

- (void)center:(UIView *)viewToCenter
{
    CGFloat barMidpoint = roundf(self.frame.size.height / 2);
    CGFloat viewMidpoint = roundf(viewToCenter.frame.size.height / 2);

    CGRect newFrame = viewToCenter.frame;
    newFrame.origin.y = roundf(barMidpoint - viewMidpoint);
    viewToCenter.frame = newFrame;
}

- (void)addSubview:(UIView *)view
{
    [super addSubview:view];

    // This fixes the custom back button background not showing
    // http://stackoverflow.com/questions/18824887/ios-7-custom-back-button/19452709#19452709
    [view setNeedsDisplay];
}

@end
