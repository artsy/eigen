#import <UIKit/UIKit.h>

@class ARBlackFlatButton;


@interface ARLoginButtonsView : UIView

@property (nonatomic, strong, readonly) ARBlackFlatButton *emailActionButton;
@property (nonatomic, strong, readonly) ARBlackFlatButton *facebookActionButton;
@property (nonatomic, strong, readonly) ARBlackFlatButton *twitterActionButton;

- (void)setupForLogin;
- (void)setupForSignUp;

@end
