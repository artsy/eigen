#import "ARNetworkErrorManager.h"
#import "ARCustomEigenLabels.h"
#import "ARTNativeScreenPresenterModule.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
@import Sentry;

@interface ARNetworkErrorManager ()
@property (nonatomic, strong) UILabel *activeModalView;
@end


@implementation ARNetworkErrorManager

+ (ARNetworkErrorManager *)sharedManager
{
    static ARNetworkErrorManager *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];
    });
    return _sharedManager;
}

+ (void)presentActiveError:(NSError *)error;
{
    [self presentActiveError:error withMessage:error.localizedDescription];
}

+ (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;
{
    [SentrySDK captureError:error];

    ARNetworkErrorManager *manager = [self sharedManager];
    if (manager.activeModalView == nil) {
        [manager presentActiveError:error withMessage:message];
    }
}

- (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;
{
    UIView *hostView = [ARTNativeScreenPresenterModule currentlyPresentedVC].view;

    // This happens when there’s no network on app launch and onboarding will be shown.
    if (hostView.superview == nil) {
        return;
    }

    self.activeModalView = [[ARWarningView alloc] initWithFrame:CGRectZero];
    self.activeModalView.text = [NSString stringWithFormat:@"%@ Network connection error.", message];

    self.activeModalView.alpha = 0;
    [hostView addSubview:self.activeModalView];

    [self.activeModalView constrainHeight:@"50"];
    [self.activeModalView constrainWidthToView:hostView predicate:@"0"];

    // Show banner above bottom of modal view, above tab bar of top menu, or above the keyboard.
    [self.activeModalView alignBottomEdgeWithView:hostView predicate:@"0"];

    UITapGestureRecognizer *removeTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(removeActiveError)];
    [self.activeModalView addGestureRecognizer:removeTapGesture];

    [UIView animateWithDuration:0.15 animations:^{
        self.activeModalView.alpha = 1;
    }];

    [self performSelector:@selector(removeActiveError) withObject:nil afterDelay:5];
}

- (void)removeActiveError
{
    [UIView animateWithDuration:0.25 animations:^{
        self.activeModalView.alpha = 0;

    } completion:^(BOOL finished) {
        [self.activeModalView removeFromSuperview];
        self.activeModalView = nil;
    }];
}

@end
