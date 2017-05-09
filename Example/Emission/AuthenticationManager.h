#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/// Handles Keychain communication, and setup for
/// the user authentication details

@interface AuthenticationManager : NSObject

- (instancetype)initWithService:(NSString *)scheme;

- (void)presentAuthenticationPromptOnViewController:(UIViewController *)viewController completion:(dispatch_block_t)completion;

- (void)logOut;

/// Is there a userID & token?
@property (readonly) BOOL isAuthenticated;

/// User's unique UUID
@property (readonly) NSString *userID;
/// Auth token
@property (readonly) NSString *token;
/// The scheme used by the current authentication route
@property (readonly) NSString *service;

@end
