#import <UIKit/UIKit.h>


@interface ARLoginButtonsView : UIView

@property (nonatomic, strong, readonly) UIButton *actionButton;

- (void)setupForLoginWithLargeLayout:(BOOL)useLargeLayout; // includes forget password button
- (void)setupForSignUpWithLargeLayout:(BOOL)useLargeLayout; // includes back button
- (void)setupForFacebookWithLargeLayout:(BOOL)useLargeLayout;

@end
