#import <Mantle/Mantle.h>


@interface Bid : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong) NSDecimalNumber *cents;

- (BOOL)isEqualToBid:(Bid *)otherBid;
@end
