#import "ArtsyAPI.h"


@interface ArtsyAPI (ErrorHandlers)

/**
 *  Handle a matching HTTP error from an Artsy API.
 *
 *  @param error        HTTP Error
 *  @param statusCode   expected status code
 *  @param errorMessage expected error message
 *  @param success      matching callback
 *  @param failure      non-matching callback
 */
+ (void)handleHTTPError:(NSError *)error
             statusCode:(NSInteger)statusCode
           errorMessage:(NSString *)errorMessage
                success:(void (^)(NSError *error))success
                failure:(void (^)(NSError *error))failure;

/**
 *  Handle a matching HTTP error from an Artsy API.
 *
 *  @param error         HTTP Error
 *  @param statusCode    expected status code
 *  @param errorMessages expected error message(s)
 *  @param success       matching callback
 *  @param failure       non-matching callback
 */
+ (void)handleHTTPError:(NSError *)error
             statusCode:(NSInteger)statusCode
          errorMessages:(NSArray *)errorMessages
                success:(void (^)(NSError *error))success
                failure:(void (^)(NSError *error))failure;

@end
