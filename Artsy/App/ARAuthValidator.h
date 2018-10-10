#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * When the app launches this object checks to see whether the
 * users auth token is still valid by making a head request to
 * get the user object. If this fails, it runs through the login
 * process with stored creds and re-creates the Emission object
 * with the new access token.
 */
@interface ARAuthValidator : NSObject

/// Check for the validity of the current auth token
+ ( void)validateAuthCredentialsAreCorrect;

@end

NS_ASSUME_NONNULL_END
