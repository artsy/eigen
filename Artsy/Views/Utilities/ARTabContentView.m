#import "ARTabContentView.h"

#import "ARDispatchManager.h"
#import "ARNavigationController.h"
#import "UIView+HitTestExpansion.h"
#import "ARMenuAwareViewController.h"
#import "AROptions.h"
#import "ARSwitchBoard.h"
#import "ArtsyEcho.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

static BOOL ARTabViewDirectionLeft = NO;
static BOOL ARTabViewDirectionRight = YES;


@interface ARTabContentView ()
@end


@implementation ARTabContentView

- (id)initWithFrame:(CGRect)frame hostViewController:(UIViewController *)controller delegate:(id<ARTabViewDelegate>)delegate dataSource:(id<ARTabViewDataSource>)dataSource
{
    self = [super initWithFrame:frame];
    if (!self) return nil;

    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.opaque = YES;
    self.clipsToBounds = YES;

    _hostViewController = controller;
    _delegate = delegate;
    _dataSource = dataSource;

    _leftSwipeGesture = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(swipedViewLeft:)];
    _leftSwipeGesture.direction = UISwipeGestureRecognizerDirectionLeft;
    [self addGestureRecognizer:_leftSwipeGesture];

    _rightSwipeGesture = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(swipedViewRight:)];
    _rightSwipeGesture.direction = UISwipeGestureRecognizerDirectionRight;
    [self addGestureRecognizer:_rightSwipeGesture];

    return self;
}

- (void)removeFromSuperview
{
    [_currentNavigationController willMoveToParentViewController:nil];
    [_currentNavigationController removeFromParentViewController];

    [super removeFromSuperview];
}

#pragma mark -
#pragma mark Custom Properties

- (void)setSupportSwipeGestures:(BOOL)supportSwipeGestures
{
    self.leftSwipeGesture.enabled = supportSwipeGestures;
    self.rightSwipeGesture.enabled = supportSwipeGestures;
}

- (void)setButtons:(NSArray *)buttons
{
    _buttons = buttons;

    [self.buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        button.enabled = [self.dataSource tabContentView:self canPresentViewControllerAtIndex:index];
        [button addTarget:self action:@selector(buttonTapped:) forControlEvents:UIControlEventTouchUpInside];
        [button ar_extendHitTestSizeByWidth:10 andHeight:20];
    }];
}

#pragma mark -
#pragma mark Gestures

- (void)swipedViewRight:(UISwipeGestureRecognizer *)gesture
{
    [self showPreviousTabAnimated:YES];
}

- (void)showPreviousTabAnimated:(BOOL)animated
{
    NSInteger nextIndex = [self nextEnabledIndexInDirection:ARTabViewDirectionLeft];

    if (self.currentViewIndex != nextIndex) {
        [self setCurrentViewIndex:nextIndex animated:animated];
    }
}

- (void)swipedViewLeft:(UISwipeGestureRecognizer *)gesture
{
    [self showNextTabAnimated:YES];
}

- (void)showNextTabAnimated:(BOOL)animated
{
    NSInteger nextIndex = [self nextEnabledIndexInDirection:ARTabViewDirectionRight];
    if (self.currentViewIndex != nextIndex) {
        [self setCurrentViewIndex:nextIndex animated:animated];
    }
}

- (NSInteger)nextEnabledIndexInDirection:(BOOL)direction
{
    // can't go any further
    if (self.currentViewIndex == 0 && direction == ARTabViewDirectionLeft) return self.currentViewIndex;
    if (self.currentViewIndex == [self numberOfViewControllers] - 1 && direction == ARTabViewDirectionRight) return self.currentViewIndex;

    NSInteger nextViewIndex = direction ? self.currentViewIndex + 1 : self.currentViewIndex - 1;
    // loop until we hit an enabled view
    while (![self.dataSource tabContentView:self canPresentViewControllerAtIndex:nextViewIndex]) {
        if (direction) {
            nextViewIndex++;
        } else {
            nextViewIndex--;
        }

        // if we're going to go too far, stop and return the current index
        if (nextViewIndex == -1) return self.currentViewIndex;
        if (nextViewIndex == [self numberOfViewControllers]) return self.currentViewIndex;
    }

    return nextViewIndex;
}

- (NSInteger)numberOfViewControllers
{
    return [self.dataSource numberOfViewControllersForTabContentView:self];
}

#pragma mark -
#pragma mark Setting the Current View Index

