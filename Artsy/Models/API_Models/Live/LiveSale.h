#import <Mantle/Mantle.h>

#import "ARAppConstants.h"

@class BuyersPremium;


@interface LiveSale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *liveSaleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;

@property (nonatomic, strong, readonly) BuyersPremium *buyersPremium;

@end
