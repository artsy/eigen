#import "ARStandardDateFormatter.h"
#import "BuyersPremium.h"


@implementation Sale

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"saleID" : @"id",
        @"isAuction" : @"is_auction",
        @"startDate" : @"start_at",
        @"endDate" : @"end_at",
        @"buyersPremium" : @"buyers_premium"
    };
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)highestBidJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:BuyersPremium.class];
}

- (BOOL)isCurrentlyActive
{
    NSDate *now = [ARSystemTime date];
    return (([now compare:self.startDate] != NSOrderedAscending) &&
            ([now compare:self.endDate] != NSOrderedDescending));
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Sale *sale = object;
        return [sale.saleID isEqualToString:self.saleID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.saleID.hash;
}

- (BOOL)hasBuyersPremium
{
    return self.buyersPremium != nil;
}

- (AFJSONRequestOperation *)getArtworks:(void (^)(NSArray *artworks))success;
{
    return [ArtsyAPI getArtworksForSale:self.saleID success:success failure:^(NSError *_) { success(@[]);
    }];
}

@end
