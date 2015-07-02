#import <Mantle/Mantle.h>


@interface Bid : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong) NSDecimalNumber *cents;
@property (nonatomic, copy) NSString *bidID;

- (BOOL)isEqualToBid:(Bid *)otherBid;
@end
