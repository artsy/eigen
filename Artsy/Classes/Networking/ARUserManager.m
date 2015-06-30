#import "ARUserManager.h"
#import "NSDate+Util.h"
#import "ARRouter.h"
#import <ISO8601DateFormatter/ISO8601DateFormatter.h>
#import "ARFileUtils.h"
#import "ArtsyAPI+Private.h"
#import "NSKeyedUnarchiver+ErrorLogging.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARCollectorStatusViewController.h"
#import "ARKeychainable.h"

NSString *ARTrialUserNameKey = @"ARTrialUserName";
NSString *ARTrialUserEmailKey = @"ARTrialUserEmail";
NSString *ARTrialUserUUID = @"ARTrialUserUUID";

@interface ARUserManager()
@property (nonatomic, strong) NSObject <ARKeychainable> *keychain;
@property (nonatomic, strong) User *currentUser;
@property (nonatomic, readonly) BOOL didCreateAccountThisSession;
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
    return [self.class sharedManager].didCreateAccountThisSession;
}

+ (void)identifyAnalyticsUser
{
    NSString *analyticsUserID = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    [ARAnalytics identifyUserWithID:analyticsUserID andEmailAddress:nil];

    User *user = [User currentUser];
    if (user) {
        [ARAnalytics setUserProperty:@"$email" toValue:user.email];
        [ARAnalytics setUserProperty:@"user_id" toValue:user.userID];
        [ARAnalytics setUserProperty:@"user_uuid" toValue:[ARUserManager sharedManager].trialUserUUID];
        [ARAnalytics addEventSuperProperties:@{ @"user_id": user.userID ?: @"",
                                                @"user_uuid": ARUserManager.sharedManager.trialUserUUID ?: @"",
                                                @"collector_level": [ARCollectorStatusViewController stringFromCollectorLevel:user.collectorLevel] ?: @"",
                                                @"is_trial_user": @(NO)}];
    } else {
        [ARAnalytics setUserProperty:@"user_uuid" toValue:[ARUserManager sharedManager].trialUserUUID];
        [ARAnalytics addEventSuperProperties:@{ @"user_uuid": ARUserManager.sharedManager.trialUserUUID ?: @"",
                                                @"is_trial_user": @(YES)}];
    }
}

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }

    NSString *userDataFolderPath = [self userDataPath];
    NSString *userDataPath = [userDataFolderPath stringByAppendingPathComponent:@"User.data"];

    if ([[NSFileManager defaultManager] fileExistsAtPath:userDataPath]) {
        _currentUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userDataPath  exceptionBlock:^id(NSException *exception) {
            NSLog(@"%@", exception.reason);
            [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:nil];
            return nil;
        }];

        // safeguard
        if (!self.currentUser.userID) {
            NSLog(@"Deserialized user %@ does not have an ID.", _currentUser);
            _currentUser = nil;
        }
    }

    _keychain = [[ARKeychain alloc] init];
    return self;
}

- (BOOL)hasExistingAccount
{
    return ( _currentUser && [self hasValidAuthenticationToken] ) || [self hasValidXAppToken];
}

- (BOOL)hasValidAuthenticationToken
{
    NSString *authToken = [self userAuthenticationToken];
    NSDate *expiryDate  = [[NSUserDefaults standardUserDefaults] objectForKey:AROAuthTokenExpiryDateDefault];

    BOOL tokenValid = expiryDate && [[[ARSystemTime date] GMTDate] earlierDate:expiryDate] != expiryDate;
    return authToken && tokenValid;
}

- (BOOL)hasValidXAppToken
{
    NSString *xapp = [[NSUserDefaults standardUserDefaults] objectForKey:ARXAppTokenDefault];
    NSDate *expiryDate  = [[NSUserDefaults standardUserDefaults] objectForKey:ARXAppTokenExpiryDateDefault];

    BOOL tokenValid = expiryDate && [[[ARSystemTime date] GMTDate] earlierDate:expiryDate] != expiryDate;
    return xapp && tokenValid;
}

- (NSString *)userAuthenticationToken
{
    return _userAuthenticationToken ?: [self.keychain keychainStringForKey:AROAuthTokenDefault];
}

- (void)saveUserOAuthToken:(NSString *)token expiryDate:(NSDate *)expiryDate
{
    [self.keychain setKeychainStringForKey:AROAuthTokenDefault value:token];

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:expiryDate forKey:AROAuthTokenExpiryDateDefault];

    [defaults removeObjectForKey:ARXAppTokenDefault];
    [defaults removeObjectForKey:ARXAppTokenExpiryDateDefault];
    [defaults synchronize];
}

