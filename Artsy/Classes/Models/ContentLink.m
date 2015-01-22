#import "ContentLink.h"
#import "VideoContentLink.h"
#import "PhotoContentLink.h"

@implementation ContentLink

+ (NSDictionary *)JSONKeyPathsByPropertyKey {
    return @{
        @"linkID" : @"id",
        @"thumbnailUrl" : @"oembed_json.thumbnail_url",
        @"url" : @"oembed_json.url",
        @"thumbnailHeight" : @"oembed_json.thumbnail_height",
        @"thumbnailWidth" : @"oembed_json.thumbnail_width",
        @"width" : @"oembed_json.width",
        @"height" : @"oembed_json.height",
        @"type" : @"oembed_json.type"
    };
}

+ (instancetype)modelWithDictionary:(NSDictionary *)dictionaryValue error:(NSError *__autoreleasing *)error {
    NSString *type = [dictionaryValue valueForKeyPath:@"type"];
    if ([type isEqualToString:@"video"]) {
        return [[VideoContentLink alloc] initWithDictionary:dictionaryValue error:error];

    } else if ([type isEqualToString:@"photo"]) {
        return [[PhotoContentLink alloc] initWithDictionary:dictionaryValue error:error];

    } else if ([type isEqualToString:@"link"]) {

        //TODO: this - maybe?!
        return [[PhotoContentLink alloc] initWithDictionary:dictionaryValue error:error];
    } else {
        NSLog(@"Error! Unknown content link type '%@'", type);
        return nil;
    }
}

- (CGFloat)aspectRatio {
    if (!self.height || !self.width) {
        return 1;
    }
    return (CGFloat)self.width/self.height;
}

- (CGSize)maxSize {
    if (!self.height || !self.width) {
        return CGSizeZero;
    }
    return CGSizeMake(self.width, self.height);
}

- (NSURL *)urlForThumbnail {
    return [NSURL URLWithString: self.url];
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        ContentLink *contentLink = object;
        return [contentLink.linkID isEqualToString:self.linkID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.linkID.hash;
}

@end
