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
    if (image) {
        return image;
    }

    CGRect rect = CGRectMake(0, 0, 1, 1);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);

    image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    [imageCache setObject:image forKey:color];
    return image;
}

@end
