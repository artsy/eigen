#import "ARStandardDateFormatter.h"

@implementation AuctionLot

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"auctionLotID" : @"id",
        @"dimensionsCM" : @"dimensions.cm",
        @"dimensionsInches" : @"dimensions.in",
        @"estimate" : @"estimate_text",
        @"price" : @"price_realized_text",
        @"dates" : @"dates_text",
        @"auctionDate" : @"auction_date",
        @"auctionDateText" : @"auction_dates_text",
        @"imageURLs" : @"image_urls",
        @"externalURL" : @"external_url",
    };
}

+ (NSValueTransformer *)externalURLJSONTransformer {
    return [NSValueTransformer valueTransformerForName:MTLURLValueTransformerName];
}

+ (NSValueTransformer *)auctionDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        AuctionLot *auctionLot = object;
        return [auctionLot.auctionLotID isEqualToString:self.auctionLotID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.auctionLotID.hash;
}

- (NSURL *)imageURL
{
    NSString *imageURL = nil;
    if (self.imageURLs.count > 0){
        if ([self.imageURLs objectForKey:@"thumbnail"]) {
            imageURL  = [self.imageURLs objectForKey:@"thumbnail"];
        } else {
            NSArray *values = [self.imageURLs allValues];
            imageURL = [values objectAtIndex:0];
        }
        return [NSURL URLWithString:imageURL];
    } else {
        return nil;
    }

}

@end
