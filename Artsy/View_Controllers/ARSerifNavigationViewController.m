#import "ARSerifNavigationViewController.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"
#import "UIImage+ImageFromColor.h"
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import "ARTopMenuViewController.h"
#import <Artsy+UILabels/Artsy+UILabels.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

#define controllersRequiringHiddenNavBar @[@"ARBidFlowViewController", @"ARSerifTestNavigationController"]

static CGFloat exitButtonDimension = 40;

@interface ARSerifNavigationBar : UINavigationBar

/// There's a UIKit bug we need to workaround; see implementation for more details.
/// Only set this to `true` if we're presented the auction view controller (in split view).
@property (nonatomic, assign) BOOL needsLiveAuctionsBackgroundColorFix;

/// Show/hides the underline from a navigation bar
- (void)hideNavigationBarShadow:(BOOL)hide;
@end


@interface ARSerifNavigationViewController () <UINavigationControllerDelegate>
@property (nonatomic, strong) ARSerifToolbarButtonItem *exitButton;
@property (nonatomic, strong) UIBarButtonItem *backButton;

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
    return [self initWithRootViewController:rootViewController hideNavigationBar:NO];
}

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController hideNavigationBar:(BOOL)hideNavigationBar
{
    self = [super initWithNavigationBarClass:ARSerifNavigationBar.class toolbarClass:nil];
    if (!self) {
        return nil;
    }

    self.edgesForExtendedLayout = UIRectEdgeNone;
    _hideCloseButton = NO;

    self.exitButton = [self generateExitButton];

    UIButton *back = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 30, 40)];
    UIImage *image = [[UIImage imageNamed:@"BackArrow_Highlighted"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    [back setImage:image forState:UIControlStateNormal];
    [back addTarget:self action:@selector(popViewControllerAnimated:) forControlEvents:UIControlEventTouchUpInside];
    self.backButton = [[UIBarButtonItem alloc] initWithCustomView:back];

    [self setViewControllers:@[ rootViewController ]];
    [self.navigationBar.topItem setRightBarButtonItem:self.exitButton];

    if (hideNavigationBar || [controllersRequiringHiddenNavBar containsObject:NSStringFromClass(rootViewController.class)]) {
        self.navigationBarHidden = YES;
    }

    self.delegate = self;
    return self;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    self.view.layer.cornerRadius = 0;
    self.view.superview.layer.cornerRadius = 0;

    if (self.navigationBarHidden) {
        // No nav bar means we need to show something under the status bar manually. Might as well be our own view with a white background.
        self.view.backgroundColor = [UIColor whiteColor];

        // The exit button normally sits within the nav bar. Without it, we need to add it to our own view hierarchy.
        UIButton *exitButton = [self generateExitButton].button;
        exitButton.tintColor = UIColor.blackColor;
        exitButton.backgroundColor = UIColor.whiteColor;
        NSString *dimensionString = [NSString stringWithFormat:@"%@", @(exitButtonDimension)];
        [exitButton constrainWidth:dimensionString height:dimensionString];

        // Add button to hierarchy and constrain layout.
        [self.view addSubview:exitButton];
        // Top and trailing constraint constants were determined experimentally.
        // Constraints differ on iPad, but we can't rely on our own view's trait collection because, when presented modally on iPad,
        // its horizontalSizeClass will always be compact.
        if (UIApplication.sharedApplication.keyWindow.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact) {
            // iPhone X support
            if (UIScreen.mainScreen.bounds.size.height == 812) {
                [exitButton alignTopEdgeWithView:self.view predicate:@"54"];
            } else {
                [exitButton alignTopEdgeWithView:self.view predicate:@"31"];
            }
            [exitButton alignTrailingEdgeWithView:self.view predicate:@"-6"];
        } else {
            [exitButton alignTopEdgeWithView:self.view predicate:@"12"];
            [exitButton alignTrailingEdgeWithView:self.view predicate:@"-19"];
        }
    }
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
    navBar.needsLiveAuctionsBackgroundColorFix = [NSStringFromClass(viewController.class) containsString:@"LiveAuction"];

    // Just a dummy view to ensure that the navigation bar doesn’t create a new title view.
    nav.titleView = [UIView new];

    if (navigationController.viewControllers.count > 1) {
        nav.leftBarButtonItem = self.backButton;
        [navBar hideNavigationBarShadow:false];
        if (nav.title) {

            UILabel *label = [ARSerifLabel new];
            label.font = [UIFont serifFontWithSize:20];
            label.text = nav.title;
            label.numberOfLines = 1;
            // Only make it as wide as necessary, otherwise it might cover the right bar button item.
            [label sizeToFit];

            nav.titleView = label;
        }

    } else {
        if (nav.title && nav.title.length > 0) {
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
        }

        [navBar hideNavigationBarShadow:true];
    }

    // Sets the background view shown behind us (but visible for 1pt).
    // See similar work in ARSerifNavigationBar's -layoutSubviews.
    self.view.superview.backgroundColor = [UIColor artsyGraySemibold];
}

- (BOOL)definesPresentationContext
{
    return YES;
}

- (UIModalPresentationStyle)modalPresentationStyle
{
    return UIModalPresentationFormSheet;
}

- (BOOL)shouldAutorotate
{
    return [self traitDependentAutorotateSupport];
}

- (ARSerifToolbarButtonItem *)generateExitButton
{
    UIImage *image = [[UIImage imageNamed:@"serif_modal_close"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    ARSerifToolbarButtonItem *exit = [[ARSerifToolbarButtonItem alloc] initWithImage:image];

    [exit.button addTarget:self action:@selector(closeModal) forControlEvents:UIControlEventTouchUpInside];
    [exit.button ar_extendHitTestSizeByWidth:10 andHeight:10];
    return exit;
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

    if (self.needsLiveAuctionsBackgroundColorFix) {
        // This is a total hack.
        // UIKit inserts a view behind us which, when we're presented in the left side of a split view controller,
        // has a single column pixel visible to our right.
        [self.superview.superview.subviews each:^(UIView *object) {
            if ([NSStringFromClass([object class]) isEqualToString:@"UIView"]) {
                object.backgroundColor = [UIColor artsyGraySemibold];
            }
        }];
    }
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
    CGFloat yOffset = 0;
    if ([viewToCenter isDescendantOfView:self]) {
        UIView *child = viewToCenter.superview;
        int safety = 0;
        while (safety++ < 10 && child != self) {
            yOffset += child.frame.origin.y;
            child = child.superview;
        }
    }

    CGFloat barHeight = self.frame.size.height;
    CGFloat viewHeight = viewToCenter.frame.size.height;

    CGRect newFrame = viewToCenter.frame;
    newFrame.origin.y = roundf(((barHeight - viewHeight) / 2) - yOffset);
    viewToCenter.frame = newFrame;
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
    UIButton *button = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, exitButtonDimension, exitButtonDimension)];
    button.layer.cornerRadius = exitButtonDimension * .5;

    CALayer *buttonLayer = button.layer;
    buttonLayer.borderColor = [UIColor artsyGrayRegular].CGColor;
    buttonLayer.borderWidth = 1;
    buttonLayer.cornerRadius = exitButtonDimension * .5;

    [button setImage:image forState:UIControlStateNormal];

    self = [super initWithCustomView:button];
    if (!self) {
        return nil;
    }

    _button = button;
    return self;
}

@end
