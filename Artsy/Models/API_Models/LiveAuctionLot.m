#import "LiveAuctionLot.h"
#import "ARMacros.h"
#import "Artwork.h"


@interface LiveAuctionLot ()

@property (nonatomic, assign, readwrite) ARReserveStatus reserveStatus;
@property (nonatomic, assign, readwrite) UInt64 onlineAskingPriceCents;
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
        ar_keypath(LiveAuctionLot.new, liveAuctionLotID) : @"id",
        ar_keypath(LiveAuctionLot.new, artworkTitle) : @"artwork.title",
        ar_keypath(LiveAuctionLot.new, artworkDate) : @"artwork.date",
        ar_keypath(LiveAuctionLot.new, artistName) : @"artwork.artist.name",
        ar_keypath(LiveAuctionLot.new, imageDictionary) : @"artwork.image",
        ar_keypath(LiveAuctionLot.new, currencySymbol) : @"symbol"
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

- (CGSize)imageProfileSize
{
    NSDictionary *profile = self.imageDictionary[@"large"];
    return CGSizeMake([profile[@"width"] floatValue], [profile[@"height"] floatValue]);
}

+ (NSValueTransformer *)reserveStatusJSONTransformer
{
    return [SaleArtwork reserveStatusJSONTransformer];
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

- (BOOL)updateOnlineAskingPrice:(UInt64)newOnlineAskingPrice
{
    NSInteger currentAskingPrice = self.onlineAskingPriceCents;
    if (currentAskingPrice != newOnlineAskingPrice) {
        self.onlineAskingPriceCents = newOnlineAskingPrice;
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
