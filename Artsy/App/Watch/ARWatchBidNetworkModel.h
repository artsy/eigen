#import <Foundation/Foundation.h>

@class BidderPosition, WatchBiddingDetails;

@interface ARWatchBidNetworkModel : NSObject

+ (void)bidWithDetails:(WatchBiddingDetails *)details :(void (^)(BidderPosition *))success failure:(void (^)(NSError *))failure;

+ (void)validateIsTopBidderForDetails:(WatchBiddingDetails *)details :(void (^)())success failure:(void (^)(NSError *))failure;

@end
