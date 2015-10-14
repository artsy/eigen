#import "ARLogger.h"
#import "ARItemThumbnailViewCell.h"

#import "ARHasImageBaseURL.h"
#import "ARPostAttachment.h"

#import "UIImageView+AsyncImageLoading.h"

@interface ARItemThumbnailViewCell ()
@property (nonatomic, strong) UIImageView *imageView;
@end


@implementation ARItemThumbnailViewCell

- (void)prepareForReuse
{
    self.imageView.image = [ARFeedImageLoader defaultPlaceholder];
}

- (void)setupWithRepresentedObject:(id)object
{
    if (!self.imageView) {
        UIImageView *imageView = [[UIImageView alloc] init];
        imageView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        imageView.contentMode = UIViewContentModeScaleAspectFill;
        imageView.clipsToBounds = YES;

        [self.contentView addSubview:imageView];
        [imageView alignToView:self.contentView];

        self.imageView = imageView;
    }

    if ([object conformsToProtocol:@protocol(ARHasImageBaseURL)]) {
        NSString *baseUrl = [object baseImageURL];
        CGSize imageSize = self.bounds.size;
        ARFeedItemImageSize size = self.imageSize;

        if (self.imageSize == ARFeedItemImageSizeAuto) {
            CGFloat longestDimension = (imageSize.height > imageSize.height) ? imageSize.height : imageSize.width;
            size = (longestDimension > 100) ? ARFeedItemImageSizeLarge : ARFeedItemImageSizeSmall;
        }

        [[ARFeedImageLoader alloc] loadImageAtAddress:baseUrl desiredSize:size
                                         forImageView:self.imageView
                                    customPlaceholder:nil];
    }

    //TODO - deprecate this
    else if ([object respondsToSelector:@selector(urlForThumbnail)]) {
        NSURL *url = [object urlForThumbnail];
        [self.imageView ar_setImageWithURL:url];

    } else {
        // HACK: this needs a better implementation?
        ARErrorLog(@"Could not make thumbnail for %@", object);
    }

    if ([object respondsToSelector:@selector(title)]) {
        self.accessibilityLabel = [object title];
        self.isAccessibilityElement = YES;
        self.accessibilityTraits = UIAccessibilityTraitButton;
    }
}

@end
