#import "ARAuthProviders.h"
#import "ARNetworkConstants.h"
#import "AFOAuth1Client.h"
#import "FBSession.h"
#import "FBRequest.h"
#import "FBAccessTokenData.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import <CocoaPods-Keys/ArtsyKeys.h>

@implementation ARAuthProviders

+ (void)getReverseAuthTokenForTwitter:(void(^)(NSString *token, NSString *secret))success failure:(void (^)(NSError *))failure
{
    NSParameterAssert(success);
    AFOAuth1Client *client = nil;
    client = [[AFOAuth1Client alloc] initWithBaseURL:[NSURL URLWithString:@"https://api.twitter.com/"]
                                                 key:[ArtsyKeys new].artsyTwitterKey
                                              secret:[ArtsyKeys new].artsyTwitterSecret];

    [client authorizeUsingOAuthWithRequestTokenPath:@"/oauth/request_token"
                              userAuthorizationPath:@"/oauth/authorize"
                                        callbackURL:[NSURL URLWithString:ARTwitterCallbackPath]
                                    accessTokenPath:@"/oauth/access_token"
                                       accessMethod:@"POST" scope:nil
    success:^(AFOAuth1Token *accessToken, id responseObject) {
        success(accessToken.key, accessToken.secret);
    } failure:^(NSError *error) {
        if (failure) {
            failure(error);
        }
    }];

}

+ (void)getTokenForFacebook:(void (^)(NSString *token, NSString *email, NSString *name))success failure:(void (^)(NSError *))failure
{
    NSParameterAssert(success);
    [FBSession openActiveSessionWithReadPermissions:@[@"public_profile", @"email"]
                                       allowLoginUI:YES
      completionHandler:^(FBSession *session,
                          FBSessionState status,
                          NSError *error) {

          // If we open a new session while the old one is active
          // the old one calls this handler to let us know it's closed
          // but guess what, Facebook? We don't care
          
          if (status == FBSessionStateClosed) {
              return;
          }

          NSString *token = [[session accessTokenData] accessToken];

          if (!error && token) {
              [[FBRequest requestForMe]
               startWithCompletionHandler:^(FBRequestConnection *connection, NSDictionary<FBGraphUser> *user, NSError *error) {
                   if (!error) {
                       NSString *email = user[@"email"];
                       NSString *name = user[@"name"];
                       success(token, email, name);
                   } else {
                       ARErrorLog(@"Couldn't get user info from Facebook");
                       failure(error);
                   }
               }];
          } else {
              NSString *description = error ? [error description] : @"token was nil";
              [ARAnalytics event:ARAnalyticsErrorFailedToGetFacebookCredentials withProperties:@{ @"error" : description }];
              ARErrorLog(@"Couldn't get Facebook credentials");
              failure(error);
          }
      }];
}

@end
