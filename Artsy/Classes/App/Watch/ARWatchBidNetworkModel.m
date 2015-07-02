#import "ARWatchBidNetworkModel.h"


@implementation ARWatchBidNetworkModel

+ (void)bidWithDetails:(WatchBiddingDetails *)details:(void (^)(BidderPosition *))success failure:(void (^)(NSError *))failure
{
    success(nil);
}

+ (void)validateIsTopBidderForDetails:(WatchBiddingDetails *)details:(void (^)())success failure:(void (^)(NSError *))failure
{
    sleep(1);
    success();
}

@end
