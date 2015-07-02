

@implementation SiteFeature

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{ @"siteFeatureID" : @"id" };
}

+ (NSValueTransformer *)enabledTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        SiteFeature *siteFeature = object;
        return [siteFeature.siteFeatureID isEqualToString:self.siteFeatureID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.siteFeatureID.hash;
}

@end
