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

    if ([ARLogger shouldLogNetworkRequests]) {
        // SDWebImage might not call the callback in case an image view is deallocated in the
        // meantime, so associate the start date to it so the date's lifetime will be tied to the
        // image view.
        static void *ARAsyncImageLoadingStartDate = &ARAsyncImageLoadingStartDate;
        objc_setAssociatedObject(self, ARAsyncImageLoadingStartDate, [NSDate date], OBJC_ASSOCIATION_RETAIN_NONATOMIC);

        [self sd_setImageWithURL:url
                placeholderImage:placeholder
                       completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            NSTimeInterval elapsedTime = [[NSDate date] timeIntervalSinceDate:objc_getAssociatedObject(self, ARAsyncImageLoadingStartDate)];
            objc_setAssociatedObject(self, ARAsyncImageLoadingStartDate, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
            if (error) {
                // SDWebImage uses -[NSError code] to communicate the HTTP status code.
                NSInteger status = NSURLErrorUnknown;
                if (error.domain == NSURLErrorDomain) {
                    if (error.code == NSURLErrorFileDoesNotExist) {
                        // SDWebImage's cache feature will try to load the image from disk, but if
                        // the original request failed to load the cached file won't exist either.
                        // This is not very interesting to show in the logs.
                        return;
                    }
                    if (error.code >= 400 && error.code < 600) {
                        status = error.code;
                    }
                }
                ARErrorLog(@"[Error] %ld '%@' [%.04f s]: %@", (long)status, imageURL, elapsedTime, error);
            } else {
                // This might actually be another 2xx status code, but let's assume 200 for now.
                ARActionLog(@"[Success] 200 '%@' [%.04f s]", imageURL, elapsedTime);
            }
            if (completionBlock) {
                completionBlock(image, error, cacheType, imageURL);
            }
        }];
    } else {
        [self sd_setImageWithURL:url placeholderImage:placeholder completed:completionBlock];
    }
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
