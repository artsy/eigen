#import "PostImage.h"

#define THUMBNAIL_SIZE @"large"

@implementation PostImage

+ (NSDictionary *)JSONKeyPathsByPropertyKey {
    return @{
        @"imageID" : @"id",
        @"url" : @"image_url",
        @"originalHeight" : @"original_height",
        @"originalWidth" : @"original_width",
        @"aspectRatio" : @"aspect_ratio"
    };
}

- (CGSize)maxSize {
    return CGSizeMake(self.originalWidth, self.originalHeight);
}

- (NSURL *)urlForThumbnail {
    NSString *url = [self.url stringByReplacingOccurrencesOfString:@":version" withString:THUMBNAIL_SIZE];
    return [NSURL URLWithString: url];
}

- (void)setNilValueForKey:(NSString *)key {
    if ([@[@"aspectRatio", @"originalHeight", @"originalWidth"] containsObject:key]) {
        [self setValue:@1 forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

- (CGFloat)aspectRatio {
    return  _aspectRatio ? _aspectRatio : 1;
}

- (NSString*)baseImageURL
{
    return self.url;
}


- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        PostImage *postImage = object;
        return [postImage.imageID isEqualToString:self.imageID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.imageID.hash;
}

@end
