#import <ISO8601DateFormatter/ISO8601DateFormatter.h>
#import <UICKeyChainStore/UICKeyChainStore.h>
#import <Adjust/Adjust.h>

#import "ARDefaults.h"
#import "ARUserManager.h"
#import "NSDate+Util.h"
#import "ARRouter.h"
#import "ARFileUtils.h"
#import "ArtsyAPI+Private.h"
#import "User.h"
#import "ARAppConstants.h"

#import "NSKeyedUnarchiver+ErrorLogging.h"
#import "ARAnalyticsConstants.h"
#import "ARKeychainable.h"
#import "ARSystemTime.h"
#import "ARLogger.h"
#import "ARTopMenuViewController.h"
#import "ARAppDelegate.h"
#import "ARSwitchBoard.h"

#import "MTLModel+JSON.h"
#import "AFHTTPRequestOperation+JSON.h"
#import "ARDispatchManager.h"

#import <ARAnalytics/ARAnalytics.h>
#import <Emission/AREmission.h>
#import <Emission/ARGraphQLQueryCache.h>

#import "RNCAsyncStorage.h"

NSString *const ARUserSessionStartedNotification = @"ARUserSessionStarted";

NSString *ARLocalTemporaryUserNameKey = @"ARLocalTemporaryUserName";
NSString *ARLocalTemporaryUserEmailKey = @"ARLocalTemporaryUserEmail";
NSString *ARLocalTemporaryUserUUID = @"ARLocalTemporaryUserUUID";

static BOOL ARUserManagerDisableSharedWebCredentials = NO;


@interface ARUserManager ()
@property (nonatomic, strong) NSObject<ARKeychainable> *keychain;
@property (nonatomic, strong) User *currentUser;
@property (nonatomic, assign) BOOL didCreateAccountThisSession;
@end


@implementation ARUserManager

+ (ARUserManager *)sharedManager
{
    static ARUserManager *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];
    });
    return _sharedManager;
}

+ (BOOL)didCreateAccountThisSession
{
    return self.sharedManager.didCreateAccountThisSession;
}

+ (void)identifyAnalyticsUser
{
    User *user = [User currentUser];
    NSString *anonymousID = self.sharedManager.localTemporaryUserUUID;

    [ARAnalytics setUserProperty:@"is_temporary_user" toValue:@(user == nil)];
    [ARAnalytics identifyUserWithID:user.userID anonymousID:anonymousID andEmailAddress:user.email];

    [Adjust addSessionPartnerParameter:@"anonymous_id" value:anonymousID];
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    NSString *userDataFolderPath = [self userDataPath];
    NSString *userDataPath = [userDataFolderPath stringByAppendingPathComponent:@"User.data"];

    if ([[NSFileManager defaultManager] fileExistsAtPath:userDataPath]) {
        _currentUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userDataPath exceptionBlock:^id(NSException *exception) {
            ARErrorLog(@"%@", exception.reason);
            [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:nil];
            return nil;
        }];

        // safeguard
        if (!_currentUser.userID) {
            ARErrorLog(@"Deserialized user %@ does not have an ID.", _currentUser);
            _currentUser = nil;
        }
    }

    _keychain = [[ARKeychain alloc] init];

    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARUserRequestedLogout" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        NSLog(@"Hey, we're logging out!");
        [[self class] clearUserData];
        [AREmission teardownSharedInstance];
        [ARTopMenuViewController teardownSharedInstance];
        [ARSwitchBoard teardownSharedInstance];
        [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
            // Sync clock with server
            [ARSystemTime sync];
            [[ARAppDelegate sharedInstance] showOnboarding];
        }];
    }];

    return self;
}

- (void)setCurrentUser:(User *)user;
{
    if (_currentUser != user) {
        _currentUser = user;
        if (user != nil) {
            [[NSNotificationCenter defaultCenter] postNotificationName:ARUserSessionStartedNotification object:self];
        }
    }
}

- (BOOL)hasExistingAccount
{
    return (self.currentUser && [self hasValidAuthenticationToken]);
}

- (BOOL)hasValidAuthenticationToken
{
    NSString *authToken = [self userAuthenticationToken];
    NSDate *expiryDate = [[NSUserDefaults standardUserDefaults] objectForKey:AROAuthTokenExpiryDateDefault];

    BOOL tokenValid = expiryDate && [[[ARSystemTime date] GMTDate] earlierDate:expiryDate] != expiryDate;
    return authToken && tokenValid;
}

