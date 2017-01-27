#import <Mantle/Mantle.h>

#import "ARAppConstants.h"
#import "Sale.h"
#import "SaleArtwork.h"

@class Artwork;

typedef NS_ENUM(NSInteger, ARLiveBiddingStatus) {
    ARLiveBiddingStatusUpcoming, // Sale hasn't opened yet
    ARLiveBiddingStatusOpen,     // Open for leaving max bids in advance of going on the block
    ARLiveBiddingStatusOnBlock,  // Currently on the block for bidding
    ARLiveBiddingStatusComplete  // Previously on the block for bidding
};

NS_ASSUME_NONNULL_BEGIN


@interface LiveAuctionLot : MTLModel <MTLJSONSerializing>

- (NSURL *)urlForThumbnail;
- (NSURL *)urlForProfile;
- (CGFloat)imageAspectRatio;

@property (nonatomic, copy, readonly) NSString *artworkTitle;
@property (nonatomic, copy, readonly) NSString *_Nullable artworkDate;

@property (nonatomic, copy, readonly) NSString *artistName;
@property (nonatomic, copy, readonly) NSString *_Nullable artistBlurb;

@property (nonatomic, readonly) Artwork *artwork;

@property (nonatomic, copy, readonly) NSDictionary *imageDictionary;

@property (nonatomic, copy, readonly) NSString *liveAuctionLotID;
@property (nonatomic, assign, readonly) NSInteger position;
@property (nonatomic, assign, readonly) NSInteger lotNumber;

// Note: Not parsed from JSON, stored locally.
@property (nonatomic, copy, readonly) NSArray<NSString *> *eventIDs;

@property (nonatomic, assign, readonly) ARReserveStatus reserveStatus;
@property (nonatomic, assign, readonly) ARLiveBiddingStatus biddingStatus;

@property (nonatomic, copy, readonly) NSString *currency;
@property (nonatomic, copy, readonly) NSString *currencySymbol;

@property (nonatomic, strong, readonly, nullable) NSNumber *lowEstimateCents;
@property (nonatomic, strong, readonly, nullable) NSNumber *highEstimateCents;
@property (nonatomic, copy, readonly) NSString *_Nullable estimate;
@property (nonatomic, assign, readonly) UInt64 askingPriceCents;

- (BOOL)updateReserveStatusWithString:(NSString *)reserveStatusString;
- (BOOL)updateBiddingStatusWithString:(NSString *)biddingStatusString;
- (BOOL)updateOnlineAskingPrice:(UInt64)onlineAskingPrice;
- (void)addEvents:(NSArray<NSString *> *)events;

@end

NS_ASSUME_NONNULL_END
