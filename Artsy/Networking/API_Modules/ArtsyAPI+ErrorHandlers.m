#import "ArtsyAPI.h"

#import <AFNetworking/AFHTTPRequestOperation.h>

@implementation ArtsyAPI (ErrorHandlers)

+ (void)handleHTTPError:(NSError *)error
             statusCode:(NSInteger)statusCode
           errorMessage:(NSString *)errorMessage
                success:(void (^)(NSError *error))success
                failure:(void (^)(NSError *error))failure
{
    [self handleHTTPError:error
               statusCode:statusCode
            errorMessages:errorMessage ? [NSArray arrayWithObject:errorMessage] : @[]
                  success:success
                  failure:failure];
}

+ (void)handleHTTPError:(NSError *)error
             statusCode:(NSInteger)statusCode
          errorMessages:(NSArray *)errorMessages
                success:(void (^)(NSError *error))success
                failure:(void (^)(NSError *error))failure
{
    NSHTTPURLResponse *response = (NSHTTPURLResponse *)error.userInfo[AFNetworkingOperationFailingURLResponseErrorKey];
    if (response.statusCode == statusCode) {
        if (errorMessages.count == 0) {
            if (success) {
                success(error);
            }
            return;
        }
        id errorData = error.userInfo[NSLocalizedRecoverySuggestionErrorKey];
        errorData = [errorData dataUsingEncoding:NSUTF8StringEncoding];
        if (errorData) {
            NSDictionary *recoverySuggestion = [NSJSONSerialization JSONObjectWithData:errorData options:0 error:nil];
            for (NSString *errorMessage in errorMessages) {
                if ([recoverySuggestion[@"error"] isEqualToString:errorMessage]) {
                    if (success) {
                        success(error);
                    }
                    return;
                }
            }
        }
    }
    if (failure) {
        failure(error);
    }
}

@end
