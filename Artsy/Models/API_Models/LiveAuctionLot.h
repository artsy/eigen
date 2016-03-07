#import <Mantle/Mantle.h>

#import "ARAppConstants.h"
#import "Sale.h"
#import "SaleArtwork.h"

@class Artwork;


@interface LiveAuctionLot : MTLModel <MTLJSONSerializing>

- (NSURL *)urlForThumbnail;
- (NSURL *)urlForProfile;

@property (nonatomic, copy, readonly) NSString *artworkTitle;
@property (nonatomic, copy, readonly) NSString *artistName;

@property (nonatomic, copy, readonly) NSDictionary *imageDictionary;

@property (nonatomic, copy, readonly) NSString *liveAuctionLotID;
@property (nonatomic, assign, readonly) NSInteger position;

@property (nonatomic, assign, readonly) ARReserveStatus reserveStatus;

@property (nonatomic, copy, readonly) NSString *currency;
@property (nonatomic, copy, readonly) NSString *currencySymbol;

@property (nonatomic, assign, readonly) NSInteger lowEstimateCents;
@property (nonatomic, assign, readonly) NSInteger highEstimateCents;
@property (nonatomic, assign, readonly) NSInteger askingPriceCents;
@property (nonatomic, assign, readonly) NSInteger onlineAskingPriceCents;

@end
