#import "ARUserManager+Stubs.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <SDWebImage/SDWebImageManager.h>


@implementation ARUserManager (Stubs)

+ (NSString *)stubAccessToken { return @"access token"; };
+ (NSString *)stubAccessTokenExpiresIn { return @"2035-01-02T21:42:21-0500"; };
+ (NSString *)stubXappToken { return @"xapp token"; };
+ (NSString *)stubXappTokenExpiresIn { return @"2035-01-02T21:42:21-0500"; };
+ (NSString *)stubUserID { return @"4d78f315faf6426b4f000011"; };
+ (NSString *)stubUserEmail { return @"user@example.com"; };
+ (NSString *)stubUserPassword { return @"password"; };
+ (NSString *)stubUserName { return @"Joe Shmoe"; };

+ (void)stubAccessToken:(NSString *)accessToken expiresIn:(NSString *)expiresIn
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/oauth2/access_token" withResponse:@{ @"access_token" : accessToken,
                                                                                @"expires_in" : expiresIn }];
}

+ (void)stubXappToken:(NSString *)xappToken expiresIn:(NSString *)expiresIn
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{ @"xapp_token" : xappToken,
                                                                              @"expires_in" : expiresIn }];
}

+ (void)stubMe:(NSString *)userID email:(NSString *)email name:(NSString *)name
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me" withResponse:@{ @"id" : userID,
                                                                      @"email" : email,
                                                                      @"name" : name }];
}

+ (void)stubAndSetupUser
{
    [self stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
    [self stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];

    [self stubbedSetupUser:[ARUserManager stubUserEmail]];
}

+ (void)stubbedSetupUser:(NSString *)username
{
    [[SDWebImageManager sharedManager] cancelAll];
    [[ARUserManager sharedManager] testOnly_setupUser:[ARUserManager stubUserEmail]];
}


#pragma mark -
#pragma mark Utilities

+ (NSString *)userDataPath
{
    NSString *userID = [[NSUserDefaults standardUserDefaults] objectForKey:ARUserIdentifierDefault];
    if (!userID) {
        return nil;
    }
    NSArray *directories = [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask];
    NSString *documentsPath = [[directories lastObject] relativePath];
    return [[documentsPath stringByAppendingPathComponent:userID] stringByAppendingPathComponent:@"User.data"];
}

@end
