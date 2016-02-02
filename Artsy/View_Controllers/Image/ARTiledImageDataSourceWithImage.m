#import "ARTiledImageDataSourceWithImage.h"

#import "Artwork.h"

#import <ARAnalytics/ARAnalytics.h>


@implementation ARTiledImageDataSourceWithImage

- (id)initWithImage:(Image *)image
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _image = image;
    ARLog(@"ARTiledImageDataSourceWithImage (%p) created for imageID:%@ URL:%@", (__bridge void *)self, _image.imageID, _image.urlForDetailImage);

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
    NSURL *URL = [self.image urlTileForLevel:level atX:x andY:y];
    ARLog(@"ARTiledImageView (%p) will draw imageID:%@ URL:%@", (__bridge void *)imageView, self.image.imageID, URL);
    return URL;
}

@end
