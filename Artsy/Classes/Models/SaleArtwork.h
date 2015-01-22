#import "MTLModel.h"
#import "Sale.h"
#import "Bidder.h"
#import "BidderPosition.h"
#import "Bid.h"


typedef NS_ENUM(NSInteger, ARReserveStatus) {
    ARReserveStatusNoReserve,
    ARReserveStatusReserveNotMet,
    ARReserveStatusReserveMet
};

@interface SaleArtwork : MTLModel <MTLJSONSerializing>

- (BidderPosition *)userMaxBidderPosition;
- (BOOL)hasEstimate;
- (NSString *)estimateString;

@property (nonatomic, copy, readonly) NSString *saleArtworkID;
@property (nonatomic, strong) Sale *auction;
@property (nonatomic, strong) Bidder *bidder;
@property (nonatomic, strong) Bid *saleHighestBid;
@property (nonatomic, strong) NSNumber *artworkNumPositions;
@property (nonatomic, strong) BidderPosition *userBidderPosition;
@property (nonatomic, strong) NSArray *positions;
@property (nonatomic, strong) NSNumber *openingBidCents;
@property (nonatomic, strong) NSNumber *minimumNextBidCents;
@property (nonatomic, strong) NSNumber *lowEstimateCents;
@property (nonatomic, strong) NSNumber *highEstimateCents;
@property (nonatomic, assign, readonly) ARAuctionState auctionState;
@property (nonatomic, assign) ARReserveStatus reserveStatus;

@end
