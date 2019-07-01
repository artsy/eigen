#import <Mantle/Mantle.h>

#import "Sale.h"
#import "ARAppConstants.h"

@class LiveAuctionLot, BidIncrementStrategy;

@interface LiveSale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *liveSaleID;
@property (nonatomic, copy, readonly) NSString *causalitySaleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;
@property (nonatomic, copy, readonly) NSString *medium;
@property (nonatomic, copy, readonly) NSString *editionInfo;

@property (nonatomic, copy, readonly) NSArray<LiveAuctionLot *> *saleArtworks;
@property (nonatomic, copy, readonly) NSArray<BidIncrementStrategy *> *bidIncrementStrategy;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, assign, readonly) SaleState saleState;
@property (nonatomic, strong, readonly) NSDate *liveAuctionStartDate;
@property (nonatomic, strong, readonly) NSDate *registrationEndsAtDate;

- (BOOL)isCurrentlyActive;

@end
