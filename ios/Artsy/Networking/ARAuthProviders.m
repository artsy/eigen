#import "ARAuthProviders.h"
#import "ARNetworkConstants.h"
#import "ARLogger.h"

#import <AFOAuth1Client/AFOAuth1Client.h>
#import <AFOAuth1Client/AFOAuth1Token.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

#import <Emission/AREmission.h>
#import "ARAnalyticsConstants.h"
#import <react-native-config/ReactNativeConfig.h>

@implementation ARAuthProviders

+ (void)getTokenForFacebook:(void (^)(NSString *token, NSString *email, NSString *name))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);

    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logInWithPermissions:@[@"email"]
    fromViewController:nil
               handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error) {
            ARErrorLog(@"Failed to log in to Facebook: %@", error.localizedDescription);
            failure(error);
        } else if (result.isCancelled) {
            failure(nil);

        } else if (!error && !result.token) {
          NSString *description = error ? [error description] : @"token was nil";
          [[AREmission sharedInstance] sendEvent:ARAnalyticsErrorFailedToGetFacebookCredentials traits:@{ @"error" : description }];
          ARErrorLog(@"Couldn't get Facebook credentials");
          failure(error);

        } else {
            FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc] initWithGraphPath:@"me?fields=name,id,email" parameters:@{ @"message" : @"This is a status update" }];

            // We need to disable FB's in-house error reporting so we can show our own
            [request setGraphErrorRecoveryDisabled:YES];
            [request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, NSDictionary *user, NSError *error) {
                if (!error) {
                    NSString *email = user[@"email"];
                    NSString *name = user[@"name"];
                    success([FBSDKAccessToken currentAccessToken].tokenString, email, name);
                } else {
                    ARErrorLog(@"Couldn't get user info from Facebook");
                    failure(error);
                }
            }];
        }
    }];
}

+ (void)getTokenForAppleWithDelegate:(id <ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>)delegate {
    ASAuthorizationAppleIDProvider *appleIDProvider = [[ASAuthorizationAppleIDProvider alloc] init];
    ASAuthorizationAppleIDRequest *request = [appleIDProvider createRequest];
    [request setRequestedScopes:@[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail]];
    ASAuthorizationController *authController = [[ASAuthorizationController alloc] initWithAuthorizationRequests: @[request]];
    [authController setDelegate: delegate];
    [authController setPresentationContextProvider: delegate];
    [authController performRequests];
}

@end
