#import "ARAuthValidator.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ARUserManager.h"
#import "ARAppDelegate.h"
#import "ARAppDelegate+Emission.h"

@implementation ARAuthValidator

+ ( void)validateAuthCredentialsAreCorrect
{
    [ArtsyAPI getMeHEADWithSuccess:^ {
        // NOOP because this means everything is OK
    } failure:^(NSHTTPURLResponse *response, NSError * _Nonnull error) {
        if (response.statusCode == 401){
            // We hit a 401 so we need to be a bit worried about this
            ARUserManager *manager = [ARUserManager sharedManager];
            [manager tryReLoginWithKeychainCredentials:^(User *currentUser) {
                [[ARAppDelegate sharedInstance] setupEmission];

            } authenticationFailure:^(NSError *error) {
                UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Session expired" message:@"Please log in to continue" preferredStyle:UIAlertControllerStyleAlert];

                UIAlertAction *defaultAction = [UIAlertAction actionWithTitle:@"Continue" style:UIAlertActionStyleDestructive handler:^(UIAlertAction *action) {
                   [ARUserManager logout];
                }];

                [alert addAction:defaultAction];
                [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
            }];
        }
    }];
}

@end
