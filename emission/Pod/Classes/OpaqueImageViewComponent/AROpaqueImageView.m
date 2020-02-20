#import "AROpaqueImageView.h"

#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImageManager.h>

// * Decode the image into a context so that none of that will occur on the main thread when UIImageView loads it.
// * Do not add an alpha channel, to ensure that the image will be drawn by UIImageView without any blending.
//
static void
LoadImage(UIImage *image, CGSize destinationSize, CGFloat scaleFactor, UIColor *backgroundColor, BOOL highPriority, void (^callback)(UIImage *loadedImage)) {
    dispatch_async(dispatch_get_global_queue(highPriority ? QOS_CLASS_USER_INTERACTIVE : QOS_CLASS_USER_INITIATED, 0), ^{
    CGFloat width = destinationSize.width * scaleFactor;
    CGFloat height = destinationSize.height * scaleFactor;
    NSCAssert(width != 0 && height != 0, @"Resizing an image to %fx%f makes no sense.", width, height);

    CGColorSpaceRef colourSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(NULL,
                                                 width,
                                                 height,
                                                 8,
                                                 0,
                                                 colourSpace,
                                                 kCGImageAlphaNoneSkipFirst | kCGBitmapByteOrder32Host);
    CGColorSpaceRelease(colourSpace);

    // Ensure there's no background fill weirdness for non-rectangular shapes
    CGContextSetFillColorWithColor(context, backgroundColor.CGColor);
    CGContextFillRect(context, CGRectMake(0, 0, width, height));


    CGContextDrawImage(context, CGRectMake(0, 0, width, height), image.CGImage);

    CGImageRef outputImage = CGBitmapContextCreateImage(context);
    UIImage *loadedImage = [UIImage imageWithCGImage:outputImage
                                               scale:scaleFactor
                                         orientation:UIImageOrientationUp];

    CGImageRelease(outputImage);
    CGContextRelease(context);

    dispatch_async(dispatch_get_main_queue(), ^{
      callback(loadedImage);
    });
  });
}

@interface AROpaqueImageView ()
@property (nonatomic, weak, readwrite) id<SDWebImageOperation> downloadOperation;
@end

@implementation AROpaqueImageView

- (instancetype)initWithFrame:(CGRect)frame;
{
  if ((self = [super initWithFrame:frame])) {
    self.opaque = YES;
  }
  return self;
}

- (void)setImage:(UIImage *)image;
{
  // This will cancel an in-flight download operation, if one exists.
  self.imageURL = nil;

  if (self.noAnimation) {
    [super setImage:image];
  } else {
    [UIView transitionWithView:self
                      duration:0.25
                       options:UIViewAnimationOptionTransitionCrossDissolve
                    animations:^{ [super setImage:image]; }
                    completion:nil];
  }
}

- (void)setImageURL:(NSURL *)imageURL;
{
  if ([_imageURL isEqual:imageURL]) {
    return;
  }

  // This is a weak reference, so either an operation is in-flight and
  // needs cancelling, or it will be nil and this is a no-op.
  [self.downloadOperation cancel];

  _imageURL = imageURL;
  if (_imageURL == nil) {
    return;
  }

  // TODO: Setting decompress to NO, because Eigen sets it to YES.
  //      We need to send a PR to SDWebImage to disable decoding
  //      with an option to the download method.
  //
  SDWebImageManager *manager = [SDWebImageManager sharedManager];

  manager.imageCache.shouldDecompressImages = NO;
  manager.imageDownloader.shouldDecompressImages = NO;

  __weak typeof(self) weakSelf = self;
  [manager cachedImageExistsForURL:self.imageURL completion:^(BOOL isInCache) {
    if (!isInCache) {
      self.backgroundColor = self.placeholderBackgroundColor;
    }
    self.downloadOperation = [manager downloadImageWithURL:self.imageURL
                                                   options:self.highPriority ? SDWebImageHighPriority : 0
                                                  progress:nil
                                                 completed:^(UIImage *image,
                                                             NSError *error,
                                                             SDImageCacheType __,
                                                             BOOL completed,
                                                             NSURL *imageURL) {

     __strong typeof(weakSelf) strongSelf = weakSelf;
     // Only really assign if the URL we downloaded still matches `self.imageURL`.
     if (strongSelf && [imageURL isEqual:strongSelf.imageURL]) {
       if (strongSelf.failSilently && (error != nil || !completed)) {
         return;
       }
       // The view might not yet be associated with a window, in which case
       // -[UIView contentScaleFactor] would always return 1, so use screen instead.
       CGFloat scaleFactor = [[UIScreen mainScreen] scale];
       LoadImage(image, strongSelf.bounds.size, scaleFactor, strongSelf.placeholderBackgroundColor, strongSelf.highPriority, ^(UIImage *loadedImage) {
         if ([imageURL isEqual:weakSelf.imageURL]) {
           weakSelf.image = loadedImage;
         }
       });
     }
   }];
  }];
}

@end
