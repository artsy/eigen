#import "ARLogger.h"
#import "Fair.h"

#import "ARAppConstants.h"
#import "ARStandardDateFormatter.h"
#import "NSDate+DateRange.h"
#import "ARFileUtils.h"
#import "FairOrganizer.h"
#import "PartnerShow.h"
#import "Partner.h"

#import "ARMacros.h"
#import "ARDispatchManager.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@interface Fair () {
    NSMutableSet *_showsLoadedFromArchive;
}

// Note: *must* be strong and not copy, because copy will make a non-mutable copy.
@property (nonatomic, strong) NSMutableSet *shows;

@property (nonatomic, copy) NSDictionary *imageURLs;
@property (nonatomic, copy) NSDictionary *bannerURLs;

@end


@implementation Fair

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Fair.new, name) : @"name",
        ar_keypath(Fair.new, fairID) : @"id",
        ar_keypath(Fair.new, organizer) : @"organizer",
        ar_keypath(Fair.new, startDate) : @"start_at",
        ar_keypath(Fair.new, endDate) : @"end_at",
        ar_keypath(Fair.new, city) : @"location.city",
        ar_keypath(Fair.new, state) : @"location.state",
        ar_keypath(Fair.new, imageURLs) : @"image_urls",
        ar_keypath(Fair.new, bannerURLs) : @"banner_image_urls",
        ar_keypath(Fair.new, partnersCount) : @"partners_count",
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

+ (NSValueTransformer *)organizerJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[FairOrganizer class]];
}

- (NSString *)ausstellungsdauer
{
    return [self.startDate ausstellungsdauerToDate:self.endDate];
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    return self;
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    self = [self init];

    _fairID = fairID;

    return self;
}

+ (BOOL)automaticallyNotifiesObserversForKey:(NSString *)key
{
    if ([key isEqualToString:ar_keypath(Fair.new, shows)]) {
        return NO;
    }

    return [super automaticallyNotifiesObserversForKey:key];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:self.class]) {
        return [[object fairID] isEqualToString:self.fairID];
    }
    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.fairID.hash;
}

- (PartnerShow *)findShowForPartner:(Partner *)partner
{
    return [self.shows.allObjects find:^BOOL(PartnerShow *show) {
        return [show.partner isEqual:partner];
    }];
}

- (NSString *)location
{
    BOOL hasCity = self.city.length > 0;
    BOOL hasState = self.state.length > 0;

    if (hasCity && hasState) {
        return [NSString stringWithFormat:@"%@, %@", self.city, self.state];
    } else if (hasCity) {
        return self.city;
    } else if (hasState) {
        return self.state;
    } else {
        return nil;
    }
}

- (NSString *)bannerAddress
{
    NSString *url = [self.bannerURLs.allValues firstObject];
    if (!url) {
        NSArray *desiredVersions = @[ @"wide", @"large_rectangle", @"square" ];
        NSArray *possibleVersions = [desiredVersions intersectionWithArray:[self.imageURLs allKeys]];
        url = [self.imageURLs objectForKey:possibleVersions.firstObject];
    }
    return url;
}

- (BOOL)usesBrandedBanners
{
    return self.bannerURLs.allKeys.count > 0;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.fairID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/%@", self.fairID];
}

@end
