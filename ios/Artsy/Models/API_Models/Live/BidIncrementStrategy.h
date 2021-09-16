#import <Mantle/Mantle.h>

#import "ARAppConstants.h"


@interface BidIncrementStrategy : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong, readonly) NSNumber *from;
@property (nonatomic, strong, readonly) NSNumber *amount;

@end
