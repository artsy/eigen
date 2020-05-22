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

#pragma mark - User Messaging - Email Confirmation

- (void)showMessageAlertWithCode:(NSString *)messageCode;
{
    NSDictionary *messageDict = [self messageForCode:messageCode];
    if (messageDict != nil) {
        NSString *messageTitle = messageDict[@"title"];
        NSString *messageBody = messageDict[@"message"];
        [self showAlertWithTitle:messageTitle message:messageBody];
    } else {
        NSString *unsupportedMessageCodeEvent = [NSString stringWithFormat:@"Unsupported message code: %@", messageCode];
        [ARAnalytics event:unsupportedMessageCodeEvent];
    }
}

- (NSDictionary *_Nullable)messageForCode:(NSString *)messageCode {
    NSDictionary *messages = @{
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
           @"message": @"An error has occurred. Please contact support@artsy.net."
       },
       @"blank_token": @{
           @"title": @"Error",
           @"message": @"An error has occurred. Please contact support@artsy.net."
       },
       @"expired_token": @{
           @"title": @"Link Expired",
           @"message": @"Link expired. Please request a new verification email below."
       }
    };
    return messages[messageCode];
}

@end
