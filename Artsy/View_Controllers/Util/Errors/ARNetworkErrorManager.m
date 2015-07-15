#import "ARNetworkErrorManager.h"
#import "ARCustomEigenLabels.h"

@import ARAnalytics;
@import NPKeyboardLayoutGuide;


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

+ (void)presentActiveErrorModalWithError:(NSError *)error
{
    ARNetworkErrorManager *manager = [self sharedManager];
    if (manager.activeModalView) {
        return;
    }

    [ARAnalytics error:error];
    [manager presentActiveError:error];
}

- (void)presentActiveError:(NSError *)error
{
    ARTopMenuViewController *topMenu = [ARTopMenuViewController sharedController];
    UIViewController *hostVC = topMenu.visibleViewController;

    self.activeModalView = [[ARWarningView alloc] initWithFrame:CGRectZero];
    self.activeModalView.text = @"Network connection error.";

    self.activeModalView.alpha = 0;
    [hostVC.view addSubview:self.activeModalView];

    [self.activeModalView constrainHeight:@"40"];
    [self.activeModalView constrainWidthToView:hostVC.view predicate:nil];

    [self.activeModalView alignAttribute:NSLayoutAttributeBottom
                             toAttribute:NSLayoutAttributeTop
                                  ofView:hostVC.bottomLayoutGuide
                               predicate:@"@750"];
    [self.activeModalView alignAttribute:NSLayoutAttributeBottom
                             toAttribute:NSLayoutAttributeTop
                                  ofView:hostVC.keyboardLayoutGuide
                               predicate:@"@1000"];

    UITapGestureRecognizer *removeTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(removeActiveErrorModal)];
    [self.activeModalView addGestureRecognizer:removeTapGesture];

    [UIView animateWithDuration:0.15 animations:^{
        self.activeModalView.alpha = 1;
    }];

    [self performSelector:@selector(removeActiveErrorModal) withObject:nil afterDelay:10];
}

- (void)removeActiveErrorModal
{
    [UIView animateWithDuration:0.25 animations:^{
        self.activeModalView.alpha = 0;

    } completion:^(BOOL finished) {
        [self.activeModalView removeFromSuperview];
        self.activeModalView = nil;
    }];
}

@end