- (void)loginWithUsername:(NSString *)username password:(NSString *)password
   successWithCredentials:(void(^)(NSString *accessToken, NSDate *expirationDate))credentials
                  gotUser:(void(^)(User *currentUser))gotUser
    authenticationFailure:(void (^)(NSError *error))authenticationFailure
           networkFailure:(void (^)(NSError *error))networkFailure {

    NSURLRequest *request = [ARRouter newOAuthRequestWithUsername:username password:password];

    AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
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
        AFJSONRequestOperation *userOp = [AFJSONRequestOperation JSONRequestOperationWithRequest:userRequest success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {

            User *user = [User modelWithJSON:JSON];

            self.currentUser = user;
            [self storeUserData];
            [user updateProfile:^{
                [self storeUserData];
            }];

            // Store the credentials for next app launch

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

- (void)loginWithFacebookToken:(NSString *)token
        successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                       gotUser:(void (^)(User *))gotUser
         authenticationFailure:(void (^)(NSError *error))authenticationFailure
                networkFailure:(void (^)(NSError *))networkFailure
{
    NSURLRequest *request = [ARRouter newFacebookOAuthRequestWithToken:token];
    AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
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
        AFJSONRequestOperation *userOp = [AFJSONRequestOperation JSONRequestOperationWithRequest:userRequest success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {

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

- (void)loginWithTwitterToken:(NSString *)token secret:(NSString *)secret
       successWithCredentials:(void (^)(NSString *, NSDate *))credentials
                      gotUser:(void (^)(User *))gotUser
        authenticationFailure:(void (^)(NSError *error))authenticationFailure
               networkFailure:(void (^)(NSError *))networkFailure
{
    NSURLRequest *request = [ARRouter newTwitterOAuthRequestWithToken:token andSecret:secret];
    AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
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
        AFJSONRequestOperation *userOp = [AFJSONRequestOperation JSONRequestOperationWithRequest:userRequest success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {

            User *user = [User modelWithJSON:JSON];

            self.currentUser = user;
            [self storeUserData];
            [user updateProfile:^{
                [self storeUserData];
            }];

            // Store the credentials for next app launch
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
            networkFailure(error);
        }
    }];

    [op start];
    
}

- (void)startTrial:(void(^)())callback failure:(void (^)(NSError *error))failure
{
    [self.keychain removeKeychainStringForKey:AROAuthTokenDefault];
    
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [[NSUserDefaults standardUserDefaults] setObject:xappToken forKey:ARXAppTokenDefault];
        [[NSUserDefaults standardUserDefaults] setObject:expirationDate forKey:ARXAppTokenExpiryDateDefault];
        [[NSUserDefaults standardUserDefaults] synchronize];
        callback();
    } failure:failure];
}

- (void)createUserWithName:(NSString *)name email:(NSString *)email password:(NSString *)password success:(void (^)(User *))success failure:(void (^)(NSError *error, id JSON))failure
{
    [ARAnalytics event:ARAnalyticsSignUpEmail];

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        
        NSLog(@"Got Xapp. Creating a new user account.");
        
        NSURLRequest *request = [ARRouter newCreateUserRequestWithName:name email:email password:password];
        AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             NSError *error;
             User *user = [User modelWithJSON:JSON error:&error];
             if (error) {
                 NSLog(@"Couldn't create user model from fresh user. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
                 [ARAnalytics event:ARAnalyticsSignUpError];
                 failure(error, JSON);
                 return;
             }

             self->_didCreateAccountThisSession = YES;
             self.currentUser = user;
             [self storeUserData];
             
             if(success) success(user);
             [ARAnalytics event:ARAnalyticsAccountCreated];
             
         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             NSLog(@"Creating a new user account failed. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
             failure(error, JSON);
             [ARAnalytics event:ARAnalyticsSignUpError];
         }];

        [op start];
        
    }];
}

- (void)createUserViaFacebookWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name success:(void (^)(User *))success failure:(void (^)(NSError *, id))failure
{
    [ARAnalytics event:ARAnalyticsSignUpFacebook];

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newCreateUserViaFacebookRequestWithToken:token email:email name:name];
        AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             NSError *error;
             User *user = [User modelWithJSON:JSON error:&error];
             if (error) {
                 NSLog(@"Couldn't create user model from fresh Facebook user. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
                 [ARAnalytics event:ARAnalyticsSignUpError];
                 failure(error, JSON);
                 return;
             }

             self->_didCreateAccountThisSession = YES;
             self.currentUser = user;
             [self storeUserData];

             if (success) { success(user); }
             
             [ARAnalytics event:ARAnalyticsSignUpEmail];
             
         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             failure(error, JSON);
             [ARAnalytics event:ARAnalyticsSignUpError];
             
         }];
        [op start];
    }];
}

