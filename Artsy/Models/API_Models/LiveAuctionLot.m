#import "LiveAuctionLot.h"
#import "ARMacros.h"
#import "Artwork.h"


@interface LiveAuctionLot ()

@property (nonatomic, assign, readwrite) ARReserveStatus reserveStatus;
@property (nonatomic, assign, readwrite) ARLiveBiddingStatus biddingStatus;
@property (nonatomic, assign, readwrite) UInt64 askingPriceCents;
@property (nonatomic, copy, readwrite) NSArray<NSString *> *eventIDs;

@end


@implementation LiveAuctionLot

- (instancetype)init
{
    self = [super init];

    if (self) {
        self.eventIDs = @[];
    }

    return self;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveAuctionLot.new, liveAuctionLotID) : @"_id",
        ar_keypath(LiveAuctionLot.new, artworkTitle) : @"artwork.title",
        ar_keypath(LiveAuctionLot.new, artworkDate) : @"artwork.date",
        ar_keypath(LiveAuctionLot.new, artwork) : @"artwork",
        ar_keypath(LiveAuctionLot.new, artistName) : @"artwork.artist.name",
        ar_keypath(LiveAuctionLot.new, artistBlurb) : @"artwork.artist.blurb",
        ar_keypath(LiveAuctionLot.new, highEstimateCents) : @"high_estimate_cents",
        ar_keypath(LiveAuctionLot.new, lowEstimateCents) : @"low_estimate_cents",
        ar_keypath(LiveAuctionLot.new, lotLabel) : @"lot_label",
        ar_keypath(LiveAuctionLot.new, imageDictionary) : @"artwork.image",
        ar_keypath(LiveAuctionLot.new, currencySymbol) : @"symbol",
    };
}

- (NSURL *)urlForThumbnail
{
    return [NSURL URLWithString:self.imageDictionary[@"large"]];
}

- (NSURL *)urlForProfile
{
    return [NSURL URLWithString:self.imageDictionary[@"thumb"]];
}

- (CGFloat)imageAspectRatio
{
    NSNumber *imageRatio = self.imageDictionary[@"aspect_ratio"];
    if ([imageRatio isEqual:[NSNull null]]) {
        imageRatio = @(1);
    }
    return [imageRatio floatValue];
}

+ (NSValueTransformer *)reserveStatusJSONTransformer
{
    return [SaleArtwork reserveStatusJSONTransformer];
}

+ (NSValueTransformer *)artworkJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:Artwork.class];
}

- (BOOL)updateReserveStatusWithString:(NSString *)reserveStatusString
{
    NSValueTransformer *transformer = [[self class] reserveStatusJSONTransformer];
    ARReserveStatus currentStatus = self.reserveStatus;
    ARReserveStatus newStatus = [[transformer transformedValue:reserveStatusString] integerValue];

    if (currentStatus != newStatus) {
        self.reserveStatus = newStatus;
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)updateBiddingStatusWithString:(NSString *)biddingStatusString
{
    ARLiveBiddingStatus currentBiddingStatus = self.biddingStatus;
    NSDictionary *types = @{
        @"Upcoming" : @(ARLiveBiddingStatusUpcoming),
        @"Open" : @(ARLiveBiddingStatusOpen),
        @"OnBlock" : @(ARLiveBiddingStatusOnBlock),
        @"Complete" : @(ARLiveBiddingStatusComplete)
    };

    NSNumber *type = types[biddingStatusString];
    if (!type) {
        return NO;
    }

    ARLiveBiddingStatus newBiddingStatus = type.integerValue;
    if (currentBiddingStatus != newBiddingStatus) {
        self.biddingStatus = newBiddingStatus;
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)updateOnlineAskingPrice:(UInt64)newOnlineAskingPrice
{
    NSInteger currentAskingPrice = self.askingPriceCents;
    if (currentAskingPrice != newOnlineAskingPrice) {
        self.askingPriceCents = newOnlineAskingPrice;
        return YES;
    } else {
        return NO;
    }
}

- (void)addEvents:(NSArray<NSString *> *)events
{
    NSMutableArray *copy = self.eventIDs.mutableCopy;
    [copy addObjectsFromArray:events];
    self.eventIDs = copy;
}

@end
