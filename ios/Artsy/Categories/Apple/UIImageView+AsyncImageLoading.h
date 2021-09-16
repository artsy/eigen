/// @class Allow us to easily switch out the image downloading process

#import <SDWebImage/SDWebImageManager.h>


@interface UIImageView (AsyncImageLoading)

- (void)ar_setImageWithURL:(NSURL *)url;

- (void)ar_setImageWithURL:(NSURL *)url completed:(SDExternalCompletionBlock)completed;

- (void)ar_setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder;

@end
