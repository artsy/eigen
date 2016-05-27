#import <Mantle/Mantle.h>

#import "ARAppConstants.h"

@class LiveAuctionLot;


@interface LiveSale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *liveSaleID;
@property (nonatomic, copy, readonly) NSString *causalitySaleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;

@property (nonatomic, copy, readonly) NSArray<LiveAuctionLot *> *saleArtworks;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, strong, readonly) NSDate *liveAuctionStartDate;

- (BOOL)isCurrentlyActive;

@end
