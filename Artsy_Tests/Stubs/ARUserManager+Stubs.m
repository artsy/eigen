#import "ARUserManager+Stubs.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <SDWebImage/SDWebImageManager.h>


@implementation ARUserManager (Stubs)

+ (NSString *)stubAccessToken { return @"access token"; };
+ (NSString *)stubAccessTokenExpiresIn { return @"2035-01-02T21:42:21-0500"; };
+ (NSString *)stubXappToken { return @"xapp token"; };
+ (NSString *)stubXappTokenExpiresIn { return @"2035-01-02T21:42:21-0500"; };
+ (NSString *)stubUserID { return @"4d78f315faf6426b4f000011"; };
+ (NSString *)stubUserEmail { return @"user@example.com"; };
+ (NSString *)stubUserPassword { return @"password"; };
+ (NSString *)stubUserName { return @"Joe Shmoe"; };

+ (void)stubAccessToken:(NSString *)accessToken expiresIn:(NSString *)expiresIn
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/oauth2/access_token" withResponse:@{ @"access_token" : accessToken,
                                                                                @"expires_in" : expiresIn }];
}

+ (void)stubXappToken:(NSString *)xappToken expiresIn:(NSString *)expiresIn
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{ @"xapp_token" : xappToken,
                                                                              @"expires_in" : expiresIn }];
}

+ (void)stubMe:(NSString *)userID email:(NSString *)email name:(NSString *)name
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me" withResponse:@{ @"id" : userID,
                                                                      @"email" : email,
                                                                      @"name" : name }];
}

+ (void)stubAndLoginWithUsername
{
    [self stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
    [self stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];

    [self stubbedLoginWithUsername:[ARUserManager stubUserEmail]
                          password:[ARUserManager stubUserPassword]
            successWithCredentials:nil
                           gotUser:nil
             authenticationFailure:nil
                    networkFailure:nil];
}

+ (void)stubbedLoginWithUsername:(NSString *)username password:(NSString *)password
          successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                         gotUser:(void (^)(User *currentUser))success
           authenticationFailure:(void (^)(NSError *error))authFail
                  networkFailure:(void (^)(NSError *error))networkFailure
{
    [[SDWebImageManager sharedManager] cancelAll];

    __block BOOL done = NO;
    [[ARUserManager sharedManager]
        loginWithUsername:[ARUserManager stubUserEmail]
        password:[ARUserManager stubUserPassword]
        successWithCredentials:^(NSString *accessToken, NSDate *tokenExpiryDate) {
         if (credentials) {
             credentials(accessToken, tokenExpiryDate);
         }
        }
        gotUser:^(User *currentUser) {
         if (success) {
             success(currentUser);
         }
             done = YES;
        }
        authenticationFailure:^(NSError *error) {
         if (authFail) {
             authFail(error);
         }
         done = YES;
        }
        networkFailure:^(NSError *error) {
         if (networkFailure) {
             networkFailure(error);
         }
         done = YES;
        }];

    while (!done) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
}

+ (void)stubAndLoginWithFacebookToken
{
    [self stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
    [self stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];

    [self stubbedLoginWithFacebookToken:@"facebok token"
                 successWithCredentials:nil
                                gotUser:nil
                  authenticationFailure:nil
                         networkFailure:nil];
}

+ (void)stubbedLoginWithFacebookToken:(NSString *)token
               successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                              gotUser:(void (^)(User *))success
                authenticationFailure:(void (^)(NSError *error))authFail
                       networkFailure:(void (^)(NSError *))networkFailure
{
    __block BOOL done = NO;
    [[ARUserManager sharedManager]
        loginWithFacebookToken:token
        successWithCredentials:^(NSString *accessToken, NSDate *tokenExpiryDate) {
        if (credentials) {
            credentials(accessToken, tokenExpiryDate);
        }
        }
        gotUser:^(User *currentUser) {
         if (success) {
             success(currentUser);
         }
         done = YES;
        }
        authenticationFailure:^(NSError *error) {
        if (authFail) {
            authFail(error);
        }
        done = YES;
        }
        networkFailure:^(NSError *error) {
         if (networkFailure) {
             networkFailure(error);
         }
         done = YES;
        }];

    while (!done) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
}

+ (void)stubAndLoginWithTwitterToken {
    // nop
}

+ (void)stubbedLoginWithTwitterToken:(NSString *)token
                              secret:(NSString *)secret
              successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                             gotUser:(void (^)(User *))success
               authenticationFailure:(void (^)(NSError *error))authFail
                      networkFailure:(void (^)(NSError *))networkFailure
{
    // nop
}

#pragma mark -
#pragma mark Utilities

+ (NSString *)userDataPath
{
    NSString *userID = [[NSUserDefaults standardUserDefaults] objectForKey:ARUserIdentifierDefault];
    if (!userID) {
        return nil;
    }
    NSArray *directories = [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask];
    NSString *documentsPath = [[directories lastObject] relativePath];
    return [[documentsPath stringByAppendingPathComponent:userID] stringByAppendingPathComponent:@"User.data"];
}

@end
