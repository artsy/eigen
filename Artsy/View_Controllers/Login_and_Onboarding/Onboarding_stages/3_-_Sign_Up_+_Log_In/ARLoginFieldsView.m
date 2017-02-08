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

- (void)setupForLogin
{
    [self commonSetup];
    [self.nameField removeConstraint:self.nameFieldHeightConstraint];
    [self.nameField constrainHeight:@"0"];
    self.nameField.hidden = YES;
    self.passwordField.returnKeyType = UIReturnKeyNext;
}

- (void)setupForSignUp
{
    [self commonSetup];
    self.passwordField.returnKeyType = UIReturnKeyNext;
}

- (void)setupForEmail
{
    [self commonSetup];
    self.emailField.hidden = NO;
    self.passwordField.hidden = YES;
    self.nameField.hidden = YES;
}

- (void)setupForPassword
{
    [self commonSetup];
    self.emailField.hidden = YES;
    self.passwordField.hidden = NO;
    self.nameField.hidden = YES;
}

- (void)setupForName
{
    [self commonSetup];
    self.emailField.hidden = YES;
    self.passwordField.hidden = YES;
    self.nameField.hidden = NO;
}

- (void)commonSetup
{
    [self.nameField setPlaceholder:@"Full Name"];
    [self.emailField setPlaceholder:@"Email"];
    [self.passwordField setPlaceholder:@"Password"];

    for (ARTextFieldWithPlaceholder *textfield in @[ self.nameField, self.emailField, self.passwordField ]) {
        [self addSubview:textfield];
        textfield.autocorrectionType = UITextAutocorrectionTypeNo;
        textfield.clearButtonMode = UITextFieldViewModeWhileEditing;
    }

    self.nameFieldHeightConstraint = [self.nameField constrainHeight:@"54"];
    [self.emailField constrainHeight:@"54"];
    [self.passwordField constrainHeight:@"54"];

//    [self.nameField constrainWidthToView:self predicate:@"0"];
//    [self.emailField constrainWidthToView:self predicate:@"0"];
//    [self.passwordField constrainWidthToView:self predicate:@"0"];

//    [self.nameField alignCenterXWithView:self predicate:@"0"];
//    [self.emailField alignCenterXWithView:self predicate:@"0"];
//    [self.passwordField alignCenterXWithView:self predicate:@"0"];

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
    
    self.emailField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:self.emailField.placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGrayMedium]}];
    self.passwordField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:self.passwordField.placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGrayMedium]}];
    self.nameField.attributedPlaceholder = [[NSAttributedString alloc] initWithString:self.nameField.placeholder attributes:@{NSForegroundColorAttributeName : [UIColor artsyGrayMedium]}];
    
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

@end