- (BOOL)hasValidXAppToken
{
    NSString *xapp = [UICKeyChainStore stringForKey:ARXAppTokenKeychainKey];
    NSDate *expiryDate = [[NSUserDefaults standardUserDefaults] objectForKey:ARXAppTokenExpiryDateDefault];

    BOOL tokenValid = expiryDate && [[[ARSystemTime date] GMTDate] earlierDate:expiryDate] != expiryDate;
    return xapp && tokenValid;
}

- (NSString *)userAuthenticationToken
{
    return _userAuthenticationToken ?: [self.keychain keychainStringForKey:AROAuthTokenDefault];
}

- (void)saveUserOAuthToken:(NSString *)token expiryDate:(NSDate *)expiryDate
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [self.keychain setKeychainStringForKey:AROAuthTokenDefault value:token];
    [defaults setObject:expiryDate forKey:AROAuthTokenExpiryDateDefault];

    [self.keychain removeKeychainStringForKey:ARXAppTokenKeychainKey];
    [defaults removeObjectForKey:ARXAppTokenExpiryDateDefault];
    [defaults synchronize];
}

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
   successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void (^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure;
{
    [self loginWithUsername:username
                        password:password
          successWithCredentials:credentials
                         gotUser:gotUser
           authenticationFailure:authenticationFailure
                  networkFailure:networkFailure
        saveSharedWebCredentials:NO]; // This has been changed to NO because in the current onboarding flow we do not request this
}

- (void)loginWithUsername:(NSString *)username
                 password:(NSString *)password
   successWithCredentials:(void (^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void (^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure
 saveSharedWebCredentials:(BOOL)saveSharedWebCredentials;
{
    NSURLRequest *request = [ARRouter newOAuthRequestWithUsername:username password:password];

    AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request
        success:^(NSURLRequest *oauthRequest, NSHTTPURLResponse *response, id JSON) {

        NSString *token = JSON[AROAuthTokenKey];
        NSString *expiryDateString = JSON[AROExpiryDateKey];

        [ARRouter setAuthToken:token];
        [self storeUsername:username password:password];

        // Create an Expiration Date
        ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
        NSDate *expiryDate = [dateFormatter dateFromString:expiryDateString];

        // Let clients perform any actions once we've got the tokens sorted
        if (credentials) {
            credentials(token, expiryDate);
        }

        NSURLRequest *userRequest = [ARRouter newUserInfoRequest];
        AFHTTPRequestOperation *userOp = [AFHTTPRequestOperation JSONRequestOperationWithRequest:userRequest success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {

            User *user = [User modelWithJSON:JSON];

            self.currentUser = user;
            [self storeUserData];
            [user updateProfile:^{
                [self storeUserData];
            }];

            // Store the credentials for next app/web launch
            [self saveUserOAuthToken:token expiryDate:expiryDate];
            if (saveSharedWebCredentials) {
                [self saveSharedWebCredentialsWithEmail:username password:password];
            }

            gotUser(user);

            } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
                if (authenticationFailure) {
                    authenticationFailure(error);
                }
            }];
            [userOp start];
        }

    failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if ([response statusCode] == 401 || JSON) {
            if (authenticationFailure) {
                authenticationFailure(error);
            }
        } else {
            if (networkFailure) {
                networkFailure(error);
            }
        }
    }];
    [op start];
}

- (void)loginWithFacebookToken:(NSString *)token
        successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                       gotUser:(void (^)(User *))gotUser
         authenticationFailure:(void (^)(NSError *error))authenticationFailure
                networkFailure:(void (^)(NSError *))networkFailure
{
    NSURLRequest *request = [ARRouter newFacebookOAuthRequestWithToken:token];
    AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request
        success:^(NSURLRequest *oauthRequest, NSHTTPURLResponse *response, id JSON) {

        NSString *token = JSON[AROAuthTokenKey];
        NSString *expiryDateString = JSON[AROExpiryDateKey];

        [ARRouter setAuthToken:token];

        // Create an Expiration Date
        ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
        NSDate *expiryDate = [dateFormatter dateFromString:expiryDateString];

        // Let clients perform any actions once we've got the tokens sorted
        if (credentials) {
            credentials(token, expiryDate);
        }

        NSURLRequest *userRequest = [ARRouter newUserInfoRequest];
        AFHTTPRequestOperation *userOp = [AFHTTPRequestOperation JSONRequestOperationWithRequest:userRequest success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {

            User *user = [User modelWithJSON:JSON];

            self.currentUser = user;
            [self storeUserData];
            [user updateProfile:^{
                [self storeUserData];
            }];

            [self saveUserOAuthToken:token expiryDate:expiryDate];
            gotUser(user);

        } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
            if (authenticationFailure) {
                authenticationFailure(error);
            }
        }];
        [userOp start];
    }
    failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if (JSON) {
            if (authenticationFailure) {
                authenticationFailure(error);
            }
        } else {
            if (networkFailure) {
                networkFailure(error);
            }
        }
    }];

    [op start];
}

