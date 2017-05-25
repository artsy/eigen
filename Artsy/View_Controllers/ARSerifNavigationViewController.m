#import "ARSerifNavigationViewController.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"
#import "UIImage+ImageFromColor.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import "ARTopMenuViewController.h"
#import "ARSerifStatusMaintainer.h"
@import Artsy_UILabels;
@import ObjectiveSugar;


@interface ARSerifNavigationBar : UINavigationBar
/// Show/hides the underline from a navigation bar
- (void)hideNavigationBarShadow:(BOOL)hide;
@end


@interface ARSerifNavigationViewController () <UINavigationControllerDelegate>
@property (nonatomic, strong) ARSerifToolbarButtonItem *exitButton;
@property (nonatomic, strong) UIBarButtonItem *backButton;

@property (nonatomic, strong) UIApplication *sharedApplication;
@property (nonatomic, strong) ARSerifStatusMaintainer *statusMaintainer;

@end


@implementation ARSerifNavigationViewController

+ (void)initialize
{
    if (self == ARSerifNavigationViewController.class) {
        UINavigationBar *nav = [ARSerifNavigationBar appearanceWhenContainedInInstancesOfClasses:@[self.class]];
        [nav setBarTintColor:UIColor.whiteColor];
        [nav setTintColor:UIColor.blackColor];
        [nav setTitleTextAttributes:@{
            NSForegroundColorAttributeName : UIColor.blackColor,
            NSFontAttributeName : [UIFont serifFontWithSize:20]
        }];
        [nav setTitleVerticalPositionAdjustment:-8 forBarMetrics:UIBarMetricsDefault];
    }
}

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
{
    self = [super initWithNavigationBarClass:ARSerifNavigationBar.class toolbarClass:nil];
    if (!self) {
        return nil;
    }

    self.statusMaintainer = [[ARSerifStatusMaintainer alloc] init];
    self.edgesForExtendedLayout = UIRectEdgeNone;
    _hideCloseButton = NO;

    UIImage *image = [[UIImage imageNamed:@"serif_modal_close"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    ARSerifToolbarButtonItem *exit = [[ARSerifToolbarButtonItem alloc] initWithImage:image];

    [exit.button addTarget:self action:@selector(closeModal) forControlEvents:UIControlEventTouchUpInside];
    self.exitButton = exit;

    UIButton *back = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 30, 40)];
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
    [self.statusMaintainer viewWillAppear:animated app:self.sharedApplication];

    self.view.layer.cornerRadius = 0;
    self.view.superview.layer.cornerRadius = 0;
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self.statusMaintainer viewWillDisappear:animated app:self.sharedApplication];
}

- (void)setHideCloseButton:(BOOL)hideCloseButton
{
    _hideCloseButton = hideCloseButton;
    UINavigationItem *nav = self.topViewController.navigationItem;

    if (hideCloseButton) {
        nav.rightBarButtonItem = nil;
    } else {
        nav.rightBarButtonItem = self.exitButton;
    }
}

