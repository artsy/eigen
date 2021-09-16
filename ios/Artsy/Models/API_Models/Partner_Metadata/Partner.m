#import "Partner.h"
#import "ARValueTransformer.h"

#import "ARMacros.h"


@implementation Partner
@synthesize imageURLs;

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Partner.new, name) : @"name",
        ar_keypath(Partner.new, shortName) : @"short_name",
        ar_keypath(Partner.new, partnerID) : @"id",
        ar_keypath(Partner.new, defaultProfilePublic) : @"is_default_profile_public",
        ar_keypath(Partner.new, profileID) : @"default_profile_id",
        ar_keypath(Partner.new, imageURLs) : @"image_urls",
    };
}

+ (NSValueTransformer *)typeJSONTransformer
{
    NSDictionary *types = @{
        @"Gallery" : @(ARPartnerTypeGallery),
        @"Museum" : @(ARPartnerTypeMuseum),
        @"Artist Estate" : @(ARPartnerTypeArtistEstate),
        @"Private Collection" : @(ARPartnerTypePrivateCollection),
        @"Foundation" : @(ARPartnerTypeFoundation),
        @"Public Domain" : @(ARPartnerTypePublicDomain),
        @"Image Archive" : @(ARPartnerTypeImageArchive),
        @"Non Profit" : @(ARPartnerTypeNonProfit),
        @"Institution" : @(ARPartnerTypeInstitution)
    };

    return [ARValueTransformer enumValueTransformerWithMap:types];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    return [NSURL URLWithString:[self.imageURLs objectForKey:formatName]];
}

+ (NSValueTransformer *)defaultProfilePublicJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([key isEqualToString:@"type"]) {
        [self setValue:@(ARPartnerTypeGallery) forKey:key];
    } else if ([key isEqualToString:@"defaultProfilePublic"]) {
        [self setValue:@NO forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Partner *partner = object;
        return [partner.partnerID isEqualToString:self.partnerID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.partnerID.hash;
}


@end
