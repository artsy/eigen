#import <Mantle/Mantle.h>

#import "ARAppConstants.h"
#import "Sale.h"
#import "SaleArtwork.h"

@class Artwork;


@interface LiveAuctionLot : MTLModel <MTLJSONSerializing>

- (NSURL *)urlForThumbnail;
- (NSURL *)urlForProfile;
- (CGSize)imageProfileSize;

@property (nonatomic, copy, readonly) NSString *artworkTitle;
@property (nonatomic, copy, readonly) NSString *artistName;

@property (nonatomic, copy, readonly) NSDictionary *imageDictionary;

@property (nonatomic, copy, readonly) NSString *liveAuctionLotID;
@property (nonatomic, assign, readonly) NSInteger position;

// Note: Not parsed from JSON, stored locally.
@property (nonatomic, copy, readonly) NSArray<NSString *> *eventIDs;

@property (nonatomic, assign, readonly) ARReserveStatus reserveStatus;

@property (nonatomic, copy, readonly) NSString *currency;
@property (nonatomic, copy, readonly) NSString *currencySymbol;

@property (nonatomic, assign, readonly) NSInteger lowEstimateCents;
@property (nonatomic, assign, readonly) NSInteger highEstimateCents;
@property (nonatomic, assign, readonly) NSInteger onlineAskingPriceCents;

- (void)updateReserveStatusWithString:(NSString *)reserveStatusString;
- (void)updateOnlineAskingPrice:(NSInteger)onlineAskingPrice;
- (void)addEvents:(NSArray<NSString *> *)events;

@end