- (void)closeModal
{
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    UINavigationItem *nav = viewController.navigationItem;
    nav.hidesBackButton = YES;

    if (nav.rightBarButtonItems == nil && self.hideCloseButton == NO) {
        nav.rightBarButtonItem = self.exitButton;
    }

    ARSerifNavigationBar *navBar = (id)self.navigationBar;

    if (navigationController.viewControllers.count > 1) {
        nav.leftBarButtonItem = self.backButton;
        [navBar hideNavigationBarShadow:false];

    } else {
        // On the root view, we want a left aligned title.
        UILabel *label = [ARSerifLabel new];
        label.font = [UIFont serifFontWithSize:20];
        label.text = nav.title;
        label.numberOfLines = 1;
        // Only make it as wide as necessary, otherwise it might cover the right bar button item.
        [label sizeToFit];

        // At the time of writing, 4 is the additional x offset that a UILabel in a left bar button needs
        // to align to the content of e.g. AuctionInformationViewController.
        NSInteger rightButtonsCount = nav.rightBarButtonItems.count;
        static CGFloat xOffset = 4;

        CGRect labelFrame = label.bounds;
        CGFloat idealWidth = CGRectGetWidth(labelFrame) + xOffset;
        CGFloat max = CGRectGetWidth(navigationController.view.bounds) - (rightButtonsCount * 48) - ((rightButtonsCount - 1) * 10) - 20;

        label.frame = CGRectMake(xOffset, 0, MIN(idealWidth, max), 20);
        UIView *titleMarginWrapper = [[UIView alloc] initWithFrame:(CGRect){CGPointZero, {MIN(idealWidth, max), CGRectGetHeight(labelFrame)}}];
        [titleMarginWrapper addSubview:label];

        nav.leftBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:titleMarginWrapper];

        // Just a dummy view to ensure that the navigation bar doesn’t create a new title view.
        nav.titleView = [UIView new];

        [navBar hideNavigationBarShadow:true];
    }

    // Sets the background view shown behind us (but visible for 1pt).
    // See similar work in ARSerifNavigationBar's -layoutSubviews.
    self.view.superview.backgroundColor = [UIColor artsyGraySemibold];
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
    return UIModalPresentationFormSheet;
}

- (UIApplication *)sharedApplication
{
    return _sharedApplication ?: [UIApplication sharedApplication];
}

- (BOOL)shouldAutorotate
{
    return [self traitDependentAutorotateSupport];
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

    [self nudgeViews:self.topItem.rightBarButtonItems horizontally:10];

    // This is a total hack.
    // UIKit inserts a view behind us which, when we're presented in the left side of a split view controller,
    // has a single column pixel visible to our right.
    [self.superview.superview.subviews each:^(UIView *object) {
        if ([NSStringFromClass([object class]) isEqualToString:@"UIView"]) {
            object.backgroundColor = [UIColor artsyGraySemibold];
        }
    }];
}

- (void)verticallyCenterView:(id)viewOrArray
{
    if ([viewOrArray isKindOfClass:[UIView class]]) {
        [self centerVertically:viewOrArray];

    } else {
        for (UIBarButtonItem *button in viewOrArray) {
            [self centerVertically:button.customView];
        }
    }
}

- (void)centerVertically:(UIView *)viewToCenter
{
    CGFloat barMidpoint = roundf(self.frame.size.height / 2);
    CGFloat viewMidpoint = roundf(viewToCenter.frame.size.height / 2);

    CGRect newFrame = viewToCenter.frame;
    newFrame.origin.y = roundf(barMidpoint - viewMidpoint);
    viewToCenter.frame = newFrame;
}

- (void)nudgeViews:(NSArray *)buttons horizontally:(CGFloat)offset
{
    for (UIBarButtonItem *button in buttons) {
        button.customView.frame = CGRectOffset(button.customView.frame, offset, 0);
    }
}

- (void)hideNavigationBarShadow:(BOOL)hide
{
    UIColor *color = hide ? [UIColor whiteColor] : [UIColor artsyGrayRegular];
    [self setBackgroundImage:[UIImage imageFromColor:[UIColor whiteColor]] forBarMetrics:UIBarMetricsDefault];
    self.shadowImage = [UIImage imageFromColor:color];
}

@end


@implementation ARSerifToolbarButtonItem : UIBarButtonItem

- (instancetype)initWithImage:(UIImage *)image
{
    CGFloat dimension = 40;
    UIButton *button = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, dimension, dimension)];
    button.layer.cornerRadius = dimension * .5;

    CALayer *buttonLayer = button.layer;
    buttonLayer.borderColor = [UIColor artsyGrayRegular].CGColor;
    buttonLayer.borderWidth = 1;
    buttonLayer.cornerRadius = dimension * .5;

    [button setImage:image forState:UIControlStateNormal];

    self = [super initWithCustomView:button];
    if (!self) {
        return nil;
    }

    _button = button;
    return self;
}

@end
