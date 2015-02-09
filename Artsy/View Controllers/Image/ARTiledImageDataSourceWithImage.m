#import "ARTiledImageDataSourceWithImage.h"

@implementation ARTiledImageDataSourceWithImage

- (id)initWithImage:(Image *)image
{
    self = [super init];
    if (!self) { return nil; }

    _image = image;

    self.tileFormat = @"jpg";
    self.tileBaseURL = [NSURL URLWithString:self.image.tileBaseUrl];
    self.tileSize = image.tileSize;
    self.maxTiledHeight = self.image.maxTiledHeight;
    self.maxTiledWidth = self.image.maxTiledWidth;
    self.maxTileLevel = self.image.maxTileLevel;
    self.minTileLevel = 11;

    return self;
}

- (NSURL *)tiledImageView:(ARTiledImageView *)imageView urlForImageTileAtLevel:(NSInteger)level x:(NSInteger)x y:(NSInteger)y
{
    return [self.image urlTileForLevel:level atX:x andY:y];
}

@end
