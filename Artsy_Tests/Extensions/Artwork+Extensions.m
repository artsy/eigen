#import "Artwork+Extensions.h"


@implementation Artwork (Extensions)

+ (id)stubbedArtwork
{
    return [Artwork modelWithJSON:[self stubbedArtworkJSON]];
}

+ (id)stubbedArtworkJSON
{
    return @{ @"id" : @"stubbed" };
}

@end
