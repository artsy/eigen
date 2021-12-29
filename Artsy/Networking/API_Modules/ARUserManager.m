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
#import "ARUserTempStore.h"

#import <Emission/AREmission.h>

#import "RNCAsyncStorage.h"

NSString *const ARUserSessionStartedNotification = @"ARUserSessionStarted";

static BOOL ARUserManagerDisableSharedWebCredentials = NO;


@interface ARUserManager ()
@property (nonatomic, strong) NSObject<ARKeychainable> *keychain;
@property (nonatomic, strong) User *currentUser;
@property (nonatomic, strong) ARUserTempStore *userTempStore;
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


- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _currentUser = [self retrieveArchivedUser];
    _keychain = [[ARKeychain alloc] init];

    return self;
}

- (User *)retrieveArchivedUser {
    NSString *userDataFolderPath = [self userDataPath];
    NSString *userDataPath = [userDataFolderPath stringByAppendingPathComponent:@"User.data"];

    User *retrievedUser;
    if ([[NSFileManager defaultManager] fileExistsAtPath:userDataPath]) {
        retrievedUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userDataPath exceptionBlock:^id(NSException *exception) {
            ARErrorLog(@"%@", exception.reason);
            [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:nil];
            return nil;
        }];

        // safeguard
        if (!retrievedUser.userID) {
            ARErrorLog(@"Deserialized user %@ does not have an ID.", _currentUser);
            retrievedUser = nil;
        }
    }
    return retrievedUser;
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

- (void)restoreCookies:(NSArray<NSHTTPCookie *> *)cookies
{
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (NSHTTPCookie *cookie in cookies) {
        [cookieStorage setCookie:cookie];
    }
}

- (NSArray<NSHTTPCookie *> *)allHTTPCookies
{
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    return cookieStorage.cookies;
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

- (void)testOnly_setupUser:(NSString *)username
{
    NSString *token = @"123";
    NSString *expiryDateString = @"2023-04-23T18:25:43.511Z";

    [ARRouter setAuthToken:token];

    ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
    NSDate *expiryDate = [dateFormatter dateFromString:expiryDateString];


    User *user = [User modelWithJSON:@{@"id": @"someuser",
                                       @"email": @"some@email.com",
                                       @"default_profile_id": @"123",
                                       @"identity_verified": @YES,
                                     }];

    self.currentUser = user;
    [self storeUserData];

    [self saveUserOAuthToken:token expiryDate:expiryDate];
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

#pragma mark - Shared Web Credentials

- (void)disableSharedWebCredentials;
{
    ARUserManagerDisableSharedWebCredentials = YES;
}

# pragma mark - Dev Utilities


+ (void)softClearUserData:(ARUserManager *)manager
{
    // Retrieve data to be restored + store in memory
    NSString *oAuthToken = [manager.keychain keychainStringForKey:AROAuthTokenDefault];
    NSString *xAppToken = [manager.keychain keychainStringForKey:ARXAppTokenKeychainKey];
    User *user = [manager currentUser];
    NSArray<NSHTTPCookie *> *cookies = [manager allHTTPCookies];

    // store to be able to soft log ins
    manager.userTempStore = [ARUserTempStore storeWithUser:user
                                                oAuthToken:oAuthToken
                                                 xAppToken:xAppToken
                                                   cookies:cookies];
    [manager deleteUserData];

    [manager.keychain removeKeychainStringForKey:AROAuthTokenDefault];
    [manager.keychain removeKeychainStringForKey:ARXAppTokenKeychainKey];

    [manager deleteHTTPCookies];
    [ARRouter setAuthToken:nil];
    manager.currentUser = nil;

    [[AREmission sharedInstance] reset];
    [ARRouter setup];
}

+ (void)softRestoreUserData:(ARUserManager *)manager {

    ARUserTempStore *store = [manager userTempStore];

    // TODO: handle errors, what do I want to do here if store doesn't exist or an expected field doesn't exist?
    // TODO: Check values are populated and handle errors

    // Set the current user
    [manager setCurrentUser:store.user];

    // restore user to archive
    [manager storeUserData];

    // put tokens back in the keychain
    [manager.keychain setKeychainStringForKey:AROAuthTokenDefault value:store.oAuthToken];
    [manager.keychain setKeychainStringForKey:ARXAppTokenKeychainKey value:store.xAppToken];

    // restore cookies
    [manager restoreCookies:store.cookies];

    // Setup the "router", this is a bad name now that we have a nav router
    // this will also restore auth tokens from keychain values
    [ARRouter setup];

    // Restore emission user and token state
    [[AREmission sharedInstance] updateState:@{
        [ARStateKey userID] : (store.user.userID ?: [NSNull null]),
        [ARStateKey userEmail] : (store.user.email ?: [NSNull null]),
        [ARStateKey authenticationToken] : (store.oAuthToken ?: [NSNull null]),
    }];
}

+ (void)softClearUserData
{
    [self softClearUserData:[self sharedManager]];
}

+ (void)softRestoreUserData
{
    [self softRestoreUserData:[self sharedManager]];
}

@end
