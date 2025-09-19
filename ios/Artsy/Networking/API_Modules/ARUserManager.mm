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
#import "ARAppDelegateHelper.h"

#import "MTLModel+JSON.h"
#import "AFHTTPRequestOperation+JSON.h"
#import "ARDispatchManager.h"
#import "ARTNativeScreenPresenterModule.h"

#import "AREmission.h"

#import "RNCAsyncStorage.h"

NSString *const ARUserSessionStartedNotification = @"ARUserSessionStarted";

static BOOL ARUserManagerDisableSharedWebCredentials = NO;


@interface ARUserManager ()
@property (nonatomic, strong) NSObject<ARKeychainable> *keychain;
@property (nonatomic, strong) User *currentUser;
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

    NSString *userDataFolderPath = [self userDataPath];
    NSString *userDataPath = [userDataFolderPath stringByAppendingPathComponent:@"User.data"];

    if ([[NSFileManager defaultManager] fileExistsAtPath:userDataPath]) {
        _currentUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userDataPath exceptionBlock:^id(NSException *exception) {
            NSLog(@"%@", exception.reason);
            [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:nil];
            return nil;
        }];

        // safeguard
        if (!_currentUser.userID) {
            NSLog(@"Deserialized user %@ does not have an ID.", _currentUser);
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
            NSLog(@"Error Deleting User Data %@", error.localizedDescription);
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

@end
