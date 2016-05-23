#import "ArtsyAPI.h"

@class User;

typedef NS_ENUM(NSUInteger, ArtsyAPISaleRegistrationStatus) {
    ArtsyAPISaleRegistrationStatusNotLoggedIn,
    ArtsyAPISaleRegistrationStatusNotRegistered,
    ArtsyAPISaleRegistrationStatusRegistered,
};


@interface ArtsyAPI (CurrentUserFunctions)

+ (void)updateCurrentUserProperty:(NSString *)property toValue:(id)value success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure;

/// If the user is logged in, performs a request for their bidder model(s) for the corresponding sale.
/// Calls success callback based on presence of any model in the response. A failure invocation indicates a failure in the network request.
+ (void)getCurrentUserRegistrationStatusForSale:(NSString *)saleID success:(void (^)(ArtsyAPISaleRegistrationStatus))success failure:(void (^)(NSError *error))failure;

@end
