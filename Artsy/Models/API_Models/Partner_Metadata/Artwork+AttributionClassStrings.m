#import "Artwork.h"
#import "Artwork+AttributionClassStrings.h"


@implementation Artwork (AttributionClassStrings)

- (NSString *)shortDescriptionForAttributionClass
{
    if ([self.attributionClass isEqualToString:@"unique"]) {
        return @"This is a unique work.";

    } else if ([self.attributionClass isEqualToString:@"limited edition"]) {
        return @"This is part of a limited edition set.";

    } else if ([self.attributionClass isEqualToString:@"made-to-order"]) {
        return @"This is a made-to-order piece.";

    } else if ([self.attributionClass isEqualToString:@"reproduction"]) {
        return @"This work is a reproduction.";

    } else if ([self.attributionClass isEqualToString:@"editioned multiple"]) {
        return @"This is an editioned multiple.";

    } else if ([self.attributionClass isEqualToString:@"non-editioned multiple"]) {
        return @"This is a non-editioned multiple.";

    } else if ([self.attributionClass isEqualToString:@"ephemera"]) {
        return @"This is a peripheral artifact related to the artist.";

    } else {
        return nil;
    }
}

@end
