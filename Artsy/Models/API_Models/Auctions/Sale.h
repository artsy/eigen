#import <Mantle/Mantle.h>
#import "ARSpotlight.h"

@class BuyersPremium, Profile;
@class AFHTTPRequestOperation;

typedef enum: NSUInteger {
    SaleStatePreview,
    SaleStateOpen,
    SaleStateClosed,
} SaleState;

@interface Sale : MTLModel <MTLJSONSerializing, ARSpotlightMetadataProvider>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *saleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;
@property (nonatomic, assign, readonly) SaleState saleState;

@property (nonatomic, strong, readonly) NSDate *liveAuctionStartDate;
@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, strong, readonly) NSDate *registrationEndsAtDate;

@property (nonatomic, strong, readonly) BuyersPremium *buyersPremium;

@property (nonatomic, strong) Profile *profile;

@property (nonatomic, readonly) BOOL isAuction;
@property (nonatomic, readonly) BOOL requireBidderApproval;


- (BOOL)shouldShowLiveInterface;
- (NSString *)bannerImageURLString;
- (BOOL)isCurrentlyActive;
- (BOOL)hasBuyersPremium;

- (AFHTTPRequestOperation *)getArtworks:(void (^)(NSArray *artworks))success;

@end
