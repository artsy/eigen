#import <Mantle/Mantle.h>
#import "ARUserActivity.h"

@class BuyersPremium, Profile;
@class AFHTTPRequestOperation;

typedef enum: NSUInteger {
    SaleStatePreview,
    SaleStateOpen,
    SaleStateClosed,
} SaleState;

@interface Sale : MTLModel <MTLJSONSerializing, ARContinuityMetadataProvider>

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *saleID;
@property (nonatomic, strong, readonly) NSString *promotedSaleID;
@property (nonatomic, copy, readonly) NSString *saleDescription;
@property (nonatomic, assign, readonly) SaleState saleState;

@property (nonatomic, strong, readonly) NSDate *liveAuctionStartDate;
@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, strong, readonly) NSDate *registrationEndsAtDate;

@property (nonatomic, strong, readonly) NSDate *uiDateOfInterest;

@property (nonatomic, strong, readonly) BuyersPremium *buyersPremium;

@property (nonatomic, strong) Profile *profile;

@property (nonatomic, readonly) BOOL isAuction;
@property (nonatomic, readonly) BOOL requireBidderApproval;
@property (nonatomic, readonly) BOOL requireIdentityVerification;

- (BOOL)shouldShowLiveInterface;
- (NSString *)bannerImageURLString;
- (BOOL)isCurrentlyActive;
- (BOOL)hasBuyersPremium;

@end
