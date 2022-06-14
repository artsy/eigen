#import "ARFeedImageLoader.h"

#import "ARFonts.h"

#import "UIImage+ImageFromColor.h"
#import "UIImageView+AsyncImageLoading.h"
#import <SDWebImage/SDImageCache.h>
// From the gravity source

//version :small, if: :is_processing_delayed? do
//    process :resample => [[72, 150], 200]
//    process :resize_to_limit => [200, 200]
//end
//
//version :square, if: :is_processing_delayed? do
//    process :resample => [[72, 150], 230]
//    process :resize_to_fill => [230, 230]
//end
//
//# this is sized to height for fillwidth rows
//# (rather than limiting to 640 square like for :large)
//# this can leave medium images larger than large
//
//version :medium, if: :is_processing_delayed? do
//    process :resample => [[72, 150], 260]
//    process :resize_to_height => 260
//end
//
//# sized for width for artwork in artwork columns (shows feed item, filtering & layered search)
//
//version :tall, if: :is_processing_delayed? do
//    process :resample => [[72, 150], 260]
//    process :resize_to_limit => [260, 800]
//end
//
//version :large, if: :is_processing_delayed? do
//    process :resample => [[72, 150], 640]
//    process :resize_to_limit => [640, 640]
//end
//
//version :larger, if: :is_processing_delayed? do
//  process :resample => [[72, 150], 1024]
//  process :resize_to_limit => [1024, 1024]
//end

static NSString *ARImageSizeSmall = @"small";
static NSString *ARImageSizeLarge = @"large";
static NSString *ARImageSizeMasonry = @"tall";


@interface ARFeedImageLoader ()
@property (nonatomic, weak) UIImageView *imageView;
@property (nonatomic, strong) UIImage *image;
@property (nonatomic, copy) NSString *baseImageURL;
@end


@implementation ARFeedImageLoader

- (void)loadImageAtAddress:(NSString *)baseImageURL desiredSize:(ARFeedItemImageSize)desiredSize forImageView:(UIImageView *)imageView customPlaceholder:(UIImage *)customPlaceholder
{
    self.imageView = imageView;
    self.baseImageURL = baseImageURL;

    if (desiredSize == ARFeedItemImageSizeLarge) {
        // Check to see if we have a small image in cache first that we can use as a placeholder

        NSString *imagePath = [[self generateUrlForSize:ARFeedItemImageSizeSmall] absoluteString];
        UIImage *localImage = [self.class cachedImageForPath:imagePath];
        self.image = localImage;
    }

    if (!self.image) {
        self.image = customPlaceholder ?: [[self class] defaultPlaceholder];
    }

    [imageView ar_setImageWithURL:[self generateUrlForSize:desiredSize] placeholderImage:self.image];
}

+ (UIImage *)cachedImageForPath:(NSString *)imagePath
{
    return [SDImageCache.sharedImageCache imageFromMemoryCacheForKey:imagePath];
}

- (NSURL *)generateUrlForSize:(ARFeedItemImageSize)desiredSize
{
    if (!self.baseImageURL) return nil;

    NSString *size = nil;

    switch (desiredSize) {
        case ARFeedItemImageSizeAuto:
            NSAssert(NO, @"Shouldn't get to here with an auto size");
        case ARFeedItemImageSizeSmall:
            size = ARImageSizeSmall;
            break;

        case ARFeedItemImageSizeLarge:
            size = ARImageSizeLarge;
            break;

        case ARFeedItemImageSizeMasonry:
            size = ARImageSizeMasonry;
            break;
    }

    return [self imageURLWithFormatName:size];
}

- (NSURL *)imageURLWithFormatName:(NSString *)formatName
{
    NSString *url = [self.baseImageURL stringByReplacingOccurrencesOfString:@":version" withString:formatName];
    return [NSURL URLWithString:url];
}

+ (UIImage *)defaultPlaceholder
{
    return [UIImage imageFromColor:[UIColor artsyGrayRegular]];
}

+ (UIImage *)bestAvailableCachedImageForBaseURL:(NSURL *)url
{
    NSString *address = url.absoluteString;

    for (NSString *format in @[ ARImageSizeLarge, ARImageSizeMasonry, ARImageSizeSmall ]) {
        NSString *cachePath = [address stringByReplacingOccurrencesOfString:@":version" withString:format];

        UIImage *image = [self cachedImageForPath:cachePath];
        if (image) {
            return image;
        }
    }

    return nil;
}

@end
