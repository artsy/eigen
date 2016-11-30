#import "ARAuthProviders.h"
#import "ARNetworkConstants.h"
#import "ARLogger.h"

#import <AFOAuth1Client/AFOAuth1Client.h>
#import <AFOAuth1Client/AFOAuth1Token.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import <Keys/ArtsyKeys.h>


@implementation ARAuthProviders

+ (void)getReverseAuthTokenForTwitter:(void (^)(NSString *token, NSString *secret))success failure:(void (^)(NSError *))failure
{
    NSParameterAssert(success);
    AFOAuth1Client *client = nil;
    client = [[AFOAuth1Client alloc] initWithBaseURL:[NSURL URLWithString:@"https://api.twitter.com/"]
                                                 key:[ArtsyKeys new].artsyTwitterKey
                                              secret:[ArtsyKeys new].artsyTwitterSecret];


    [client authorizeUsingOAuthWithRequestTokenURLString:@"/oauth/request_token"
        userAuthorizationURLString:@"/oauth/authorize"
        callbackURL:[NSURL URLWithString:ARTwitterCallbackPath]
        accessTokenURLString:@"/oauth/access_token"
        accessMethod:@"POST"
        scope:nil
        success:^(AFOAuth1Token *accessToken, id responseObject) {
            success(accessToken.key, accessToken.secret);
        }
        failure:^(NSError *error) {
        if (failure) {
            failure(error);
        }
        }];
}

+ (void)getTokenForFacebook:(void (^)(NSString *token, NSString *email, NSString *name))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);

    FBSDKLoginManager *login = [[FBSDKLoginManager alloc] init];
    [login logInWithReadPermissions:@[ @"email" ] fromViewController:nil handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
        if (error) {
            ARErrorLog(@"Failed to log in to Facebook: %@", error.localizedDescription);
            failure(error);
        } else if (result.isCancelled) {
            failure(nil);

        } else if (!error && !result.token) {
          NSString *description = error ? [error description] : @"token was nil";
          [ARAnalytics event:ARAnalyticsErrorFailedToGetFacebookCredentials withProperties:@{ @"error" : description }];
          ARErrorLog(@"Couldn't get Facebook credentials");
          failure(error);

        } else {
            FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc] initWithGraphPath:@"me?fields=name,id,email" parameters:nil];
            [request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, NSDictionary *user, NSError *error) {
                if (!error) {
                    
                    NSString *email = user[@"email"];
                    NSString *name = user[@"name"];
                    success(result.token.tokenString, email, name);
                } else {
                    ARErrorLog(@"Couldn't get user info from Facebook");
                    failure(error);
                }
            }];
        }
    }];
}

@end