- (void)createUserWithName:(NSString *)name
                     email:(NSString *)email
                  password:(NSString *)password
                   success:(void (^)(User *))success
                   failure:(void (^)(NSError *error, id JSON))failure;
{
    [self createUserWithName:name
                           email:email
                        password:password
                         success:success
                         failure:failure
        saveSharedWebCredentials:YES];
}

- (void)createUserWithName:(NSString *)name
                     email:(NSString *)email
                  password:(NSString *)password
                   success:(void (^)(User *))success
                   failure:(void (^)(NSError *error, id JSON))failure
  saveSharedWebCredentials:(BOOL)saveSharedWebCredentials;
{
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newCreateUserRequestWithName:name email:email password:password];
        AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             NSError *error;

             User *user = [User modelWithJSON:JSON error:&error];
             if (error) {
                 ARErrorLog(@"Couldn't create user model from fresh user. Error: %@,\nJSON: %@", error.localizedDescription, JSON);

                 failure(error, JSON);
                 return;
             }

             self.didCreateAccountThisSession = YES;
             self.currentUser = user;
             [self storeUserData];
             if (saveSharedWebCredentials) {
                 [self saveSharedWebCredentialsWithEmail:email password:password];
             }

             if (success) success(user);

             [ARAnalytics event:ARAnalyticsAccountCreated withProperties:@{@"context_type" : @"email"}];

             ADJEvent *event = [ADJEvent eventWithEventToken:ARAdjustCreatedAnAccount];
             [event addCallbackParameter:@"email" value:email];
             [Adjust trackEvent:event];

         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             ARActionLog(@"Creating a new user account failed. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
             failure(error, JSON);
        }];

        [op start];

    }];
}

- (void)createUserViaFacebookWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name success:(void (^)(User *))success failure:(void (^)(NSError *, id))failure
{
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newCreateUserViaFacebookRequestWithToken:token email:email name:name];
        AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             NSError *error;
             User *user = [User modelWithJSON:JSON error:&error];
             if (error) {
                 ARErrorLog(@"Couldn't create user model from fresh Facebook user. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
                 failure(error, JSON);
                 return;
             }

             self.didCreateAccountThisSession = YES;
             self.currentUser = user;
             [self storeUserData];

             if (success) { success(user); }

             [ARAnalytics event:ARAnalyticsAccountCreated withProperties:@{@"context_type" : @"facebook"}];

         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             failure(error, JSON);
         }];
        [op start];
    }];
}

- (void)sendPasswordResetForEmail:(NSString *)email success:(void (^)(void))success failure:(void (^)(NSError *))failure
{
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newForgotPasswordRequestWithEmail:email];
        AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             if (success) {
                 [ARAnalytics event:ARAnalyticsOnboardingForgotPasswordSent];
                 success();
             }
         }
         failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             if (failure) {
                 failure(error);
             }
         }];
        [op start];
    }];
}

- (void)storeUserData
{
    NSString *userDataPath = [ARFileUtils userDocumentsPathWithFile:@"User.data"];
    if (userDataPath) {
        [NSKeyedArchiver archiveRootObject:self.currentUser toFile:userDataPath];

        [ARUserManager identifyAnalyticsUser];

        [[NSUserDefaults standardUserDefaults] setObject:self.currentUser.userID forKey:ARUserIdentifierDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

+ (void)logout
{
    [self clearUserData];
    // Clearning the Relay cache is an asynchonous operation, let's give it 0.5s to finish.
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        exit(0);
    });
}

+ (void)logoutAndSetUseStaging:(BOOL)useStaging
{
    [self clearUserData:[self sharedManager] useStaging:@(useStaging)];
    // Clearning the Relay cache is an asynchonous operation, let's give it 0.5s to finish.
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        exit(0);
    });
}

