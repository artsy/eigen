#import "UIImage+ImageFromColor.h"

static NSCache *imageCache;


@implementation UIImage (ImageWithColor)

// creates a 1x1 UIImage with a color and caches it
// derived from http://stackoverflow.com/questions/2808888/is-it-even-possible-to-change-a-uibuttons-background-color

+ (UIImage *)imageFromColor:(UIColor *)color
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        imageCache = [[NSCache alloc] init];
    });

    UIImage *image = [imageCache objectForKey:color];
    if (!image) {
        image = [self.class imageFromColor:color withSize:CGSizeMake(1, 1)];
        [imageCache setObject:image forKey:color];
    }

    return image;
}

+ (UIImage *)imageFromColor:(UIColor *)color withSize:(CGSize)size
{
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);

    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return image;
}

@end
