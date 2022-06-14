#import <Mantle/Mantle.h>


@interface Bidder : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong) NSString *bidderID;
@property (nonatomic, strong) NSString *saleID;

@property (nonatomic, assign) BOOL qualifiedForBidding;
@end
