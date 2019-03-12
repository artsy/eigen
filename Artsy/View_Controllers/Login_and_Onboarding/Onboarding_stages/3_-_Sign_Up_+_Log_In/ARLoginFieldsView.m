#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "UIColor+ArtsyColors.h"

#import "ARFonts.h"
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Artsy-UIButtons/ARButtonSubclasses.h>



@interface ARLoginFieldsView ()

@property (nonatomic, strong) NSLayoutConstraint *nameFieldHeightConstraint;
@property (nonatomic, strong) ARSentenceCaseButton *showPasswordButton;

@end


@implementation ARLoginFieldsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _nameField = [[ARTextFieldWithPlaceholder alloc] init];
        _emailField = [[ARTextFieldWithPlaceholder alloc] init];
        _passwordField = [[ARSecureTextFieldWithPlaceholder alloc] init];
        _showPasswordButton = [[ARSentenceCaseButton alloc] init];
    }
    return self;
}

- (void)setupForLoginWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = YES;
    self.passwordField.hidden = NO;
    self.showPasswordButton.hidden = NO;
    self.nameField.hidden = YES;

    if (@available(iOS 12.0, *)) {
        self.passwordField.textContentType = UITextContentTypePassword;
    }
}

- (void)setupForSignUpWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.passwordField.returnKeyType = UIReturnKeyNext;
}

- (void)setupForEmailWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = NO;
    self.passwordField.hidden = YES;
    self.showPasswordButton.hidden = YES;
    self.nameField.hidden = YES;

    if (@available(iOS 12.0, *)) {
        self.emailField.textContentType = UITextContentTypeEmailAddress;
    }
}

- (void)setupForPasswordWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    
    self.emailField.hidden = YES;
    self.passwordField.hidden = NO;
    self.showPasswordButton.hidden = NO;
    self.nameField.hidden = YES;
    
    NSDictionary *placeholderAttributes = @{NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0], NSForegroundColorAttributeName : [UIColor artsyGrayMedium]};
    [self.passwordField setPlaceholder:@"Create a password" withAttributes:placeholderAttributes];
    if (@available(iOS 12.0, *)) {
        self.passwordField.textContentType = UITextContentTypeNewPassword;
    }
}

- (void)setupForNameWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = YES;
    self.passwordField.hidden = YES;
    self.showPasswordButton.hidden = YES;
    self.nameField.hidden = NO;

    if (@available(iOS 12.0, *)) {
        self.nameField.textContentType = UITextContentTypeName;
    }
}

- (void)commonSetupWithLargeLayout:(BOOL)useLargeLayout
{
    NSDictionary *placeholderAttributes = @{NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0], NSForegroundColorAttributeName : [UIColor artsyGrayMedium]};
    
    [self.nameField setPlaceholder:@"Full Name" withAttributes:placeholderAttributes];
    [self.emailField setPlaceholder:@"Email" withAttributes:placeholderAttributes];
    [self.passwordField setPlaceholder:@"Password" withAttributes:placeholderAttributes];
    
    for (ARTextFieldWithPlaceholder *textfield in @[ self.nameField, self.emailField, self.passwordField ]) {
        [self addSubview:textfield];
        textfield.autocorrectionType = UITextAutocorrectionTypeNo;
        textfield.clearButtonMode = UITextFieldViewModeWhileEditing;
        textfield.font = [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0];
    }
    
    [self.showPasswordButton setTitle:@"SHOW" forState:UIControlStateNormal];
    [self.showPasswordButton setTitleColor:[UIColor artsyGrayMedium] forState:UIControlStateNormal];
    self.showPasswordButton.titleLabel.font = [UIFont sansSerifFontWithSize:14.0];
    self.showPasswordButton.titleLabel.textAlignment = NSTextAlignmentRight;
    [self.showPasswordButton addTarget:self action:@selector(toggleShowPassword:) forControlEvents:UIControlEventTouchUpInside];
    [self addSubview:self.showPasswordButton];
    
    [self.showPasswordButton alignTopEdgeWithView:self predicate:@"30"];
    [self.showPasswordButton constrainWidth:@"80" height:@"54"];
    [self.showPasswordButton alignTrailingEdgeWithView:self predicate:@"-1"];
    
    self.nameFieldHeightConstraint = [self.nameField constrainHeight:@"54"];
    [self.emailField constrainHeight:@"54"];
    [self.passwordField constrainHeight:@"54"];
    
    [self.nameField alignTopEdgeWithView:self predicate:@"30"];
    [self.emailField alignTopEdgeWithView:self predicate:@"30"];
    [self.passwordField alignTopEdgeWithView:self predicate:@"30"];
    
    self.emailField.hidden = YES;
    self.nameField.hidden = YES;
    self.passwordField.hidden = YES;
    self.showPasswordButton.hidden = YES;
    
    [self.nameField alignLeadingEdgeWithView:self predicate:@"20"];
    [self.nameField alignTrailingEdgeWithView:self predicate:@"-20"];
    
    [self.emailField alignLeadingEdgeWithView:self predicate:@"20"];
    [self.emailField alignTrailingEdgeWithView:self predicate:@"-20"];
    
    [self.passwordField alignLeadingEdgeWithView:self predicate:@"20"];
    [self.passwordField alignTrailingEdgeWithView:self predicate:@"-20"];
    
    self.emailField.baseline.backgroundColor = [UIColor blackColor].CGColor;
    self.passwordField.baseline.backgroundColor = [UIColor blackColor].CGColor;
    self.nameField.baseline.backgroundColor = [UIColor blackColor].CGColor;
    
    self.nameField.autocapitalizationType = UITextAutocapitalizationTypeWords;
    self.nameField.returnKeyType = UIReturnKeyNext;

    if (@available(iOS 10.0, *)) {
        self.nameField.textContentType = UITextContentTypeName;
    }

    self.emailField.keyboardType = UIKeyboardTypeEmailAddress;
    self.emailField.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.emailField.returnKeyType = UIReturnKeyNext;

    if (@available(iOS 10.0, *)) {
        self.emailField.textContentType = UITextContentTypeEmailAddress;
    }

    self.passwordField.returnKeyType = UIReturnKeyNext;
    self.passwordField.secureTextEntry = YES;

    if (@available(iOS 12.0, *)) {
        self.passwordField.textContentType = UITextContentTypeNewPassword;
    } else if (@available(iOS 11.0, *)) {
        self.passwordField.textContentType = UITextContentTypePassword;
    }
}

- (void)toggleShowPassword:(id)sender
{
    self.passwordField.secureTextEntry = !self.passwordField.secureTextEntry;
    NSString *titleText = self.passwordField.secureTextEntry ? @"SHOW" : @"HIDE";
    [self.showPasswordButton setTitle:titleText forState:UIControlStateNormal];
    
}

- (void)enableErrorState
{
    self.passwordField.baseline.backgroundColor = [UIColor artsyRedRegular].CGColor;
    self.emailField.baseline.backgroundColor = [UIColor artsyRedRegular].CGColor;
}

- (void)disableErrorState
{
    self.passwordField.baseline.backgroundColor = [UIColor blackColor].CGColor;
    self.emailField.baseline.backgroundColor = [UIColor blackColor].CGColor;
}

@end
