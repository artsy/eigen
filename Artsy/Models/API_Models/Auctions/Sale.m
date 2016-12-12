#import "Sale.h"

#import "ARMacros.h"
#import "ArtsyAPI+Sales.h"
#import "ARStandardDateFormatter.h"
#import "BuyersPremium.h"
#import "ARSystemTime.h"
#import "Profile.h"
#import "Bid.h"
#import "ARTwoWayDictionaryTransformer.h"

@import ObjectiveSugar;


@interface Sale ()

@property (nonatomic, copy) NSDictionary *imageURLs;

@end


@implementation Sale

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Sale.new, saleID) : @"id",
        ar_keypath(Sale.new, isAuction) : @"is_auction",
        ar_keypath(Sale.new, startDate) : @"start_at",
        ar_keypath(Sale.new, endDate) : @"end_at",
        ar_keypath(Sale.new, saleState) : @"auction_state",
        ar_keypath(Sale.new, liveAuctionStartDate) : @"live_start_at",
        ar_keypath(Sale.new, registrationEndsAtDate) : @"registration_ends_at",
        ar_keypath(Sale.new, buyersPremium) : @"buyers_premium",
        ar_keypath(Sale.new, imageURLs) : @"image_urls",
        ar_keypath(Sale.new, saleDescription) : @"description",
    };
}

+ (NSValueTransformer *)profileJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:Profile.class];
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)registrationEndsAtDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)liveAuctionStartDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)highestBidJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:Bid.class];
}

+ (NSValueTransformer *)saleStateJSONTransformer
{
    return [ARTwoWayDictionaryTransformer reversibleTransformerWithDictionary:@{
        @"preview" : @(SaleStatePreview),
        @"open" : @(SaleStateOpen),
        @"closed" : @(SaleStateClosed),
    }];
}

- (BOOL)shouldShowLiveInterface
{
    NSDate *now = [ARSystemTime date];
    BOOL hasStarted = [self.liveAuctionStartDate compare:now] == NSOrderedAscending;
    BOOL hasEnded = self.saleState == SaleStateClosed;
    return self.liveAuctionStartDate && hasStarted && !hasEnded;
}

- (BOOL)isCurrentlyActive
{
    NSDate *now = [ARSystemTime date];
    return (([now compare:self.startDate] != NSOrderedAscending) &&
            ([now compare:self.endDate] != NSOrderedDescending));
}

- (NSString *)bannerImageURLString
{
    NSArray *desiredVersions = @[ @"wide", @"large_rectangle", @"square" ];
    NSArray *possibleVersions = [desiredVersions intersectionWithArray:[self.imageURLs allKeys]];
    return [self.imageURLs objectForKey:possibleVersions.firstObject];
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

- (AFHTTPRequestOperation *)getArtworks:(void (^)(NSArray *artworks))success;
{
    return [ArtsyAPI getArtworksForSale:self.saleID success:success failure:^(NSError *_) { success(@[]);
    }];
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.saleID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/auction/%@", self.saleID];
}


#pragma mark - ARSpotlightMetadataProvider


- (NSString *)spotlightDescription;
{
    return [NSString stringWithFormat:@"%@\n%@\n", self.name, self.saleDescription];
}

- (NSURL *)spotlightThumbnailURL;
{
    return [NSURL URLWithString:self.profile.iconURL];
}


@end
