#import "ARStandardDateFormatter.h"
#import "NSDate+DateRange.h"

static ARStandardDateFormatter *staticDateFormatter;

@interface PartnerShow()
@property (nonatomic, copy, readonly) NSString *imageAddress;
@property (nonatomic, copy, readonly) NSArray *imageVersions;
@end

@implementation PartnerShow

- (id)initWithShowID:(NSString *)showID
{
    self = [super init];
    if (!self) { return nil; }

    _showID = showID;

    return self;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @keypath(PartnerShow.new, showID) : @"id",
        @keypath(PartnerShow.new, partner): @"partner",
        @keypath(PartnerShow.new, artworks) : @"artworks",
        @keypath(PartnerShow.new, artists) : @"artists",
        @keypath(PartnerShow.new, fair) : @"fair",
        @keypath(PartnerShow.new, installationShots): @"installation_shots",
        @keypath(PartnerShow.new, posts): @"posts",
        @keypath(PartnerShow.new, name) : @"name",
        @keypath(PartnerShow.new, startDate): @"start_at",
        @keypath(PartnerShow.new, endDate) : @"end_at",
        @keypath(PartnerShow.new, imageAddress) : @"image_url",
        @keypath(PartnerShow.new, imageVersions) : @"image_versions",
        @keypath(PartnerShow.new, location) : @"location",
        @keypath(PartnerShow.new, locationInFair) : @"fair_location.display",
        @keypath(PartnerShow.new, fairLocation) : @"fair_location",
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

+ (NSValueTransformer *)fairLocationJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[PartnerShowFairLocation class]];
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
    return [MTLValueTransformer transformerWithBlock:^(NSDictionary *item) {
        if (!item) {
            return @"";
        }
        return (NSString *)item[@"city"];
    }];
}


- (NSString *)title
{
    if (self.partner && self.partner.name) {
        return self.partner.name;

    } else if(self.name) {
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

// Used in a maps predicate
- (BOOL)hasMapLocation
{
    return [self.fairLocation.mapPoints count] > 0;
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:self.class]){
        return [self.showID isEqualToString:[object showID]];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.showID.hash;
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
        return [NSString stringWithFormat: @"%@, %@", ausstellungsdauer, self.locationInFair];

    } else if (self.location && ![self.location isEqualToString:@""]) {
        return [NSString stringWithFormat: @"%@, %@", ausstellungsdauer, self.location];

    } else {
        return self.ausstellungsdauer;
    }
}

#pragma mark ShareableObject

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/show/%@", self.showID];
}

@end
