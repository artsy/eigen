#import "ARValueTransformer.h"

@interface Partner()
@property (nonatomic, copy, readonly) NSString *imageAddress;
@end


@implementation Partner

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @keypath(Partner.new, name) : @"name",
        @keypath(Partner.new, shortName) : @"short_name",
        @keypath(Partner.new, partnerID) : @"id",
        @keypath(Partner.new, defaultProfilePublic) : @"default_profile_public",
        @keypath(Partner.new, profileID) : @"default_profile_id",
        @keypath(Partner.new, imageAddress) : @"image_url",
    };
}

+ (NSValueTransformer *)typeJSONTransformer
{
    NSDictionary *types = @{
         @"Gallery": @(ARPartnerTypeGallery),
         @"Museum": @(ARPartnerTypeMuseum),
         @"Artist Estate": @(ARPartnerTypeArtistEstate),
         @"Private Collection": @(ARPartnerTypePrivateCollection),
         @"Foundation": @(ARPartnerTypeFoundation),
         @"Public Domain": @(ARPartnerTypePublicDomain),
         @"Image Archive": @(ARPartnerTypeImageArchive),
         @"Non Profit": @(ARPartnerTypeNonProfit),
     };

    return [ARValueTransformer enumValueTransformerWithMap:types];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    NSString *url = [self.imageAddress stringByReplacingOccurrencesOfString:@":version" withString:formatName];
    return [NSURL URLWithString:url];
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
    if([object isKindOfClass:[self class]]) {
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
