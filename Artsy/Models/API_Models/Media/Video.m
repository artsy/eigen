

@implementation Video

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"videoID" : @"id",
        @"title" : @"title",
        @"subtitle" : @"subtitle"
    };
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Video *video = object;
        return [video.videoID isEqualToString:self.videoID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.videoID.hash;
}

@end
