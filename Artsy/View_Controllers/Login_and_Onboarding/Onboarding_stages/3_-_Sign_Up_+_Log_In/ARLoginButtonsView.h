#import <UIKit/UIKit.h>

@class ARBlackFlatButton, ARClearFlatButton;


@interface ARLoginButtonsView : UIView

@property (nonatomic, strong, readonly) ARBlackFlatButton *emailActionButton;
@property (nonatomic, strong, readonly) ARBlackFlatButton *facebookActionButton;
@property (nonatomic, strong, readonly) ARBlackFlatButton *twitterActionButton;
@property (nonatomic, strong, readonly) ARClearFlatButton *forgotPasswordButton;

- (void)setupForLogin;
- (void)setupForSignUp;
- (void)setupForNewLogin;
- (void)setupForFacebook;

@end
