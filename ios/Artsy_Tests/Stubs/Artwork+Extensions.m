#import "Artwork+Extensions.h"


@implementation Artwork (Extensions)

+ (instancetype)stubbedArtwork
{
    return [Artwork modelWithJSON:[self stubbedArtworkJSON]];
}

+ (NSDictionary *)stubbedArtworkJSON
{
    return @{
        @"id" : @"stubbed",
        @"title" : @"Artwork Title",
        @"availability" : @"sold",
        @"sold" : @YES,
        @"price" : @"$5,000",
        @"acquireable" : @NO,
        @"sale_artwork": @{
            @"id": @"stubbed",
            @"auction": @{
                @"id": @"stubbed"
            }
        }
    };
}

@end