- (void)createUserViaTwitterWithToken:(NSString *)token secret:(NSString *)secret email:(NSString *)email name:(NSString *)name success:(void (^)(User *))success failure:(void (^)(NSError *, id))failure
{
    [ARAnalytics event:ARAnalyticsSignUpTwitter];

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newCreateUserViaTwitterRequestWithToken:token secret:secret email:email name:name];
        AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             NSError *error;
             User *user = [User modelWithJSON:JSON error:&error];
             if (error) {
                 NSLog(@"Couldn't create user model from fresh Twitter user. Error: %@,\nJSON: %@", error.localizedDescription, JSON);
                 [ARAnalytics event:ARAnalyticsSignUpError];
                 failure(error, JSON);
                 return;
             }

             self->_didCreateAccountThisSession = YES;
             self.currentUser = user;
             [self storeUserData];
             
             if(success) success(user);

             [ARAnalytics event:ARAnalyticsSignUpEmail];
             
         } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
             failure(error, JSON);
             [ARAnalytics event:ARAnalyticsSignUpError];
         }];
        [op start];
    }];
}

- (void)sendPasswordResetForEmail:(NSString *)email success:(void (^)(void))success failure:(void (^)(NSError *))failure
{
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        NSURLRequest *request = [ARRouter newForgotPasswordRequestWithEmail:email];
        AFJSONRequestOperation *op = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
         success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
             if (success) {
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
    exit(0);
}

+ (void)logoutAndSetUseStaging:(BOOL)useStaging
{
    [self clearUserData:[self sharedManager] useStaging:@(useStaging)];
    exit(0);
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
    [manager.keychain removeKeychainStringForKey:ARXAppTokenDefault];

    [manager deleteHTTPCookies];
    [ARRouter setAuthToken:nil];
    manager.currentUser = nil;

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
    NSString * userDataPath = [self userDataPath];
    if (userDataPath) {
        NSError *error = nil;
        [[NSFileManager defaultManager] removeItemAtPath:userDataPath error:&error];
        if (error) {
            NSLog(@"Error Deleting User Data %@", error.localizedDescription);
        }
    }
}

#pragma mark -
#pragma mark Utilities

- (NSString *)userDataPath {
    NSString *userID = [[NSUserDefaults standardUserDefaults] objectForKey:ARUserIdentifierDefault];
    if (!userID) { return nil; }
    
    NSArray *directories =[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask];
    NSString *documentsPath = [[directories lastObject] relativePath];
    return [documentsPath stringByAppendingPathComponent:userID];
}

#pragma mark -
#pragma mark Trial User

- (void)setTrialUserName:(NSString *)trialUserName
{
    if (trialUserName) {
        [self.keychain setKeychainStringForKey:ARTrialUserNameKey value:trialUserName];
    } else {
        [self.keychain removeKeychainStringForKey:ARTrialUserNameKey];
    }
}

- (void)setTrialUserEmail:(NSString *)trialUserEmail
{
    if (trialUserEmail) {
        [self.keychain setKeychainStringForKey:ARTrialUserEmailKey value:trialUserEmail];
    } else {
        [self.keychain removeKeychainStringForKey:ARTrialUserEmailKey];
    }
}

- (NSString *)trialUserName
{
    return [self.keychain keychainStringForKey:ARTrialUserNameKey];
}

- (NSString *)trialUserEmail
{
    return [self.keychain keychainStringForKey:ARTrialUserEmailKey];
}

- (NSString *)trialUserUUID
{
    NSString *uuid = [self.keychain keychainStringForKey:ARTrialUserUUID];
    if (!uuid) {
        uuid = [[NSUUID UUID] UUIDString];
        [self.keychain setKeychainStringForKey:ARTrialUserUUID value:uuid];
    }
    return uuid;
}

- (void)resetTrialUserUUID
{
    [self.keychain removeKeychainStringForKey:ARTrialUserUUID];
}

@end