- (void)setCurrentViewIndex:(NSInteger)index animated:(BOOL)animated
{
    if ([self.delegate respondsToSelector:@selector(tabContentView:shouldChangeToIndex:)]) {
        if ([self.delegate tabContentView:self shouldChangeToIndex:index] == NO) return;
    }

    [self forceSetCurrentViewIndex:index animated:animated];
}

- (void)forceSetCurrentViewIndex:(NSInteger)index animated:(BOOL)animated
{
    [self forceSetViewController:[self navigationControllerForIndex:index] atIndex:index animated:animated];
}

- (void)forceSetViewController:(UINavigationController *)viewController atIndex:(NSInteger)index animated:(BOOL)animated
{
    BOOL isARNavigationController = [self.currentNavigationController isKindOfClass:ARNavigationController.class];

    [self.buttons each:^(UIButton *button) {
        button.selected = NO;
    }];

    if (index < self.buttons.count) {
        [(UIButton *)self.buttons[index] setSelected:YES];
    }

    // Setup positions of views
    NSInteger direction = (_currentViewIndex > index) ? -1 : 1;
    CGRect nextViewInitialFrame = self.bounds;
    CGRect oldViewEndFrame = self.bounds;
    nextViewInitialFrame.origin.x = direction * CGRectGetWidth(self.superview.bounds);
    oldViewEndFrame.origin.x = -direction * CGRectGetWidth(self.superview.bounds);

    __block UINavigationController *oldViewController = self.currentNavigationController;
    _previousViewIndex = self.currentViewIndex;
    _currentViewIndex = index;

    // Ensure there is only one scrollview that has `scrollsToTop`
    if (isARNavigationController) {
      UIViewController<ARMenuAwareViewController> *oldTopViewController = (id)oldViewController.topViewController;
      if ([oldTopViewController respondsToSelector:@selector(menuAwareScrollView)]) {
          oldTopViewController.menuAwareScrollView.scrollsToTop = NO;
      }
    }

    // Get the next View Controller, add to self
    _currentNavigationController = viewController;
    self.currentNavigationController.view.frame = nextViewInitialFrame;

    if (!self.currentNavigationController.parentViewController) {
        // Add the new ViewController our view's host
        [self.currentNavigationController willMoveToParentViewController:self.hostViewController];
        [self.hostViewController addChildViewController:self.currentNavigationController];
        [self.currentNavigationController didMoveToParentViewController:_hostViewController];
    }

    void (^animationBlock)(void);
    animationBlock = ^{
        self.currentNavigationController.view.frame = self.bounds;
        oldViewController.view.frame = oldViewEndFrame;
    };

    void (^completionBlock)(BOOL finished);
    completionBlock = ^(BOOL finished) {
        if ([self.delegate respondsToSelector:@selector(tabContentView:didChangeSelectedIndex:)]) {
            [self.delegate tabContentView:self didChangeSelectedIndex:index];
        }
    };

    ar_dispatch_main_queue(^{
        if (animated && oldViewController && oldViewController.parentViewController) {
            [self.hostViewController transitionFromViewController:oldViewController toViewController:self.currentNavigationController duration:0.3 options:0 animations:animationBlock completion:completionBlock];
        } else {
            [oldViewController beginAppearanceTransition:NO animated:NO];
            [oldViewController endAppearanceTransition];
            [self.currentNavigationController beginAppearanceTransition:YES animated:NO];
            [self addSubview:self.currentNavigationController.view];
            [self.currentNavigationController endAppearanceTransition];

            // Ensure there is only one scrollview that has `scrollsToTop`
            if (isARNavigationController && [self.currentNavigationController.topViewController conformsToProtocol:@protocol(ARMenuAwareViewController)] && [self.currentNavigationController.topViewController respondsToSelector:@selector(menuAwareScrollView)]) {
                [(id)self.currentNavigationController.topViewController menuAwareScrollView].scrollsToTop = YES;
            }

            animationBlock();
            completionBlock(YES);
        }
    });
}

- (void)returnToPreviousViewIndex
{
    [self setCurrentViewIndex:self.previousViewIndex animated:NO];
}

- (UINavigationController *)navigationControllerForIndex:(NSInteger)index
{
    return [self.dataSource viewControllerForTabContentView:self atIndex:index];
}

- (void)buttonTapped:(id)sender
{
    NSInteger index = [self.buttons indexOfObject:sender];
    [self setCurrentViewIndex:index animated:NO];
}

@end
