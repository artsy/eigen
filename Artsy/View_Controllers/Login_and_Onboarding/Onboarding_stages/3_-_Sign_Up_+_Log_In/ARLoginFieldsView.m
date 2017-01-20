#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"

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
    self.passwordField.returnKeyType = UIReturnKeyDone;
}

- (void)setupForSignUp
{
    [self commonSetup];
    self.passwordField.returnKeyType = UIReturnKeyJoin;
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

    [self.nameField constrainWidthToView:self predicate:@"0"];
    [self.emailField constrainWidthToView:self predicate:@"0"];
    [self.passwordField constrainWidthToView:self predicate:@"0"];

    [self.nameField alignCenterXWithView:self predicate:@"0"];
    [self.emailField alignCenterXWithView:self predicate:@"0"];
    [self.passwordField alignCenterXWithView:self predicate:@"0"];

    [self.nameField alignTopEdgeWithView:self predicate:@"5"];
    [self.emailField constrainTopSpaceToView:self.nameField predicate:@"5"];
    [self.passwordField constrainTopSpaceToView:self.emailField predicate:@"5"];

    self.nameField.autocapitalizationType = UITextAutocapitalizationTypeWords;
    self.nameField.returnKeyType = UIReturnKeyNext;

    self.emailField.keyboardType = UIKeyboardTypeEmailAddress;
    self.emailField.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.emailField.returnKeyType = UIReturnKeyNext;

    self.passwordField.secureTextEntry = YES;
}

@end
