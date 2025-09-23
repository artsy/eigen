#import <MultiDelegate/AIMultiDelegate.h>
#import <objc/runtime.h>
#import <objc/message.h>
#import "ARDispatchManager.h"
#import "ARAppDelegateHelper.h"

#import "UIView+HitTestExpansion.h"
#import "UIViewController+InnermostTopViewController.h"
#import "UIViewController+SimpleChildren.h"

#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "ARNavigationTransitionController.h"
#import "ARNavigationController.h"
#import "ARMenuAwareViewController.h"
#import "ARScrollNavigationChief.h"
#import "ARBackButton.h"

#import "ARMacros.h"
#import "UIDevice-Hardware.h"

#import "ARButtonSubclasses.h"
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <MultiDelegate/AIMultiDelegate.h>
#import "ARComponentViewController.h"

static void *ARNavigationControllerButtonStateContext = &ARNavigationControllerButtonStateContext;
static void *ARNavigationControllerScrollingChiefContext = &ARNavigationControllerScrollingChiefContext;
static void *ARNavigationControllerMenuAwareScrollViewContext = &ARNavigationControllerMenuAwareScrollViewContext;


@protocol ARMenuAwareViewController;

@interface ARNavigationController () <UINavigationControllerDelegate, UIGestureRecognizerDelegate>

@property (nonatomic, assign) BOOL isAnimatingTransition;

@property (nonatomic, strong) NSLayoutConstraint *backButtonTopConstraint;

@property (readwrite, nonatomic, strong) AIMultiDelegate *multiDelegate;
@property (readwrite, nonatomic, strong) UIViewController<ARMenuAwareViewController> *observedViewController;
@property (readwrite, nonatomic, strong) UIPercentDrivenInteractiveTransition *interactiveTransitionHandler;

@end


@implementation ARNavigationController

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
{
    self = [super initWithRootViewController:rootViewController];
    if (!self) {
        return nil;
    }

    self.interactivePopGestureRecognizer.delegate = self;
    [self.interactivePopGestureRecognizer removeTarget:nil action:nil];
    [self.interactivePopGestureRecognizer addTarget:self action:@selector(handlePopGuesture:)];

    self.navigationBarHidden = YES;

    _multiDelegate = [[AIMultiDelegate alloc] init];
    [_multiDelegate addDelegate:self];
    [super setDelegate:(id)_multiDelegate];

    // We observe the allowsMenuButton property and show or hide the buttons
    // every time it changes to NO.
    //
    // We don't check the chief when we do transitions because the buttons
    // should be always visible on pop and the scrollsviews should be at the
    // top on push anyways.
    [ARScrollNavigationChief.chief addObserver:self forKeyPath:ar_keypath(ARScrollNavigationChief.chief, allowsMenuButtons) options:NSKeyValueObservingOptionNew context:ARNavigationControllerScrollingChiefContext];

    _animatesLayoverChanges = YES;

    return self;
}

- (void)dealloc
{
    [ARScrollNavigationChief.chief removeObserver:self forKeyPath:ar_keypath(ARScrollNavigationChief.chief, allowsMenuButtons) context:ARNavigationControllerScrollingChiefContext];
    [self observeViewController:NO];
}

#pragma mark - Properties

- (void)setDelegate:(id<UINavigationControllerDelegate>)delegate
{
    [self.multiDelegate removeAllDelegates];
    [self.multiDelegate addDelegate:delegate];
    [self.multiDelegate addDelegate:self];
}

- (void)setObservedViewController:(UIViewController<ARMenuAwareViewController> *)observedViewController
{
    NSParameterAssert(observedViewController == nil || [observedViewController.class conformsToProtocol:@protocol(ARMenuAwareViewController)]);
    [self observeViewController:NO];
    _observedViewController = observedViewController;
    [self observeViewController:YES];
}

#pragma mark - UIViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    _backButton = [[ARBackButton alloc] init];
    [_backButton ar_extendHitTestSizeByWidth:10 andHeight:10];

    [_backButton setImage:[UIImage imageNamed:@"BackChevron"] forState:UIControlStateNormal];
    [_backButton addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
    _backButton.adjustsImageWhenDisabled = NO;

    [self.view addSubview:_backButton];

    [_backButton alignLeadingEdgeWithView:self.view predicate:@"12"];
    self.backButtonTopConstraint = [_backButton alignTopEdgeWithView:self.view predicate:@"12"];
    _backButton.accessibilityIdentifier = @"Back";
    _backButton.alpha = 0;
}

// Handle modal changes to status bars
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    if (self.view.window) {
        [self updateBackButton:self.topViewController animated:animated];
    }
}

#pragma mark - Rotation

