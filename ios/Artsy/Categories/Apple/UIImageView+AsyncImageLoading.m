#import <SDWebImage/UIImageView+WebCache.h>
#import <SDImageCache.h>
#import <objc/runtime.h>

#import "ARAppConstants.h"
#import "ARFonts.h"
#import "ARLogger.h"

#import "UIImage+ImageFromColor.h"

@implementation UIImageView (AsyncImageLoading)

- (void)ar_setImageWithURL:(NSURL *)url
          placeholderImage:(UIImage *)placeholder
                 completed:(SDExternalCompletionBlock)completionBlock
{
    if (!placeholder) {
        placeholder = [UIImage imageFromColor:[UIColor artsyGrayRegular]];
    }

    // In testing provide the ability to do a synchronous fast image cache call
    if (!ARPerformWorkAsynchronously) {
        SDImageCache *imageCache = [SDImageCache sharedImageCache];
        NSString *key = url.absoluteString;
        [imageCache containsImageForKey:key cacheType:SDImageCacheTypeMemory completion:^(SDImageCacheType containsCacheType) {
            if (containsCacheType != SDImageCacheTypeNone) {
                [imageCache queryImageForKey:key options:SDWebImageQueryMemoryDataSync context:nil cacheType:containsCacheType completion:^(UIImage * _Nullable image, NSData * _Nullable data, SDImageCacheType cacheType) {
                    self.image = image;
                    if (completionBlock != nil) {
                        completionBlock(self.image, nil, containsCacheType, url);
                    }
                }];
                return;
            }
        }];
    }

    [self sd_setImageWithURL:url placeholderImage:placeholder completed:completionBlock];
}

- (void)ar_setImageWithURL:(NSURL *)url
{
    [self ar_setImageWithURL:url placeholderImage:nil completed:nil];
}

- (void)ar_setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder
{
    [self ar_setImageWithURL:url placeholderImage:placeholder completed:nil];
}

- (void)ar_setImageWithURL:(NSURL *)url completed:(SDExternalCompletionBlock)completionBlock{
    [self ar_setImageWithURL:url placeholderImage:nil completed:completionBlock];
}


@end
