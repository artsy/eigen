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

@property (nonatomic, copy, readonly) NSArray<NSString *> *events;

@property (nonatomic, assign, readonly) ARReserveStatus reserveStatus;

@property (nonatomic, copy, readonly) NSString *currency;
@property (nonatomic, copy, readonly) NSString *currencySymbol;

@property (nonatomic, assign, readonly) NSInteger lowEstimateCents;
@property (nonatomic, assign, readonly) NSInteger highEstimateCents;
@property (nonatomic, assign, readonly) NSInteger askingPriceCents; // TODO: Remove this? Do we need it at all on the client side, since we only want aline?
@property (nonatomic, assign, readonly) NSInteger onlineAskingPriceCents;

- (void)updateReserveStatusWithString:(NSString *)reserveStatusString;
- (void)updateOnlineAskingPrice:(NSInteger)onlineAskingPrice;

@end
