#import <Mantle/Mantle.h>

@class BuyersPremium;


@interface Sale : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *saleID;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;

@property (nonatomic, strong, readonly) BuyersPremium *buyersPremium;

@property (nonatomic, readonly) BOOL isAuction;

- (BOOL)isCurrentlyActive;
- (BOOL)hasBuyersPremium;

- (AFHTTPRequestOperation *)getArtworks:(void (^)(NSArray *artworks))success;

@end
