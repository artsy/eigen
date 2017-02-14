#import <UIKit/UIKit.h>

@class ARTextFieldWithPlaceholder, ARSecureTextFieldWithPlaceholder;


@interface ARLoginFieldsView : UIView

@property (nonatomic, strong, readonly) ARTextFieldWithPlaceholder *nameField;
@property (nonatomic, strong, readonly) ARTextFieldWithPlaceholder *emailField;
@property (nonatomic, strong, readonly) ARSecureTextFieldWithPlaceholder *passwordField;

- (void)setupForLoginWithLargeLayout:(BOOL)useLargeLayout;
- (void)setupForSignUpWithLargeLayout:(BOOL)useLargeLayout;;
- (void)setupForEmailWithLargeLayout:(BOOL)useLargeLayout;;
- (void)setupForPasswordWithLargeLayout:(BOOL)useLargeLayout;;
- (void)setupForNameWithLargeLayout:(BOOL)useLargeLayout;;

- (void)enableErrorState;
- (void)disableErrorState;

@end
