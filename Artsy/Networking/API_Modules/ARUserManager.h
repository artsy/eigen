#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

extern NSString *const ARUserSessionStartedNotification;

@class User;

@interface ARUserManager : NSObject

+ (ARUserManager *)sharedManager;

+ (void)clearUserData;
+ (void)clearAccessToken;

- (User *)currentUser;
- (void)storeUserData;

@property (nonatomic, strong) NSString *userAuthenticationToken;

- (BOOL)hasExistingAccount;
- (BOOL)hasValidAuthenticationToken;

- (void)disableSharedWebCredentials;

- (void)handleAuthState:(NSString *)token
       expiryDateString:(NSString *)expiryDateString
                   JSON: (id) JSON;

- (void)testOnly_setupUser:(NSString *)username;

@end
