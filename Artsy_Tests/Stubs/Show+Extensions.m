#import "Show+Extensions.h"


@implementation PartnerShow (Extensions)

+ (instancetype)stubbedShow
{
    return [PartnerShow modelWithJSON:[self stubbedShowJSON]];
}

+ (NSDictionary *)stubbedShowJSON
{
    return @{
        @"id" : @"stubbed",
        @"name" : @"Artwork Title",
        @"startDate" : @"2011-10-21T16:33:45+00:00",
        @"endDate" : @"2011-10-29T16:33:45+00:00",
        @"status" : @"open",
        @"description" : @"OK",
    };
}

@end
