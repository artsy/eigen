#import <Mantle/Mantle.h>

#import "ARAppConstants.h"

@class BuyersPremium;


@interface LiveSale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *liveSaleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;

@property (nonatomic, copy, readonly) NSString *currentLotId;
@property (nonatomic, copy, readonly) NSArray<NSString *> *lotIDs;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;

@property (nonatomic, strong, readonly) BuyersPremium *buyersPremium;

@end
