#import <Mantle/Mantle.h>

NS_ASSUME_NONNULL_BEGIN


@interface LiveBidder : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *type;
@property (nonatomic, copy, readonly) NSString *bidderID;
@property (nonatomic, copy, readonly) NSString *paddleNumber;

@property (nonatomic, copy, readonly) NSString *bidderDisplayType;

@end

NS_ASSUME_NONNULL_END