+ (void)clearUserData
{
    id useStaging = [[NSUserDefaults standardUserDefaults] valueForKey:ARUseStagingDefault];
    [self clearUserData:[self sharedManager] useStaging:useStaging];
}

// This takes `id` instead of `BOOL` because if you call this method from `clearUserData` and
// `ARUseStagingDefault` was not previously set, we don't want to explicitly set it to `0` or `NO`.
// If the value passed is `nil`, we will leave `ARUseStagingDefault` unset after clearing all user defaults.

+ (void)clearUserData:(ARUserManager *)manager useStaging:(id)useStaging
{
    [manager deleteUserData];
    [ARDefaults resetDefaults];

    [manager.keychain removeKeychainStringForKey:AROAuthTokenDefault];
    [manager.keychain removeKeychainStringForKey:ARXAppTokenKeychainKey];
    [manager.keychain removeKeychainStringForKey:ARUsernameKeychainKey];
    [manager.keychain removeKeychainStringForKey:ARPasswordKeychainKey];

    [manager deleteHTTPCookies];
    [ARRouter setAuthToken:nil];
    manager.currentUser = nil;

    [[[AREmission sharedInstance] graphQLQueryCacheModule] clearAll];

    RNCAsyncStorage *asyncStorage = [[[AREmission sharedInstance] bridge] moduleForName:@"RNCAsyncStorage"];
    [asyncStorage clearAllData];

    if (useStaging != nil) {
        [[NSUserDefaults standardUserDefaults] setValue:useStaging forKey:ARUseStagingDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

- (void)deleteHTTPCookies
{
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (NSHTTPCookie *cookie in cookieStorage.cookies) {
        if ([ARRouter.artsyHosts containsObject:cookie.domain]) {
            [cookieStorage deleteCookie:cookie];
        }
    }
}

- (void)deleteUserData
{
    // Delete the user data
    NSString *userDataPath = [self userDataPath];
    if (userDataPath) {
        NSError *error = nil;
        [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:&error];
        if (error) {
            ARErrorLog(@"Error Deleting User Data %@", error.localizedDescription);
        }
    }
}

#pragma mark -
#pragma mark Utilities

- (NSString *)userDataPath
{
    NSString *userID = [[NSUserDefaults standardUserDefaults] objectForKey:ARUserIdentifierDefault];
    if (!userID) {
        return nil;
    }

    NSArray *directories = [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask];
    NSString *documentsPath = [[directories lastObject] relativePath];
    return [documentsPath stringByAppendingPathComponent:userID];
}

#pragma mark -
#pragma mark Trial User

- (void)setLocalTemporaryUserName:(NSString *)localTemporaryUserName
{
    if (localTemporaryUserName) {
        [self.keychain setKeychainStringForKey:ARLocalTemporaryUserNameKey value:localTemporaryUserName];
    } else {
        [self.keychain removeKeychainStringForKey:ARLocalTemporaryUserNameKey];
    }
}

- (void)setLocalTemporaryUserEmail:(NSString *)localTemporaryUserEmail
{
    if (localTemporaryUserEmail) {
        [self.keychain setKeychainStringForKey:ARLocalTemporaryUserEmailKey value:localTemporaryUserEmail];
    } else {
        [self.keychain removeKeychainStringForKey:ARLocalTemporaryUserEmailKey];
    }
}

- (NSString *)localTemporaryUserName
{
    return [self.keychain keychainStringForKey:ARLocalTemporaryUserNameKey];
}

- (NSString *)localTemporaryUserEmail
{
    return [self.keychain keychainStringForKey:ARLocalTemporaryUserEmailKey];
}

- (NSString *)localTemporaryUserUUID
{
    NSString *uuid = [self.keychain keychainStringForKey:ARLocalTemporaryUserUUID];
    if (!uuid) {
        uuid = [[NSUUID UUID] UUIDString];
        [self.keychain setKeychainStringForKey:ARLocalTemporaryUserUUID value:uuid];
    }
    return uuid;
}

- (void)resetLocalTemporaryUserUUID
{
    [self.keychain removeKeychainStringForKey:ARLocalTemporaryUserUUID];
}

#pragma mark - Shared Web Credentials

- (void)disableSharedWebCredentials;
{
    ARUserManagerDisableSharedWebCredentials = YES;
}

- (void)tryStoreSavedCredentialsToWebKeychain
{
    NSString *email = [self.keychain keychainStringForKey:ARUsernameKeychainKey];
    NSString *password = [self.keychain keychainStringForKey:ARPasswordKeychainKey];

    if (!email || !password) {
        NSLog(@"Skipping saving credentials to safari keychain because username or password is missing");
        return;
    }

    [self saveSharedWebCredentialsWithEmail:email password:password];
}

- (void)saveSharedWebCredentialsWithEmail:(NSString *)email
                                 password:(NSString *)password;
{
    if (ARUserManagerDisableSharedWebCredentials) {
        return;
    }

    NSString *host = ARRouter.baseWebURL.host;
    SecAddSharedWebCredential((CFStringRef)host, (CFStringRef)email, (CFStringRef)password, ^(CFErrorRef error) {
        if (error) {
            ARErrorLog(@"Failed to save Shared Web Credentials: %@", (__bridge NSError *)error);
        } else {
#ifdef DEBUG
            ARActionLog(@"Saved Shared Web Credentials for `%@' with `%@:%@'", host, email, password);
#endif
        }
    });
}

- (void)storeUsername:(NSString *)username password:(NSString *)password
{
    [self.keychain setKeychainStringForKey:ARUsernameKeychainKey value:username];
    [self.keychain setKeychainStringForKey:ARPasswordKeychainKey value:password];
}

- (void)tryReLoginWithKeychainCredentials:(void (^)(User *currentUser))success authenticationFailure:(void (^)(NSError *error))authError
{
    NSString *email = [self.keychain keychainStringForKey:ARUsernameKeychainKey];
    NSString *password = [self.keychain keychainStringForKey:ARPasswordKeychainKey];

    if (!email || !password) {
        NSLog(@"Could not re-auth because there is not a username/password combo in the keychain");
        authError(nil);
        return;
    }

    [self loginWithUsername:email password:password successWithCredentials:^(NSString *accessToken, NSDate *expirationDate) {
        // NOOP
    }
    gotUser:success
    authenticationFailure:authError
    networkFailure:^(NSError *error) {
        // NOOP
    }];
}

- (void)tryLoginWithSharedWebCredentials:(void (^)(NSError *error))completion;
{
    if (ARUserManagerDisableSharedWebCredentials) {
        NSDictionary *info = @{NSLocalizedDescriptionKey : @"Developer chose to not use Shared Web Credentials."};
        completion([NSError errorWithDomain:@"net.artsy.artsy.authentication" code:-1 userInfo:info]);
        return;
    }

    SecRequestSharedWebCredential(NULL, NULL, ^(CFArrayRef credentials, CFErrorRef error) {
        if (error) {
            // An error might be as simple as there not being any credentials available.
            ARErrorLog(@"Unable to fetch Shared Web Credentials: %@", (__bridge NSError *)error);
            completion((__bridge NSError *)error);
        } else {
            NSDictionary *account = [(__bridge NSArray *)credentials firstObject];
            if (account) {
                [ARAnalytics event:ARAnalyticsLoggedIn withProperties:@{@"context_type" : @"safari keychain"}];

                [[ARUserManager sharedManager] loginWithUsername:account[(__bridge NSString *)kSecAttrAccount]
                                                        password:account[(__bridge NSString *)kSecSharedPassword]
                                          successWithCredentials:nil
                                                         gotUser:^(User *currentUser) { completion(nil); }
                                           authenticationFailure:^(NSError *e) { completion(e); }
                                                  networkFailure:^(NSError *e) { completion(e); }
                                        saveSharedWebCredentials:NO];
            } else {
                NSDictionary *info = @{ NSLocalizedDescriptionKey: @"User chose to not use Shared Web Credentials." };
                completion([NSError errorWithDomain:@"net.artsy.artsy.authentication" code:-1 userInfo:info]);
            }
        }
    });
}

@end
