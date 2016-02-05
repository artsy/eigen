#import "ARSerifNavigationViewController.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"


@interface ARSerifNavigationViewController ()

@end


@implementation ARSerifNavigationViewController

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
{
    static dispatch_once_t dispatchOnceLocker = 0;
    dispatch_once(&dispatchOnceLocker, ^{
        [ARSerifNavigationViewController setupAppearance];
    });


    return [super initWithRootViewController:rootViewController];
}

+ (void)setupAppearance
{
    UIBarButtonItem *appearance = [UIBarButtonItem appearanceWhenContainedIn:self.class, nil];

    [appearance setBackgroundVerticalPositionAdjustment:-15 forBarMetrics:UIBarMetricsDefault];
    [appearance setTitleTextAttributes:@{
        NSForegroundColorAttributeName : [UIColor artsyHeavyGrey],
        NSFontAttributeName : [UIFont sansSerifFontWithSize:16]

    } forState:UIControlStateNormal & UIControlStateHighlighted & UIControlStateDisabled];

    UIImage *backImage = [UIImage imageNamed:@""];
    [appearance setBackButtonBackgroundImage:backImage forState:UIControlStateNormal barMetrics:UIBarMetricsDefault];
    [appearance setBackgroundImage:backImage forState:UIControlStateNormal barMetrics:UIBarMetricsDefault];
}

- (BOOL)definesPresentationContext
{
    return YES;
}

- (UIModalPresentationStyle)modalPresentationStyle
{
    return [UIDevice isPad] ? UIModalPresentationFormSheet : UIModalPresentationFullScreen;
}

- (void)didMoveToParentViewController:(nullable UIViewController *)parent
{
    [super didMoveToParentViewController:parent];
}

@end
