#import <MultiDelegate/AIMultiDelegate.h>
#import <objc/runtime.h>

#import "UIView+HitTestExpansion.h"
#import "UIViewController+InnermostTopViewController.h"
#import "UIViewController+SimpleChildren.h"

#import "ARNavigationTransitionController.h"
#import "ARPendingOperationViewController.h"

static void *ARNavigationControllerButtonStateContext = &ARNavigationControllerButtonStateContext;
static void *ARNavigationControllerScrollingChiefContext = &ARNavigationControllerScrollingChiefContext;


@interface ARNavigationController () <UINavigationControllerDelegate, UIGestureRecognizerDelegate>

@property (nonatomic, assign) BOOL isAnimatingTransition;
@property (nonatomic, strong) UIView *statusBarView;
@property (nonatomic, strong) NSLayoutConstraint *statusBarVerticalConstraint;

@property (readwrite, nonatomic, strong) ARPendingOperationViewController *pendingOperationViewController;
@property (readwrite, nonatomic, strong) AIMultiDelegate *multiDelegate;
@property (readwrite, nonatomic, strong) UIViewController<ARMenuAwareViewController> *observedViewController;
@property (readwrite, nonatomic, strong) UIPercentDrivenInteractiveTransition *interactiveTransitionHandler;

- (void)handlePopGuesture:(UIGestureRecognizer *)sender;

- (BOOL)shouldShowBackButtonForViewController:(UIViewController *)viewController;
- (BOOL)shouldShowStatusBarBackgroundForViewController:(UIViewController *)viewController;

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
    [ARScrollNavigationChief.chief addObserver:self forKeyPath:@keypath(ARScrollNavigationChief.chief, allowsMenuButtons) options:NSKeyValueObservingOptionNew context:ARNavigationControllerScrollingChiefContext];

    _animatesLayoverChanges = YES;

    return self;
}

