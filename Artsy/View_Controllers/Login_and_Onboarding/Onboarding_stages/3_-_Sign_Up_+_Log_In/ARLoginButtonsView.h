#import <UIKit/UIKit.h>


@interface ARLoginButtonsView : UIView

@property (nonatomic, strong, readonly) UIButton *actionButton;

- (void)setupForLogin; // includes forget password button
- (void)setupForSignUp; // includes back button
- (void)setupForFacebook;

@end
