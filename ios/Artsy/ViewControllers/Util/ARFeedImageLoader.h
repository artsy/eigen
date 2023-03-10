#import <UIKit/UIKit.h>

@class Image;

typedef NS_ENUM(NSInteger, ARFeedItemImageSize) {
    ARFeedItemImageSizeAuto,
    ARFeedItemImageSizeSmall,
    ARFeedItemImageSizeMasonry,
    ARFeedItemImageSizeLarge
};


@interface ARFeedImageLoader : NSObject

- (void)loadImageAtAddress:(NSString *)baseImageURL desiredSize:(ARFeedItemImageSize)desiredSize forImageView:(UIImageView *)imageView customPlaceholder:(UIImage *)customPlaceholder;

+ (UIImage *)cachedImageForPath:(NSString *)imagePath;

+ (UIImage *)defaultPlaceholder;

+ (UIImage *)bestAvailableCachedImageForBaseURL:(NSURL *)url;
@end