- (void)dealloc
{
    [ARScrollNavigationChief.chief removeObserver:self forKeyPath:@keypath(ARScrollNavigationChief.chief, allowsMenuButtons) context:ARNavigationControllerScrollingChiefContext];
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

    _statusBarView = [[UIView alloc] init];
    _statusBarView.backgroundColor = UIColor.blackColor;
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:NO];

    [self.view addSubview:_statusBarView];

    _statusBarVerticalConstraint = [_statusBarView constrainHeight:@"20"][0];
    [_statusBarView constrainWidthToView:self.view predicate:nil];
    [_statusBarView alignTopEdgeWithView:self.view predicate:nil];
    [_statusBarView alignLeadingEdgeWithView:self.view predicate:nil];

    _backButton = [[ARMenuButton alloc] init];
    [_backButton ar_extendHitTestSizeByWidth:10 andHeight:10];
    [_backButton setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
    [_backButton addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
    _backButton.adjustsImageWhenDisabled = NO;

    [self.view addSubview:_backButton];
    [_backButton constrainTopSpaceToView:_statusBarView predicate:@"12"];
    [_backButton alignLeadingEdgeWithView:self.view predicate:@"12"];
    _backButton.accessibilityIdentifier = @"Back";
    _backButton.alpha = 0;
}

#pragma mark - Rotation

- (BOOL)shouldAutorotate
{
    return self.topViewController.shouldAutorotate;
}

- (NSUInteger)supportedInterfaceOrientations
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
        [self showBackButton:[self shouldShowBackButtonForViewController:viewController] animated:animated];
        [self showStatusBar:!viewController.prefersStatusBarHidden animated:animated];
        [self showStatusBarBackground:[self shouldShowStatusBarBackgroundForViewController:viewController] animated:animated];

        BOOL hideToolbar = [self shouldHideToolbarMenuForViewController:viewController];
        [[ARTopMenuViewController sharedController] hideToolbar:hideToolbar animated:animated];
    }
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    if ([viewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        self.observedViewController = (UIViewController<ARMenuAwareViewController> *)viewController;
    } else {
        self.observedViewController = nil;
    }

    [self showBackButton:[self shouldShowBackButtonForViewController:viewController] animated:NO];
    [self showStatusBarBackground:[self shouldShowStatusBarBackgroundForViewController:viewController] animated:NO];

    BOOL hideToolbar = [self shouldHideToolbarMenuForViewController:viewController];
    [[ARTopMenuViewController sharedController] hideToolbar:hideToolbar animated:NO];
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

#pragma mark - Menu buttons

- (void)showBackButton:(BOOL)visible animated:(BOOL)animated
{
    CGFloat toValue = visible ? 1 : 0;

    self.backButton.layer.opacity = toValue;

    if (animated) {
        CABasicAnimation *fade = [CABasicAnimation animation];
        fade.keyPath = @keypath(self.backButton.layer, opacity);
        fade.fromValue = @([(CALayer *)self.backButton.layer.presentationLayer opacity]);
        fade.toValue = @(toValue);
        fade.duration = ARAnimationDuration;

        [self.backButton.layer addAnimation:fade forKey:@"fade"];
    }
}

- (void)showStatusBar:(BOOL)visible animated:(BOOL)animated
{
    if (animated) {
        [[UIApplication sharedApplication] setStatusBarHidden:!visible withAnimation:UIStatusBarAnimationSlide];
    } else {
        [[UIApplication sharedApplication] setStatusBarHidden:!visible withAnimation:UIStatusBarAnimationNone];
    }

    [UIView animateIf:animated duration:ARAnimationDuration:^{
        self.statusBarVerticalConstraint.constant = visible ? 20 : 0;

        if (animated) [self.view layoutIfNeeded];
    }];
}

- (void)showStatusBarBackground:(BOOL)visible animated:(BOOL)animated
{
    [UIView animateIf:animated duration:ARAnimationDuration:^{
        self.statusBarView.alpha = visible ? 1 : 0;
    }];
}

- (BOOL)shouldShowBackButtonForViewController:(UIViewController *)viewController
{
    if ([viewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        return ![(id)viewController hidesBackButton];
    }

    return self.viewControllers.count > 1;
}

- (BOOL)shouldShowStatusBarBackgroundForViewController:(UIViewController *)viewController
{
    if ([viewController respondsToSelector:@selector(hidesStatusBarBackground)]) {
        return ![(id)viewController hidesStatusBarBackground];
    }

    return YES;
}

- (BOOL)shouldHideToolbarMenuForViewController:(UIViewController *)viewController
{
    if ([viewController conformsToProtocol:@protocol(ARMenuAwareViewController)]) {
        return [(id)viewController hidesToolbarMenu];
    }

    return NO;
}


#pragma mark - Public methods

- (RACCommand *)presentPendingOperationLayover
{
    return [self presentPendingOperationLayoverWithMessage:nil];
}

- (RACCommand *)presentPendingOperationLayoverWithMessage:(NSString *)message
{
    self.pendingOperationViewController = [[ARPendingOperationViewController alloc] init];
    if (message) {
        self.pendingOperationViewController.message = message;
    }
    [self ar_addModernChildViewController:self.pendingOperationViewController];

   @_weakify(self);

    return [[RACCommand alloc] initWithSignalBlock:^RACSignal *(id input) {
        @_strongify(self);
        RACSubject *completionSubject = [RACSubject subject];

        [UIView animateIf:self.animatesLayoverChanges duration:ARAnimationDuration :^{
            self.pendingOperationViewController.view.alpha = 0.0;
        } completion:^(BOOL finished) {
            [self ar_removeChildViewController:self.pendingOperationViewController];
            self.pendingOperationViewController = nil;
            [completionSubject sendCompleted];
        }];

        return completionSubject;
    }];
}

#pragma mark - KVO

- (void)observeViewController:(BOOL)observe;
{
    UIViewController<ARMenuAwareViewController> *vc = self.observedViewController;

    NSArray *keyPaths = @[
        @keypath(vc, hidesBackButton),
        @keypath(vc, hidesToolbarMenu)
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
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if (context == ARNavigationControllerButtonStateContext) {
        UIViewController<ARMenuAwareViewController> *vc = object;

        [self showBackButton:!vc.hidesBackButton animated:YES];

        if ([vc respondsToSelector:@selector(hidesToolbarMenu)]) {
            [[ARTopMenuViewController sharedController] hideToolbar:vc.hidesToolbarMenu animated:YES];
        }

    } else if (context == ARNavigationControllerScrollingChiefContext) {
        // All hail the chief
        ARScrollNavigationChief *chief = object;

        [self showBackButton:[self shouldShowBackButtonForViewController:self.topViewController] && chief.allowsMenuButtons animated:YES];

    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

#pragma mark - Actions

- (IBAction)back:(id)sender
{
    if (self.isAnimatingTransition) return;

    UINavigationController *navigationController = self.ar_innermostTopViewController.navigationController;

    UIViewController *poppedVC;
    if (navigationController.viewControllers.count > 1) {
        poppedVC = [navigationController popViewControllerAnimated:YES];
    } else {
        poppedVC = [navigationController.navigationController popViewControllerAnimated:YES];
    }

    ARBackButtonCallbackManager *backButtonCallbackManager = [ARTopMenuViewController sharedController].backButtonCallbackManager;

    if (backButtonCallbackManager) {
        [backButtonCallbackManager handleBackForViewController:poppedVC];
    }
}

@end
