#import "Image.h"

#import <ARTiledImageView/ARTiledImageView.h>
#import <ARTiledImageView/ARWebTiledImageDataSource.h>


@interface ARTiledImageDataSourceWithImage : ARWebTiledImageDataSource

- (id)initWithImage:(Image *)image;
@property (nonatomic, strong, readonly) Image *image;

@end
