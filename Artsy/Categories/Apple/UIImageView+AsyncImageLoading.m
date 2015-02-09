#import <SDWebImage/UIImageView+WebCache.h>

@implementation UIImageView (AsyncImageLoading)

- (void)ar_setImageWithURL:(NSURL *)url
{
    UIImage *placeholder = [UIImage imageFromColor:[UIColor artsyLightGrey]];
    [self sd_setImageWithURL:url placeholderImage:placeholder];
}

- (void)ar_setImageWithURL:(NSURL *)url completed:(SDWebImageCompletionBlock)completed
{
    UIImage *placeholder = [UIImage imageFromColor:[UIColor artsyLightGrey]];
    [self sd_setImageWithURL:url placeholderImage:placeholder completed:completed];
}

- (void)ar_setImageWithURL:(NSURL *)url
          placeholderImage:(UIImage *)placeholder
{
    if (!placeholder) {
      placeholder = [UIImage imageFromColor:[UIColor artsyLightGrey]];
    }

    [self sd_setImageWithURL:url placeholderImage:placeholder];
}

@end
