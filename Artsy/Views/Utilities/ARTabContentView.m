#import "ARTabContentView.h"

#import "ARDispatchManager.h"
#import "ARNavigationController.h"
#import "UIView+HitTestExpansion.h"
#import "ARMenuAwareViewController.h"
#import "AROptions.h"
#import "ArtsyEcho.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARTabContentView ()
@end


@implementation ARTabContentView
/// move to RN?

- (id)initWithFrame:(CGRect)frame hostViewController:(UIViewController *)controller delegate:(id<ARTabViewDelegate>)delegate dataSource:(id)dataSource
{
    self = [super initWithFrame:frame];
    if (!self) return nil;

    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.opaque = YES;
    self.clipsToBounds = YES;

    _hostViewController = controller;
    _delegate = delegate;

    return self;
}

- (void)removeFromSuperview
{
    [_currentNavigationController willMoveToParentViewController:nil];
    [_currentNavigationController removeFromParentViewController];

    [super removeFromSuperview];
}



- (void)forceSetCurrentTab:(NSString *)tabType animated:(BOOL)animated
{
    /// do the crossfade
//    alpha from 0 to 1, duration 0.1
}

@end
