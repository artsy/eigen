#import <Foundation/Foundation.h>
typedef NS_ENUM(NSInteger, ARAuthProviderType) {
    ARAuthProviderTwitter,
    ARAuthProviderFacebook
};


@interface ARAuthProviders : NSObject
+ (void)getReverseAuthTokenForTwitter:(void(^)(NSString *token, NSString *secret))success failure:(void(^)(NSError *error))failure;
+ (void)getTokenForFacebook:(void (^)(NSString *token, NSString *email, NSString *name))success failure:(void(^)(NSError *error))failure;
@end
