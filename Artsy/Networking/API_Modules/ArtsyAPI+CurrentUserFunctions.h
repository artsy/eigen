#import "ArtsyAPI.h"

@class User, Bidder;

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyAPI (CurrentUserFunctions)

/// If the user is logged in, performs a request for their bidder model(s) for the corresponding sale.
/// Calls success callback based on presence of any model in the response. A failure invocation indicates a failure in the network request.
+ (void)getCurrentUserBiddersForSale:(NSString *)saleID success:(void (^)(NSArray<Bidder *> *))success failure:(void (^)(NSError *error))failure;

@end

NS_ASSUME_NONNULL_END
