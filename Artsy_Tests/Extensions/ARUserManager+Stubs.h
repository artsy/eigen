#import "ARUserManager.h"


@interface ARUserManager (Stubs)

+ (NSString *)stubAccessToken;
+ (NSString *)stubAccessTokenExpiresIn;
+ (NSString *)stubXappToken;
+ (NSString *)stubXappTokenExpiresIn;
+ (NSString *)stubUserID;
+ (NSString *)stubUserEmail;
+ (NSString *)stubUserPassword;
+ (NSString *)stubUserName;

+ (void)stubAccessToken:(NSString *)accessToken expiresIn:(NSString *)expiresIn;
+ (void)stubXappToken:(NSString *)xappToken expiresIn:(NSString *)expiresIn;
+ (void)stubMe:(NSString *)userID email:(NSString *)email name:(NSString *)name;
+ (void)stubAndLoginWithUsername;
+ (void)stubbedLoginWithUsername:(NSString *)username password:(NSString *)password
          successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                         gotUser:(void (^)(User *currentUser))success
           authenticationFailure:(void (^)(NSError *error))authFail
                  networkFailure:(void (^)(NSError *error))networkFailure;
+ (void)stubAndLoginWithFacebookToken;
+ (void)stubbedLoginWithFacebookToken:(NSString *)token
               successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                              gotUser:(void (^)(User *))success
                authenticationFailure:(void (^)(NSError *error))authFail
                       networkFailure:(void (^)(NSError *))networkFailure;
+ (void)stubAndLoginWithTwitterToken;
+ (void)stubbedLoginWithTwitterToken:(NSString *)token
                              secret:(NSString *)secret
              successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                             gotUser:(void (^)(User *))success
               authenticationFailure:(void (^)(NSError *error))authFail
                      networkFailure:(void (^)(NSError *))networkFailure;
+ (NSString *)userDataPath;

@end
