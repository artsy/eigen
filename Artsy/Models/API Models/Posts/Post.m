@implementation Post

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"postID" : @"id",
        @"title" : @"title"
    };
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        Post *post = object;
        return [post.postID isEqualToString:self.postID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.postID.hash;
}

@end
