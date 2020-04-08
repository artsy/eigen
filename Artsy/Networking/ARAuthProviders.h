#import <Foundation/Foundation.h>
#import <AuthenticationServices/AuthenticationServices.h>

@interface ARAuthProviders : NSObject

+ (void)getTokenForAppleWithDelegate:(id <ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>)delegate API_AVAILABLE(ios(13));
+ (void)getTokenForFacebook:(void (^)(NSString *token, NSString *email, NSString *name))success failure:(void (^)(NSError *error))failure;

@end
