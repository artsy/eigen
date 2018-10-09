#import "ARAuthValidator.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ARUserManager.h"
#import "ARAppDelegate.h"
#import "ARAppDelegate+Emission.h"

@implementation ARAuthValidator

+ ( void)validateAuthCredentialsAreCorrect
{
    [ArtsyAPI getMeHEADWithSuccess:^ {
        // NO OP
    } failure:^(NSError * _Nonnull error) {
        NSString *serverTDLR = [error userInfo][@"NSLocalizedDescription"];
        if ([serverTDLR containsString:@"401"]){
            // We hit a 401 so we need to be a bit worried about this
            ARUserManager *manager = [ARUserManager sharedManager];
            [manager tryReLoginWithKeychainCredentials:^(User *currentUser) {
                [[ARAppDelegate sharedInstance] setupEmission];
            }];
        }
    }];
}

@end
