#import "ARUserManager.h"


@interface ARUserManager (Stubs)

+ (NSString *)stubAccessToken;
+ (NSString *)stubAccessTokenExpiresIn;
+ (NSString *)stubXappToken;
+ (NSString *)stubXappTokenExpiresIn;
+ (NSString *)stubUserID;
+ (NSString *)stubUserEmail;
+ (NSString *)stubUserPassword;
+ (NSString *)stubUserName;

+ (void)stubAccessToken:(NSString *)accessToken expiresIn:(NSString *)expiresIn;
+ (void)stubXappToken:(NSString *)xappToken expiresIn:(NSString *)expiresIn;
+ (void)stubMe:(NSString *)userID email:(NSString *)email name:(NSString *)name;

+ (void)stubAndSetupUser;

+ (NSString *)userDataPath;

@end
