#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

extern NSString *const ARUserSessionStartedNotification;

@class User;

@interface ARUserManager : NSObject

@property (nonatomic, strong) NSString *userAuthenticationToken;

+ (ARUserManager *)sharedManager;

+ (void)clearUserData;
+ (void)clearAccessToken;

- (User *)currentUser;
- (void)storeUserData;

- (BOOL)hasExistingAccount;
- (BOOL)hasValidAuthenticationToken;

- (void)disableSharedWebCredentials;

- (void)handleAuthState:(NSString *)token
       expiryDateString:(NSString *)expiryDateString
                   JSON: (id) JSON;

// Dev utilities
- (void)testOnly_setupUser:(NSString *)username;
+ (void)softClearUserData;
+ (void)softRestoreUserData;

@end
