#import "Image.h"

static NSInteger ARTiledZoomMinLevel = 11;


@interface Image ()
@property (nonatomic, assign) NSInteger maxTileLevel;
@end


@implementation Image

+ (NSInteger)minimumZoomLevel
{
    return ARTiledZoomMinLevel;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"imageID" : @"id",
        @"url" : @"image_url",
        @"originalHeight" : @"original_height",
        @"originalWidth" : @"original_width",
        @"aspectRatio" : @"aspect_ratio",
        @"maxTiledHeight" : @"max_tiled_height",
        @"maxTiledWidth" : @"max_tiled_width",
        @"tileSize" : @"tile_size",
        @"tileBaseUrl" : @"tile_base_url",
        @"tileFormat" : @"tile_format",
        @"imageVersions" : @"image_versions"
    };
}

+ (NSValueTransformer *)downloadableTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([@[ @"aspectRatio", @"originalHeight", @"originalWidth" ] containsObject:key]) {
        [self setValue:@1 forKey:key];
    } else if ([@[ @"maxTiledHeight", @"maxTiledWidth", @"tileSize" ] containsObject:key]) {
        [self setValue:@0 forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

#pragma - fetching URLs

- (NSURL *)urlForSquareImage
{
    return [self imageURLWithFormatName:@"square"];
}

- (NSURL *)urlForThumbnailImage
{
    return [self imageURLWithFormatName:@"large"];
}

- (NSURL *)urlForDetailImage
{
    return [self imageURLWithFormatName:@"larger"];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    NSURL *URL = nil;
    if (self.imageVersions) {
        URL = [self _imageURLWithFormatName:formatName];
        if (URL == nil) {
            NSArray *allVersions = @[ @"medium", @"tall", @"large", @"larger" ];
            NSInteger index = [allVersions indexOfObject:formatName];
            if (index != NSNotFound) {
                // First try to use the next available higher resolution version.
                if (index < (allVersions.count - 1)) {
                    for (NSInteger i = index; URL == nil && i < allVersions.count; i++) {
                        URL = [self _imageURLWithFormatName:allVersions[i]];
                    }
                }
                // Otherwise use the next available lower resolution version.
                if (URL == nil) {
                    for (NSInteger i = index; URL == nil && i >= 0; i--) {
                        URL = [self _imageURLWithFormatName:allVersions[i]];
                    }
                }
            }
        }
    }
    return URL;
}

- (NSURL *)_imageURLWithFormatName:(NSString *)formatName;
{
    if ([self.imageVersions containsObject:formatName]) {
        NSString *url = [self.url stringByReplacingOccurrencesOfString:@":version" withString:formatName];
        if ([self.url hasPrefix:@"http"]) {
            return [NSURL URLWithString:url];
        } else {
            return [NSURL fileURLWithPath:url];
        }
    }
    return nil;
}

- (NSURL *)urlTileForLevel:(NSInteger)level atX:(NSInteger)x andY:(NSInteger)y
{
    NSString *url = [NSString stringWithFormat:@"%@/%@/%@_%@.%@", self.tileBaseUrl, @(level), @(x), @(y), self.tileFormat];
    return [NSURL URLWithString:url];
}

- (NSURL *)urlTileWithFormatName:(NSString *)formatName
{
    NSString *url = [NSString stringWithFormat:@"%@/%@.%@", self.tileBaseUrl, formatName, self.tileFormat];
    return [NSURL URLWithString:url];
}

- (BOOL)canZoom:(CGSize)targetSize
{
    CGFloat maxAvailableWidth = self.maxTiledWidth;
    CGFloat maxAvailableHeight = self.maxTiledHeight;
    return targetSize.width <= maxAvailableWidth && targetSize.height <= maxAvailableHeight;
}

- (NSInteger)maxTileLevel
{
    if (_maxTileLevel <= 0) {
        NSInteger width = _maxTiledWidth;
        NSInteger height = _maxTiledHeight;
        _maxTileLevel = ceil(log(MAX(width, height)) / log(2));
    }
    return _maxTileLevel;
}

- (NSString *)baseImageURL
{
    return self.url;
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Image *image = object;
        return [image.imageID isEqualToString:self.imageID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.imageID.hash;
}

@end
