#import "ARShadowView.h"
#import <ARAnalytics/ARAnalytics.h>


@interface ARNetworkErrorManager ()
@property (nonatomic, strong) ARShadowView *activeModalView;
@property (nonatomic, strong) UIView *passiveErrorView;
@property (nonatomic, strong) NSLayoutConstraint *passiveBottomContraint;
@property (nonatomic, strong) NSString *bottomAlignmentPredicate;
@end


@implementation ARNetworkErrorManager

+ (ARNetworkErrorManager *)sharedManager
{
    static ARNetworkErrorManager *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];

      //        [[NSNotificationCenter defaultCenter] addObserver:_sharedManager
      //                                                 selector:@selector(keyboardWasShown:)
      //                                                     name:UIKeyboardDidShowNotification
      //                                                   object:nil];
      //        [[NSNotificationCenter defaultCenter] addObserver:_sharedManager
      //                                                 selector:@selector(keyboardWillHide:)
      //                                                     name:UIKeyboardWillHideNotification
      //                                                   object:nil];
    });
    return _sharedManager;
}

- (void)keyboardWasShown:(NSNotification *)notification
{
    CGSize keyboardSize = [[[notification userInfo] objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    self.bottomAlignmentPredicate = [NSString stringWithFormat:@"-%0.f", keyboardSize.height];

    if (self.passiveBottomContraint) {
        CGFloat duration = [[[notification userInfo] objectForKey:UIKeyboardAnimationDurationUserInfoKey] doubleValue];

        [UIView animateWithDuration:duration animations:^{
            self.passiveBottomContraint.constant = -keyboardSize.height;
            [self.passiveErrorView.superview layoutIfNeeded];
        }];
    }
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    self.bottomAlignmentPredicate = @"0";
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
    NSArray *views = [[UINib nibWithNibName:@"ActiveErrorView" bundle:nil] instantiateWithOwner:self options:nil];
    self.activeModalView = views[0];

    self.activeModalView.alpha = 0;
    ARTopMenuViewController *topMenu = [ARTopMenuViewController sharedController];
    [topMenu.view addSubview:self.activeModalView];

    [UIView animateWithDuration:0.15 animations:^{
        self.activeModalView.alpha = 1;
    }];
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

- (void)setActiveModalView:(ARShadowView *)activeModalView
{
    _activeModalView = activeModalView;

    UITapGestureRecognizer *removeTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(removeActiveErrorModal)];
    [self.activeModalView addGestureRecognizer:removeTapGesture];

    UILabel *titleLabel = activeModalView.subviews[0];
    titleLabel.font = [UIFont serifFontWithSize:26];

    [self.activeModalView createShadow];
}

@end
