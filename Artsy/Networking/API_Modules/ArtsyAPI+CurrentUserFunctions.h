#import "ArtsyAPI.h"

@class User, Bidder, LotStanding;

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyAPI (CurrentUserFunctions)

+ (void)updateCurrentUserProperty:(NSString *)property toValue:(id)value success:(void (^)(User *user))success failure:(void (^)(NSError *error))failure;

/// If the user is logged in, performs a request for their bidder model(s) for the corresponding sale.
/// Calls success callback based on presence of any model in the response. A failure invocation indicates a failure in the network request.
+ (void)getCurrentUserBiddersForSale:(NSString *)saleID success:(void (^)(NSArray<Bidder *> *))success failure:(void (^)(NSError *error))failure;

/// Performs a request for the logged-in user's lot standings for the corresponding sale.
/// Calls success callback based on a successful API call and JSON deserialiation.
+ (void)getCurrentUserLotStandingsForSale:(NSString *)saleID success:(void (^)(NSArray<LotStanding *> *))success failure:(void (^)(NSError *error))failure;

+ (void)getCurrentUserTotalUnreadMessagesCount:(NSInteger)count success:(nullable void (^)(NSInteger))success failure:(void (^)(NSError *error))failure;

@end

NS_ASSUME_NONNULL_END
