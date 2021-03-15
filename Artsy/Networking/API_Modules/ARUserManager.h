#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

extern NSString *const ARUserSessionStartedNotification;

@class User;

@interface ARUserManager : NSObject

+ (ARUserManager *)sharedManager;

+ (void)logoutWithCompletion:(RCTPromiseResolveBlock)completion;
+ (void)clearUserData;

+ (BOOL)didCreateAccountThisSession;

+ (void)identifyAnalyticsUser;

- (User *)currentUser;
- (void)storeUserData;

@property (nonatomic, readonly) NSString *appleEmail;
@property (nonatomic, readonly) NSString *appleDisplayName;

- (void)storeAppleDisplayName:(NSString *)displayName email:(NSString *)email;
- (void)resetAppleStoredCredentials;

@property (nonatomic, strong) NSString *localTemporaryUserName;
@property (nonatomic, strong) NSString *localTemporaryUserEmail;
@property (nonatomic, strong, readonly) NSString *localTemporaryUserUUID;

@property (nonatomic, strong) NSString *userAuthenticationToken;

- (void)resetLocalTemporaryUserUUID;

- (BOOL)hasExistingAccount;
- (BOOL)hasValidAuthenticationToken;
- (BOOL)hasValidXAppToken;

/// Gets a new auth token by using the user/pass from keychain
- (void)tryReLoginWithKeychainCredentials:(void (^)(User *currentUser))success authenticationFailure:(void (^)(NSError *error))authError;

- (void)disableSharedWebCredentials;
- (void)tryStoreSavedCredentialsToWebKeychain;
- (void)tryLoginWithSharedWebCredentials:(void (^)(NSError *error))completion;

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
   successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void (^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure;

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
   successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void (^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure
 saveSharedWebCredentials:(BOOL)saveSharedWebCredentials;

- (void)loginWithFacebookToken:(NSString *)token
        successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                       gotUser:(void (^)(User *currentUser))gotUser
         authenticationFailure:(void (^)(NSError *error))authenticationFailure
                networkFailure:(void (^)(NSError *error))networkFailure;

- (void)loginWithAppleUID:(NSString *)appleUID
                  idToken:(NSString *)idToken
     successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                    gotUser:(void (^)(User *currentUser))gotUser
      authenticationFailure:(void (^)(NSError *error))authenticationFailure
             networkFailure:(void (^)(NSError *error))networkFailure;

- (void)createUserWithName:(NSString *)name
                     email:(NSString *)email
                  password:(NSString *)password
                   success:(void (^)(User *user))success
                   failure:(void (^)(NSError *error, id JSON))failure;

- (void)createUserWithName:(NSString *)name
                     email:(NSString *)email
                  password:(NSString *)password
                   success:(void (^)(User *))success
                   failure:(void (^)(NSError *error, id JSON))failure
  saveSharedWebCredentials:(BOOL)saveSharedWebCredentials;

- (void)createUserViaFacebookWithToken:(NSString *)token
                                 email:(NSString *)email
                                  name:(NSString *)name
                               success:(void (^)(User *user))success
                               failure:(void (^)(NSError *error, id JSON))failure;

- (void)createUserViaAppleWithUID:(NSString *)appleUID
                          idToken:(NSString *)idToken
                            email:(NSString *)email
                             name:(NSString *)name
                          success:(void (^)(User *user))success
                          failure:(void (^)(NSError *error, id JSON))failure;

- (void)sendPasswordResetForEmail:(NSString *)email
                          success:(void (^)(void))success
                          failure:(void (^)(NSError *error))failure;

@end
