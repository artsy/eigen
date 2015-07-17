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

+ (void)presentActiveError:(NSError *)error;
{
    [self presentActiveError:error withMessage:error.localizedDescription];
}

+ (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;
{
    [ARAnalytics error:error withMessage:message];

    ARNetworkErrorManager *manager = [self sharedManager];
    if (manager.activeModalView == nil) {
        [manager presentActiveError:error withMessage:message];
    }
}

- (void)presentActiveError:(NSError *)error withMessage:(NSString *)message;
{
    ARTopMenuViewController *topMenu = [ARTopMenuViewController sharedController];
    UIViewController *hostVC = topMenu.visibleViewController;

    if ([hostVC respondsToSelector:@selector(shouldShowActiveNetworkError)]) {
        if (![(id<ARNetworkErrorAwareViewController>)hostVC shouldShowActiveNetworkError]) {
            return;
        }
    }

    self.activeModalView = [[ARWarningView alloc] initWithFrame:CGRectZero];
    self.activeModalView.text = [NSString stringWithFormat:@"%@ Network connection error.", message];

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

    UITapGestureRecognizer *removeTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(removeActiveError)];
    [self.activeModalView addGestureRecognizer:removeTapGesture];

    [UIView animateWithDuration:0.15 animations:^{
        self.activeModalView.alpha = 1;
    }];

    [self performSelector:@selector(removeActiveError) withObject:nil afterDelay:10];
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
