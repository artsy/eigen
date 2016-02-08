#import "ARSerifNavigationViewController.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import "ARTopMenuViewController.h"


@interface ARSerifNavigationBar : UINavigationBar
@end


@interface ARSerifNavigationViewController () <UINavigationControllerDelegate>
@property (nonatomic, strong) UIBarButtonItem *exitButton;
@property (nonatomic, strong) UIBarButtonItem *backButton;
@property (nonatomic, assign) BOOL oldStatusBarHiddenStatus;
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

    self.edgesForExtendedLayout = UIRectEdgeNone;

    UIButton *exit = [[ARCircularActionButton alloc] initWithImageName:nil];
    UIImage *image = [[UIImage imageNamed:@"CloseButtonLargeHighlighted"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    exit.frame = CGRectMake(0, 0, 40, 40);
    exit.layer.cornerRadius = 40 * .5f;

    [exit setImage:image forState:UIControlStateNormal];
    [exit addTarget:self action:@selector(closeModal) forControlEvents:UIControlEventTouchUpInside];
    self.exitButton = [[UIBarButtonItem alloc] initWithCustomView:exit];

    UIButton *back = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 40, 40)];
    image = [[UIImage imageNamed:@"BackArrow_Highlighted"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    [back setImage:image forState:UIControlStateNormal];
    [back addTarget:self action:@selector(popViewControllerAnimated:) forControlEvents:UIControlEventTouchUpInside];
    self.backButton = [[UIBarButtonItem alloc] initWithCustomView:back];

    [self setViewControllers:@[ rootViewController ]];
    [self.navigationBar.topItem setRightBarButtonItem:self.exitButton];
    self.delegate = self;
    return self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    UIApplication *app = [UIApplication sharedApplication];
    self.oldStatusBarHiddenStatus = app.statusBarHidden;
    [app setStatusBarHidden:YES withAnimation:UIStatusBarAnimationNone];

    if ([UIDevice isPad]) {
        self.view.layer.cornerRadius = 0;
        self.view.superview.layer.cornerRadius = 0;
    }
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];

    UIApplication *app = [UIApplication sharedApplication];
    [app setStatusBarHidden:app.statusBarHidden withAnimation:UIStatusBarAnimationNone];
}

+ (void)setupAppearance
{
    UINavigationBar *nav = [UINavigationBar appearanceWhenContainedIn:self.class, nil];
    [nav setBarTintColor:UIColor.whiteColor];
    [nav setTintColor:UIColor.blackColor];
    [nav setTitleTextAttributes:@{
        NSForegroundColorAttributeName : UIColor.blackColor,
        NSFontAttributeName : [UIFont serifFontWithSize:20]
    }];
    [nav setTitleVerticalPositionAdjustment:-8 forBarMetrics:UIBarMetricsDefault];
}

- (void)closeModal
{
    [self.presentingViewController dismissViewControllerAnimated:self completion:nil];
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    viewController.navigationItem.hidesBackButton = YES;
    viewController.navigationItem.rightBarButtonItem = self.exitButton;

    if (navigationController.viewControllers.count > 1) {
        viewController.navigationItem.leftBarButtonItem = self.backButton;
    }
}

- (BOOL)wantsFullScreenLayout
{
    return YES;
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
    self.backgroundColor = [UIColor whiteColor];

    return self;
}

- (CGSize)sizeThatFits:(CGSize)size
{
    size.height = 60;
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

@end
