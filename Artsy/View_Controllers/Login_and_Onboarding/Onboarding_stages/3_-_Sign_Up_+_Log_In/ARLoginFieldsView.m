#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"
#import "UIColor+ArtsyColors.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARLoginFieldsView ()

@property (nonatomic, strong) NSLayoutConstraint *nameFieldHeightConstraint;

@end


@implementation ARLoginFieldsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _nameField = [[ARTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
        _emailField = [[ARTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
        _passwordField = [[ARSecureTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
    }
    return self;
}

- (void)setupForLoginWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = YES;
    self.passwordField.hidden = NO;
    self.nameField.hidden = YES;
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
    self.nameField.hidden = YES;
}

- (void)setupForPasswordWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = YES;
    self.passwordField.hidden = NO;
    self.nameField.hidden = YES;
    
    NSDictionary *placeholderAttributes = @{NSFontAttributeName : [UIFont serifFontWithSize:useLargeLayout ? 26.0 : 20.0], NSForegroundColorAttributeName : [UIColor artsyGrayMedium]};
    [self.passwordField setPlaceholder:@"Create a password" withAttributes:placeholderAttributes];
}

- (void)setupForNameWithLargeLayout:(BOOL)useLargeLayout
{
    [self commonSetupWithLargeLayout:useLargeLayout];
    self.emailField.hidden = YES;
    self.passwordField.hidden = YES;
    self.nameField.hidden = NO;
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

    self.nameFieldHeightConstraint = [self.nameField constrainHeight:@"54"];
    [self.emailField constrainHeight:@"54"];
    [self.passwordField constrainHeight:@"54"];

    [self.nameField alignTopEdgeWithView:self predicate:@"30"];
    [self.emailField alignTopEdgeWithView:self predicate:@"30"];
    [self.passwordField alignTopEdgeWithView:self predicate:@"30"];
    
    self.emailField.hidden = YES;
    self.nameField.hidden = YES;
    self.passwordField.hidden = YES;
    
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

    self.emailField.keyboardType = UIKeyboardTypeEmailAddress;
    self.emailField.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.emailField.returnKeyType = UIReturnKeyNext;
    
    self.passwordField.returnKeyType = UIReturnKeyNext;
    self.passwordField.secureTextEntry = YES;
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
