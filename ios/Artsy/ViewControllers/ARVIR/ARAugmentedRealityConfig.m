#import "ARAugmentedRealityConfig.h"

#import <CoreGraphics/CoreGraphics.h>

@implementation ARAugmentedRealityConfig

- (nonnull instancetype)initWithImage:(nonnull UIImage *)image
                                 size:(CGSize)size
                                depth:(CGFloat)depth {
    self = [super init];

    // ARKit doesn't handle greyscale images well at all. It interprets the
    // grey channel as R in an RGB image. This causes the image to appear
    // red instead of grey (see [MX-398] for a report on this). So when
    // creating this config object, check the colour space and re-draw the
    // image if it has anything but three channels.
    // Note: CGColorSpaceGetNumberOfComponents excludes alpha, so this code
    //       should work for images with alpha too.
    CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
    if (CGColorSpaceGetNumberOfComponents(colorSpace) != 3) {
        CGSize imageSize = image.size;
        UIGraphicsBeginImageContext(imageSize);
        [image drawInRect:CGRectMake(0, 0, imageSize.width, imageSize.height)];
        _image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    } else {
        _image = image;
    }
    
    _size = size;
    _depth = depth;

    return self;
}

- (instancetype)initWithImage:(UIImage *)image
                         size:(CGSize)size {
    return [self initWithImage:image size:size depth:0.75];
}
@end
