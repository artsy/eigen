#import "ARLoginFieldsView.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARSecureTextFieldWithPlaceholder.h"

#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARLoginFieldsView ()

@property (nonatomic, strong) ARTextFieldWithPlaceholder *nameField;
@property (nonatomic, strong) ARTextFieldWithPlaceholder *emailField;
@property (nonatomic, strong) ARSecureTextFieldWithPlaceholder *passwordField;

@end


@implementation ARLoginFieldsView

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        _nameField = [[ARTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
        _emailField = [[ARTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
        _passwordField = [[ARSecureTextFieldWithPlaceholder alloc] initWithFrame:CGRectZero];
    }
    return self;
}


- (void)setupForLogin
{
    [self commonSetup];
    //    self.nameField.hidden = YES;
}

- (void)setupForSignUp
{
    [self commonSetup];
}


- (void)commonSetup
{
    [self.nameField setPlaceholder:@"Full Name"];
    [self.emailField setPlaceholder:@"Email"];
    [self.passwordField setPlaceholder:@"Password"];

    [self addSubview:self.nameField];
    [self addSubview:self.emailField];
    [self addSubview:self.passwordField];

    NSArray *textFields = @[ self.nameField, self.emailField, self.passwordField ];

    [self.emailField constrainWidthToView:self predicate:@"0"];
    [self.emailField constrainHeight:@"40"];

    [UIView equalWidthForViews:textFields];
    [UIView equalHeightForViews:textFields];

    [self.nameField alignCenterXWithView:self predicate:@"0"];
    [self.emailField alignCenterXWithView:self predicate:@"0"];
    [self.passwordField alignCenterXWithView:self predicate:@"0"];

    [self.nameField alignTopEdgeWithView:self predicate:@"5"];
    [self.emailField constrainTopSpaceToView:self.nameField predicate:@"5"];
    [self.passwordField constrainTopSpaceToView:self.emailField predicate:@"5"];
}

@end
