#import "Artwork.h"
#import "ARStandardDateFormatter.h"
#import "Fair.h"
#import "Location.h"
#import "NSDate+DateRange.h"
#import "Partner.h"
#import "PartnerShow.h"

#import "ARMacros.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

static ARStandardDateFormatter *staticDateFormatter;


@interface PartnerShow ()
@property (nonatomic, copy, readonly) NSString *imageAddress;
@property (nonatomic, copy, readonly) NSArray *imageVersions;
@end


@implementation PartnerShow

- (id)initWithShowID:(NSString *)showID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _showID = showID;

    return self;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(PartnerShow.new, showID) : @"id",
        ar_keypath(PartnerShow.new, showUUID) : @"_id",
        ar_keypath(PartnerShow.new, partner) : @"partner",
        ar_keypath(PartnerShow.new, artworks) : @"artworks",
        ar_keypath(PartnerShow.new, artists) : @"artists",
        ar_keypath(PartnerShow.new, fair) : @"fair",
        ar_keypath(PartnerShow.new, installationShots) : @"installation_shots",
        ar_keypath(PartnerShow.new, posts) : @"posts",
        ar_keypath(PartnerShow.new, name) : @"name",
        ar_keypath(PartnerShow.new, startDate) : @"start_at",
        ar_keypath(PartnerShow.new, endDate) : @"end_at",
        ar_keypath(PartnerShow.new, imageAddress) : @"image_url",
        ar_keypath(PartnerShow.new, imageVersions) : @"image_versions",
        ar_keypath(PartnerShow.new, location) : @"location",
        ar_keypath(PartnerShow.new, locationInFair) : @"fair_location.display",
        ar_keypath(PartnerShow.new, officialDescription) : @"description",
    };
}

+ (NSValueTransformer *)fairJSONTransformer
{
    return [NSValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Fair class]];
}

+ (NSValueTransformer *)artworksJSONTransformer
{
    return [NSValueTransformer mtl_JSONArrayTransformerWithModelClass:[Artwork class]];
}

+ (NSValueTransformer *)partnerJSONTransformer
{
    return [NSValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Partner class]];
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)locationJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Location class]];
}

- (NSString *)title
{
    if (self.partner && self.partner.name) {
        return self.partner.name;

    } else if (self.name) {
        return self.name;

    } else if (self.artists.count) {
        return [self.artists[0] name];
    }

    return nil;
}

- (NSString *)subtitle
{
    if (self.fair) {
        return self.fair.name;
    }

    return self.name;
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"Show ( %@ at %@ ) ", self.name, self.ausstellungsdauer];
}


- (NSString *)ausstellungsdauer
{
    if (self.fair) {
        return self.fair.ausstellungsdauer;
    }
    return [self.startDate ausstellungsdauerToDate:self.endDate];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:self.class]) {
        return [self.showID isEqualToString:[object showID]];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.showID.hash;
}

// TODO, this is not correct!

- (NSURL *)smallPreviewImageURL
{
    if ([self.imageVersions includes:@"square"]) {
        return [self imageURLWithFormatName:@"square"];
    }
    return [self imageURLWithFormatName:self.imageVersions.first];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    if (self.imageAddress && self.imageVersions.count > 0 && [self.imageVersions includes:formatName]) {
        NSString *url = [self.imageAddress stringByReplacingOccurrencesOfString:@":version" withString:formatName];
        return [NSURL URLWithString:url];
    } else {
        return nil;
    }
}

- (NSString *)ausstellungsdauerAndLocation
{
    NSString *ausstellungsdauer = self.ausstellungsdauer;
    if (self.fair && self.locationInFair && ![self.locationInFair isEqualToString:@""]) {
        return [NSString stringWithFormat:@"%@, %@", ausstellungsdauer, self.locationInFair];

    } else if (self.location.city && ![self.location.city isEqualToString:@""]) {
        return [NSString stringWithFormat:@"%@, %@", ausstellungsdauer, self.location.city];

    } else {
        return self.ausstellungsdauer;
    }
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.showID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/show/%@", self.showID];
}

@end
