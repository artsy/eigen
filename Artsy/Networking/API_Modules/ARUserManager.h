#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

extern NSString *const ARUserSessionStartedNotification;

@class User;

@interface ARUserManager : NSObject

+ (ARUserManager *)sharedManager;

+ (void)logoutWithCompletion:(RCTPromiseResolveBlock)completion;
+ (void)clearUserData;
+ (void)clearAccessToken;

+ (BOOL)didCreateAccountThisSession;

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

- (void)disableSharedWebCredentials;
- (void)tryStoreSavedCredentialsToWebKeychain;

- (void)handleAuthState:(NSString *)token
       expiryDateString:(NSString *)expiryDateString
                   JSON: (id) JSON;
@end
