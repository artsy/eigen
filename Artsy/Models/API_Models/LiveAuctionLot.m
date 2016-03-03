#import "LiveAuctionLot.h"
#import "ARMacros.h"
#import "Artwork.h"


@implementation LiveAuctionLot

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveAuctionLot.new, liveAuctionID) : @"id",
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

+ (NSValueTransformer *)reserveStatusJSONTransformer
{
    return [SaleArtwork reserveStatusJSONTransformer];
}

@end
