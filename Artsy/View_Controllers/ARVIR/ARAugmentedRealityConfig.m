#import "ARAugmentedRealityConfig.h"

@implementation ARAugmentedRealityConfig

- (nonnull instancetype)initWithImage:(nonnull UIImage *)image
                                 size:(CGSize)size
                                depth:(CGFloat)depth {
    self = [super init];

    _image = image;
    _size = size;
    _depth = depth;

    return self;
}

- (instancetype)initWithImage:(UIImage *)image
                         size:(CGSize)size {
    return [self initWithImage:image size:size depth:0.75];
}
@end
