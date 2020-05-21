#import "ARHomeComponentViewController.h"
#import "ARAnalytics.h"

@implementation ARHomeComponentViewController

- (instancetype)init
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(nullable AREmission*)emission;
{
    return [super initWithEmission:emission
                        moduleName:@"Home"
                 initialProperties:@{}];
}

- (void)showAlertWithTitle:(NSString *)title message:(NSString *)message;
{
    UIAlertController *alert = [UIAlertController
                                          alertControllerWithTitle:title
                                          message:message
                                          preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_Nonnull action) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }];
    [alert addAction:okAction];
    [self presentViewController:alert animated:YES completion:nil];
}

#pragma mark - Email Confirmation

- (void)showEmailConfirmedAlertWithCode:(NSString *)confirmationMessageCode;
{
    NSDictionary *confirmationDict = [self confirmationMessageForCode:confirmationMessageCode];
    if (confirmationDict != nil) {
        NSString *confirmationTitle = confirmationDict[@"title"];
        NSString *confirmationMessage = confirmationDict[@"message"];
        [self showAlertWithTitle:confirmationTitle message:confirmationMessage];
    } else {
        NSString *unsupportedConfirmationCodeEvent = [NSString stringWithFormat:@"Unsupported confirmation code: %@", confirmationMessageCode];
        [ARAnalytics event:unsupportedConfirmationCodeEvent];
    }
}

- (NSDictionary *_Nullable)confirmationMessageForCode:(NSString *)confirmationCode {
    NSDictionary *confirmationMessages = @{
       @"confirmed" : @{
           @"title": @"Email Confirmed",
           @"message": @"Your email has been confirmed."
       },
       @"already_confirmed": @{
           @"title": @"Already Confirmed",
           @"message": @"You have already confirmed your email."
       },
       @"invalid_token": @{
           @"title": @"Error",
           @"message": @"Your token is invalid. Please try again."
       },
       @"blank_token": @{
           @"title": @"Error",
           @"message": @"No token found. Please try again."
       },
       @"expired_token": @{
           @"title": @"Error",
           @"message": @"An error has occurred. Please try again."
       }
    };
    return confirmationMessages[confirmationCode];
}

@end
