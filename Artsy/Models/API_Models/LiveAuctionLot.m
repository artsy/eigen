#import "LiveAuctionLot.h"
#import "ARMacros.h"
#import "Artwork.h"


@interface LiveAuctionLot ()

@property (nonatomic, assign, readwrite) ARReserveStatus reserveStatus;
@property (nonatomic, assign, readwrite) NSInteger onlineAskingPriceCents;
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
        ar_keypath(LiveAuctionLot.new, artistName) : @"artwork.artist.name",
        ar_keypath(LiveAuctionLot.new, imageDictionary) : @"artwork.image",
        ar_keypath(LiveAuctionLot.new, currencySymbol) : @"symbol"
    };
}

- (NSURL *)urlForThumbnail
{
    return [NSURL URLWithString:self.imageDictionary[@"large"][@"url"]];
}

- (NSURL *)urlForProfile
{
    return [NSURL URLWithString:self.imageDictionary[@"thumb"][@"url"]];
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

- (void)updateReserveStatusWithString:(NSString *)reserveStatusString
{
    NSValueTransformer *transformer = [[self class] reserveStatusJSONTransformer];
    self.reserveStatus = [[transformer transformedValue:reserveStatusString] integerValue];
}

- (void)updateOnlineAskingPrice:(NSInteger)onlineAskingPrice
{
    self.onlineAskingPriceCents = onlineAskingPrice;
}

- (void)addEvents:(NSArray<NSString *> *)events
{
    NSMutableArray *copy = self.eventIDs.mutableCopy;
    [copy addObjectsFromArray:events];
    self.eventIDs = copy;
}

@end
