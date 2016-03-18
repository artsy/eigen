#import "LiveAuctionLot.h"
#import "ARMacros.h"
#import "Artwork.h"


@implementation LiveAuctionLot

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

@end
