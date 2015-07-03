

@implementation Tag

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"tagID" : @"id",
        @"name" : @"name"
    };
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Tag *tag = object;
        return [tag.tagID isEqualToString:self.tagID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.tagID.hash;
}

@end
