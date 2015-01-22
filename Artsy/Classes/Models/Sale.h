#import "MTLModel.h"
#import "MTLJSONAdapter.h"

@interface Sale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *saleID;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;

@property (nonatomic, readonly) BOOL isAuction;

- (BOOL)isCurrentlyActive;

@end
