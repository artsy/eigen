// We want to ignore the NSKeyedUnarchiver, since we'll be moving this to React Native pretty soon anyway.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

#import "ARUserManager.h"
#import "ARUserManager+Stubs.h"
#import "ARRouter.h"
#import "ARNetworkConstants.h"
#import "ARDefaults.h"


@interface ARUserManager (Testing)
+ (void)clearUserData;
+ (void)clearUserData:(ARUserManager *)manager useStaging:(id)useStaging;
@end

// This makes a lot of global changes to the  NSUserDefaults shared
// user defaults, and so is ran at the end.
// FIXME: Migrate to using DI for defaults.

SpecBegin(ARUserManager);

beforeEach(^{
    [ARUserManager clearUserData];
});

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

describe(@"login", ^{

    sharedExamplesFor(@"success", ^(NSDictionary *data) {
        it(@"stores user data after login", ^{
            NSString *userDataPath = [ARUserManager userDataPath];
            expect([[NSFileManager defaultManager] fileExistsAtPath:userDataPath]).to.beTruthy();
            User *storedUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userDataPath];
            expect(storedUser).toNot.beNil();
            expect(storedUser.userID).to.equal(ARUserManager.stubUserID);
            expect(storedUser.email).to.equal(ARUserManager.stubUserEmail);
        });

        it(@"remembers access token", ^{
            expect([[ARUserManager sharedManager] hasValidAuthenticationToken]).to.beTruthy();
            expect([ARUserManager stubAccessToken]).to.equal([UICKeyChainStore stringForKey:AROAuthTokenDefault]);
        });

        it(@"remembers access token expiry date", ^{
            ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
            NSDate *expiryDate = [dateFormatter dateFromString:[ARUserManager stubAccessTokenExpiresIn]];
            expect([expiryDate isEqualToDate:[[NSUserDefaults standardUserDefaults] objectForKey:AROAuthTokenExpiryDateDefault]]).to.beTruthy();
        });

        it(@"sets current user", ^{
            User *currentUser = [[ARUserManager sharedManager] currentUser];
            expect(currentUser).toNot.beNil();
            expect(currentUser.userID).to.equal(ARUserManager.stubUserID);
            expect(currentUser.email).to.equal(ARUserManager.stubUserEmail);
        });
        
        it(@"sets router auth token", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://www.artsy.net"]];
            expect([request valueForHTTPHeaderField:ARAuthHeader]).toNot.beNil();
        });
    });
});

describe(@"clearUserData", ^{

    describe(@"with email and password", ^{
        __block NSString * _userDataPath;
        
        beforeEach(^{
            [ARUserManager stubAndSetupUser];
            _userDataPath = [ARUserManager userDataPath];
            [ARUserManager clearUserData];
        });
        
        it(@"resets currentUser", ^{
            expect([[ARUserManager sharedManager] currentUser]).to.beNil();
        });
        
        it(@"destroys stored user data", ^{
            expect([[NSFileManager defaultManager] fileExistsAtPath:_userDataPath]).to.beFalsy();
        });
        
        it(@"unsets router auth token", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://www.artsy.net"]];
            expect([request valueForHTTPHeaderField:ARAuthHeader]).to.beNil();
        });
    });
    
    it(@"clears all cookies", ^{
        NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
        [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
        for(NSHTTPCookie *cookie in [cookieStorage cookiesForURL:[NSURL URLWithString:@"http://artsy.net"]]) {
            [cookieStorage deleteCookie:cookie];
        }
        NSInteger cookieCount = cookieStorage.cookies.count;
        NSMutableDictionary *cookieProperties = [NSMutableDictionary dictionary];
        [cookieProperties setObject:@"name" forKey:NSHTTPCookieName];
        [cookieProperties setObject:@"value" forKey:NSHTTPCookieValue];
        [cookieProperties setObject:@"/" forKey:NSHTTPCookiePath];
        [cookieProperties setObject:@"0" forKey:NSHTTPCookieVersion];
        // will delete a cookie in any of the artsy.net domains
        for(NSString *artsyHost in ARRouter.artsyHosts) {
            [cookieProperties setObject:artsyHost forKey:NSHTTPCookieDomain];
            [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:[NSHTTPCookie cookieWithProperties:cookieProperties]];
        }
        // will also delete a cookie in a different domain
        [cookieProperties setObject:@"example.com" forKey:NSHTTPCookieDomain];
        [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:[NSHTTPCookie cookieWithProperties:cookieProperties]];
        expect(cookieStorage.cookies.count).to.equal(cookieCount + ARRouter.artsyHosts.count + 1);
        expect([cookieStorage cookiesForURL:[NSURL URLWithString:@"http://artsy.net"]].count).to.equal(1);
        [ARUserManager clearUserData];
        expect(cookieStorage.cookies.count).to.equal(cookieCount);
        expect([cookieStorage cookiesForURL:[NSURL URLWithString:@"http://artsy.net"]].count).to.equal(0);
    });
});

SpecEnd;

#pragma clang diagnostic pop
