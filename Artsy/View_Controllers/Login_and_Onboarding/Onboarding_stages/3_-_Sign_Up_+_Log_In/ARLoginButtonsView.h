#import <UIKit/UIKit.h>

@class ARBlackFlatButton, ARClearFlatButton, FBSDKLoginButton;

@interface ARLoginButtonsView : UIView

@property (nonatomic, strong, readonly) ARBlackFlatButton *emailActionButton;
@property (nonatomic, strong, readonly) FBSDKLoginButton *facebookActionButton;
@property (nonatomic, strong, readonly) ARBlackFlatButton *twitterActionButton;
@property (nonatomic, strong, readonly) ARClearFlatButton *forgotPasswordButton;

- (void)setupForLogin;
- (void)setupForSignUp;

@end
