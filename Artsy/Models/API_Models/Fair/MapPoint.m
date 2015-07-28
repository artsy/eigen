


@implementation MapPoint

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"x" : @"x",
        @"y" : @"y",
        @"z" : @"z",
    };
}

- (CGPoint)coordinateOnImage:(Image *)image
{
    return CGPointMake(image.maxTiledWidth * self.x, image.maxTiledHeight - (image.maxTiledHeight * self.y));
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        MapPoint *mapPoint = object;
        return mapPoint.x == self.x && mapPoint.y == self.y && mapPoint.z == self.z;
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.x + self.y + self.z;
}


@end