- (BOOL)shouldAutorotate
{
    return self.topViewController.shouldAutorotate;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return self.topViewController.supportedInterfaceOrientations ?: ([UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown);
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return self.topViewController.preferredInterfaceOrientationForPresentation ?: UIInterfaceOrientationPortrait;
}

#pragma mark - UINavigationControllerDelegate

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
                                  animationControllerForOperation:(UINavigationControllerOperation)operation
                                               fromViewController:(UIViewController *)fromVC
                                                 toViewController:(UIViewController *)toVC
{
    ARNavigationTransition *transition = [ARNavigationTransitionController animationControllerForOperation:operation
                                                                                        fromViewController:fromVC
                                                                                          toViewController:toVC];

    if (self.interactiveTransitionHandler != nil) {
        BOOL popToRoot = self.viewControllers.count <= 1;

        transition.backButtonTargetAlpha = popToRoot ? 0 : 1;
        transition.menuButtonTargetAlpha = 1;
    }

    return transition;
}

- (id<UIViewControllerInteractiveTransitioning>)navigationController:(UINavigationController *)navigationController interactionControllerForAnimationController:(ARNavigationTransition *)animationController
{
    NSParameterAssert([animationController isKindOfClass:ARNavigationTransition.class]);

    return animationController.supportsInteractiveTransitioning ? self.interactiveTransitionHandler : nil;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    // If it is a non-interactive transition, we fade the buttons in or out
    // ourselves. Otherwise, we'll leave it to the interactive transition.
    if (self.interactiveTransitionHandler == nil) {
        [self setNeedsStatusBarAppearanceUpdate];
        [self updateBackButton:viewController animated:animated];
    }
}

- (void)navigationController:(UINavigationController *)navigationController
       didShowViewController:(UIViewController<ARMenuAwareViewController> *)viewController
                    animated:(BOOL)animated
{
    if ([viewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        self.observedViewController = viewController;
    } else {
        self.observedViewController = nil;
    }

    [self updateBackButton:viewController animated:animated];
}

- (void)updateBackButton:(UIViewController *)viewController animated:(BOOL)animated
{
    [self showBackButton:[self shouldShowBackButtonForViewController:viewController] animated:animated];
    [self updateBackButtonPositionForViewController:viewController animated:animated];
}

- (void)updateBackButtonPositionForViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    CGFloat topInsetMargin = self.view.safeAreaInsets.top;
    CGFloat topMargin = topInsetMargin + 12;

    [UIView animateIf:animated duration:ARAnimationDuration :^{
        self.backButtonTopConstraint.constant = topMargin;
        if (animated) {
            [self.backButton setNeedsLayout];
            [self.backButton layoutIfNeeded];
        }
    }];
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
    NSCParameterAssert(gestureRecognizer == self.interactivePopGestureRecognizer);

    BOOL isInnerMost = self.ar_innermostTopViewController.navigationController == self;
    BOOL innermostIsAtRoot = self.ar_innermostTopViewController.navigationController.viewControllers.count == 1;

    return isInnerMost || innermostIsAtRoot;
}

#pragma mark - Handling the pop guesture

- (void)handlePopGuesture:(UIScreenEdgePanGestureRecognizer *)sender
{
    NSParameterAssert([sender isKindOfClass:UIScreenEdgePanGestureRecognizer.class]);

    CGPoint translation = [sender translationInView:self.view];
    CGFloat fraction = translation.x / CGRectGetWidth(self.view.bounds);

    switch (sender.state) {
        case UIGestureRecognizerStatePossible:
            break;

        case UIGestureRecognizerStateBegan:
            self.interactiveTransitionHandler = [[UIPercentDrivenInteractiveTransition alloc] init];
            self.interactiveTransitionHandler.completionCurve = UIViewAnimationCurveLinear;
            [self popViewControllerAnimated:YES];
            break;

        case UIGestureRecognizerStateChanged:
            [self.interactiveTransitionHandler updateInteractiveTransition:fraction];
            break;

        case UIGestureRecognizerStateCancelled:
        case UIGestureRecognizerStateEnded:
            if ([sender velocityInView:self.view].x > 0) {
                [self.interactiveTransitionHandler finishInteractiveTransition];
            } else {
                [self.interactiveTransitionHandler cancelInteractiveTransition];
            }

            self.interactiveTransitionHandler = nil;
            break;

        case UIGestureRecognizerStateFailed:
            [self.interactiveTransitionHandler cancelInteractiveTransition];
            self.interactiveTransitionHandler = nil;
            break;
    }
}

#pragma mark - ARMenuAwareViewController

- (void)makeScrollViewReportToTheChief:(UIViewController<ARMenuAwareViewController> *)viewController;
{
    UIScrollView *scrollView = viewController.menuAwareScrollView;
    if (scrollView && scrollView.delegate && ![scrollView.delegate respondsToSelector:@selector(addDelegate:)]) {
        id<UIScrollViewDelegate> delegate = scrollView.delegate;
        AIMultiDelegate *multiDelegate = [[AIMultiDelegate alloc] initWithDelegates:@[ delegate, [ARScrollNavigationChief chief] ]];
        scrollView.delegate = (id<UIScrollViewDelegate>)multiDelegate;

        // Store the multi-delegate on the scrollview so that its lifetime is tied to it.
        static char associatedObjectKey;
        objc_setAssociatedObject(scrollView, &associatedObjectKey, multiDelegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
}

static void
ChangeButtonVisibility(UIButton *button, BOOL visible, BOOL animated)
{
    CGFloat opacity = visible ? 1 : 0;
    button.layer.opacity = opacity;
    if (animated) {
        CABasicAnimation *fade = [CABasicAnimation animation];
        fade.keyPath = ar_keypath(button.layer, opacity);
        fade.fromValue = @([(CALayer *)button.layer.presentationLayer opacity]);
        fade.toValue = @(opacity);
        fade.duration = ARAnimationDuration;
        [button.layer addAnimation:fade forKey:@"fade"];
    }
}

- (void)showBackButton:(BOOL)visible animated:(BOOL)animated
{
    ChangeButtonVisibility(self.backButton, visible, animated);
}

static BOOL
ShouldHideItem(UIViewController *viewController, SEL itemSelector, ...)
{
    BOOL result = NO;

    va_list args;
    va_start(args, itemSelector);
    for (SEL sel = itemSelector; sel != NULL; sel = va_arg(args, SEL)) {
        if ([viewController respondsToSelector:sel]) {
            result = ((BOOL (*)(id, SEL))objc_msgSend)(viewController, sel);
            break;
        }
    }
    va_end(args);

    return result;
}

- (BOOL)shouldShowBackButtonForViewController:(UIViewController *)viewController
{
    return !ShouldHideItem(viewController, @selector(hidesBackButton), @selector(hidesNavigationButtons), NULL) && self.viewControllers.count > 1;
}

#pragma mark - Public methods

- (UIViewController *)rootViewController;
{
    return [self.viewControllers firstObject];
}

- (void)removeViewControllerFromStack:(UIViewController *)viewController;
{
    NSArray *stack = self.viewControllers;
    NSUInteger index = [stack indexOfObjectIdenticalTo:viewController];
    if (index != NSNotFound) {
        NSMutableArray *mutatedStack = [stack mutableCopy];
        [mutatedStack removeObjectAtIndex:index];
        self.viewControllers = mutatedStack;
    }
}

#pragma mark - KVO

- (void)observeViewController:(BOOL)observe
{
    UIViewController<ARMenuAwareViewController> *vc = self.observedViewController;

    NSArray *keyPaths = @[
        ar_keypath(vc, hidesNavigationButtons),
        ar_keypath(vc, hidesBackButton),
    ];

    [keyPaths each:^(NSString *keyPath) {
        if ([vc respondsToSelector:NSSelectorFromString(keyPath)]) {
            if (observe) {
                [vc addObserver:self forKeyPath:keyPath options:0 context:ARNavigationControllerButtonStateContext];
            } else {
                [vc removeObserver:self forKeyPath:keyPath context:ARNavigationControllerButtonStateContext];
            }
        }
    }];

    if ([vc respondsToSelector:@selector(menuAwareScrollView)]) {
        if (observe) {
            [vc addObserver:self forKeyPath:@"menuAwareScrollView" options:0 context:ARNavigationControllerMenuAwareScrollViewContext];
            [self makeScrollViewReportToTheChief:vc];
        } else {
            [vc removeObserver:self forKeyPath:@"menuAwareScrollView" context:ARNavigationControllerMenuAwareScrollViewContext];
        }
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (context == ARNavigationControllerButtonStateContext) {
        UIViewController<ARMenuAwareViewController> *vc = object;

        [self showBackButton:[self shouldShowBackButtonForViewController:vc] animated:YES];
    } else if (context == ARNavigationControllerScrollingChiefContext) {
        // All hail the chief
        ARScrollNavigationChief *chief = object;

        NSAssert(self.visibleViewController == self.topViewController, @"Called by a VC that is not part of this navigation controller's stack.");
        [self showBackButton:[self shouldShowBackButtonForViewController:self.topViewController] && chief.allowsMenuButtons animated:YES];
    } else if (context == ARNavigationControllerMenuAwareScrollViewContext) {
        UIViewController<ARMenuAwareViewController> *vc = object;
        [self makeScrollViewReportToTheChief:vc];

    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

#pragma mark - Actions

- (IBAction)back:(id)sender
{
    if (self.isAnimatingTransition) return;

    UINavigationController *navigationController = self.ar_innermostTopViewController.navigationController;
    if (navigationController.viewControllers.count > 1) {
        [navigationController popViewControllerAnimated:YES];
    } else {
        [navigationController.navigationController popViewControllerAnimated:YES];
    }
}

@end
