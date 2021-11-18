#import <ISO8601DateFormatter/ISO8601DateFormatter.h>
#import <UICKeyChainStore/UICKeyChainStore.h>

#import "ARDefaults.h"
#import "ARUserManager.h"
#import "NSDate+Util.h"
#import "ARRouter.h"
#import "ARFileUtils.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+DeviceTokens.h"
#import "User.h"
#import "ARAppConstants.h"

#import "NSKeyedUnarchiver+ErrorLogging.h"
#import "ARAnalyticsConstants.h"
#import "ARKeychainable.h"
#import "ARSystemTime.h"
#import "ARLogger.h"
#import "ARAppDelegate.h"

#import "MTLModel+JSON.h"
#import "AFHTTPRequestOperation+JSON.h"
#import "ARDispatchManager.h"
#import "ARScreenPresenterModule.h"

#import <Emission/AREmission.h>

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

// When the user authenticates from react-native, we need to make sure that native side
// is synchronized with react-native
- (void)handleAuthState:(NSString *)token
       expiryDateString:(NSString *)expiryDateString
                   JSON: (id) JSON;
{
    [ARRouter setAuthToken:token];

    User *user = [User modelWithJSON:JSON];
    self.currentUser = user;
    [self storeUserData];
    [user updateProfile:^{
        [self storeUserData];
    }];

    // Create an Expiration Date
    ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
    NSDate *expiryDate = [dateFormatter dateFromString:expiryDateString];
    [self saveUserOAuthToken:token expiryDate:expiryDate];
}

- (void)storeUserData
{
    NSString *userDataPath = [ARFileUtils userDocumentsPathWithFile:@"User.data"];
    if (userDataPath) {
        // We'll be moving this to React Native pretty soon anyway.
        #pragma clang diagnostic push
        #pragma clang diagnostic ignored "-Wdeprecated-declarations"
        [NSKeyedArchiver archiveRootObject:self.currentUser toFile:userDataPath];
        #pragma clang diagnostic pop

        [[NSUserDefaults standardUserDefaults] setObject:self.currentUser.userID forKey:ARUserIdentifierDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

+ (void)logoutWithCompletion:(RCTResponseSenderBlock)completion
{
    [ArtsyAPI deleteAPNTokenForCurrentDeviceWithCompletion:^ {
        [[self class] clearUserData];
        completion(nil);
    }];
}

+ (void)clearUserData
{
    [self clearUserData:[self sharedManager]];
}

+ (void)clearAccessToken
{
    [self clearAccessToken:[self sharedManager]];
}

+ (void)clearAccessToken:(ARUserManager *)manager
{
    [manager.keychain removeKeychainStringForKey:AROAuthTokenDefault];
}

+ (void)clearUserData:(ARUserManager *)manager
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

    [ARScreenPresenterModule clearCachedNavigationStacks];

    RNCAsyncStorage *asyncStorage = [[[AREmission sharedInstance] bridge] moduleForName:@"RNCAsyncStorage"];
    [asyncStorage clearAllData];

    [[AREmission sharedInstance] reset];
    [ARRouter setup];
}

- (void)deleteHTTPCookies
{
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (NSHTTPCookie *cookie in cookieStorage.cookies) {
       [cookieStorage deleteCookie:cookie];
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

#pragma mark - Sign in With Apple
- (NSString *)appleDisplayName
{
    return [self.keychain keychainStringForKey:ARAppleDisplayNameKeychainKey];
}

- (NSString *)appleEmail
{
    return [self.keychain keychainStringForKey:ARAppleEmailKeyChainKey];
}

- (void)storeAppleDisplayName:(NSString *)displayName email:(NSString *)email
{
    [self.keychain setKeychainStringForKey:ARAppleDisplayNameKeychainKey value:displayName];
    [self.keychain setKeychainStringForKey:ARAppleEmailKeyChainKey value:email];
}

- (void)resetAppleStoredCredentials
{
    [self.keychain removeKeychainStringForKey:ARAppleDisplayNameKeychainKey];
    [self.keychain removeKeychainStringForKey:ARAppleEmailKeyChainKey];
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

@end
