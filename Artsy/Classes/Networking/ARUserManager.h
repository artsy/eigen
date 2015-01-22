#import <Foundation/Foundation.h>

@interface ARUserManager : NSObject

+ (ARUserManager *)sharedManager;

+ (void)identifyAnalyticsUser;

- (User *)currentUser;
- (void)storeUserData;

@property (nonatomic, strong) NSString *trialUserName;
@property (nonatomic, strong) NSString *trialUserEmail;
@property (nonatomic, strong, readonly) NSString *trialUserUUID;

- (void)resetTrialUserUUID;

- (BOOL)hasExistingAccount;
- (BOOL)hasValidAuthenticationToken;
- (BOOL)hasValidXAppToken;

- (void)logout;

- (void)startTrial:(void(^)())callback failure:(void (^)(NSError *error))failure;

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
   successWithCredentials:(void(^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void(^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure;

- (void)loginWithFacebookToken:(NSString *)token
        successWithCredentials:(void(^)(NSString *accessToken, NSDate *expirationDate))credentials
                       gotUser:(void(^)(User *currentUser))gotUser
         authenticationFailure:(void (^)(NSError *error))authenticationFailure
                networkFailure:(void (^)(NSError *error))networkFailure;

- (void)loginWithTwitterToken:(NSString *)token
                       secret:(NSString *)secret
       successWithCredentials:(void(^)(NSString *accessToken, NSDate *expirationDate))credentials
                      gotUser:(void(^)(User *currentUser))gotUser
        authenticationFailure:(void (^)(NSError *error))authenticationFailure
               networkFailure:(void (^)(NSError *error))networkFailure;

- (void)createUserWithName:(NSString *)name email:(NSString *)email password:(NSString *)password success:(void(^)(User *user))success failure:(void (^)(NSError *error, id JSON))failure;
- (void)createUserViaFacebookWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name success:(void(^)(User *user))success failure:(void (^)(NSError *error, id JSON))failure;
- (void)createUserViaTwitterWithToken:(NSString *)token secret:(NSString *)secret email:(NSString *)email name:(NSString *)name success:(void(^)(User *user))success failure:(void (^)(NSError *error, id JSON))failure;

- (void)sendPasswordResetForEmail:(NSString *)email success:(void(^)(void))success failure:(void (^)(NSError *error))failure;

@end
