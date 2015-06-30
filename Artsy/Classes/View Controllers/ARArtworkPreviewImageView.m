#import "ARArtworkPreviewImageView.h"
#import "ARFeedImageLoader.h"

@interface ARArtworkPreviewImageView()
@end

@implementation ARArtworkPreviewImageView

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }

    [self setContentHuggingPriority:1000 forAxis:UILayoutConstraintAxisVertical];
    self.userInteractionEnabled = YES;
    self.backgroundColor = [UIColor artsyLightGrey];

    // This in practice can occasionally crop by a pixel or so, which is acceptable
    self.contentMode = UIViewContentModeScaleAspectFit;

    // We cannot trust the aspect ratio from the server. If it's wrong it would overlap the buttons, thus we crop.
    self.clipsToBounds = YES;

    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(zoomTap:)];
    [self addGestureRecognizer:tapGesture];

    UIPinchGestureRecognizer *pinchGesture = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(zoomPinch:)];
    [self addGestureRecognizer:pinchGesture];

    return self;
}

-(void)setArtwork:(Artwork *)artwork
{
    _artwork = artwork;
    [self updateWithArtwork:artwork];
    @weakify(self);
    [artwork onArtworkUpdate:^{
        @strongify(self);
        [self updateWithArtwork:artwork];
    } failure:nil];
}

- (void)zoomTap:(UIGestureRecognizer *)gesture
{
    [self goToFullScreen];
}

- (void)zoomPinch:(UIPinchGestureRecognizer *)gesture
{
    if (gesture.state != UIGestureRecognizerStateBegan) {
        return;
    }

    self.userInteractionEnabled = NO;
    [self goToFullScreen];
}

- (void)goToFullScreen
{
    if ([self.artwork.defaultImage needsTiles]) {

        // Let the ArtworkVC decide what to do, pass via responder chain
        [self.delegate tappedTileableImagePreview];

    } else {
        // Do a small bounce when tapping an artwork which doesn't go full screen

        CGAffineTransform original = self.transform;
        [UIView animateKeyframesWithDuration:.25 delay:0 options:0 animations:^{
            [UIView addKeyframeWithRelativeStartTime:0 relativeDuration:.49 animations:^{
                self.transform = CGAffineTransformScale(original, original.a * 1.05, original.d * 1.05);
            }];
            [UIView addKeyframeWithRelativeStartTime:.5 relativeDuration:.5 animations:^{
                self.transform = original;
            }];
        } completion:nil];
    }
}

- (void)updateWithArtwork:(Artwork *)artwork
{
    NSURL *detailURL = artwork.defaultImage.urlForDetailImage;
    UIImage *placeholderImage = [self placeholderImageForArtwork:artwork];
    [self ar_setImageWithURL:detailURL placeholderImage:placeholderImage];
}

- (UIImage *)placeholderImageForArtwork:(Artwork *)artwork
{
    NSURL *imageURL = [NSURL URLWithString:artwork.defaultImage.baseImageURL];
    UIImage *image;
    image = [ARFeedImageLoader bestAvailableCachedImageForBaseURL:imageURL];
//    Temporarily disable this to see if it’s related to https://github.com/artsy/eigen/issues/526.
//    if (!image) {
//        // Multiply by 1000 to preserve precision because the image's dimensions get rounded to whole numbers.
//        CGFloat aspectRatio = artwork.aspectRatio ?: 1;
//        CGSize size = CGSizeMake(aspectRatio * 1000, 1000);
//        image = [UIImage imageFromColor:[UIColor artsyLightGrey] withSize:size];
//    }
    return image;
}

- (void)setImage:(UIImage *)image
{

    if (image) {
        self.backgroundColor = [UIColor whiteColor];
        [self setAspectRatioConstraintWithImage:image];
        [super setImage:image];
    }
}

- (void)setAspectRatioConstraintWithImage:(UIImage *)image
{
    [self removeConstraints:self.constraints];
    CGFloat ratio = image.size.height/image.size.width;
    NSLayoutConstraint *constraint1 = [NSLayoutConstraint
                                      constraintWithItem:self
                                      attribute:NSLayoutAttributeHeight
                                      relatedBy:NSLayoutRelationEqual
                                      toItem:self
                                      attribute:NSLayoutAttributeWidth
                                      multiplier:ratio
                                      constant:0];
    constraint1.priority = 750;

    NSLayoutConstraint *constraint2 = [NSLayoutConstraint
                                       constraintWithItem:self
                                       attribute:NSLayoutAttributeHeight
                                       relatedBy:NSLayoutRelationLessThanOrEqual
                                       toItem:self
                                       attribute:NSLayoutAttributeWidth
                                       multiplier:ratio
                                       constant:0];
    constraint2.priority = 1000;

    [self addConstraint:constraint1];
    [self addConstraint:constraint2];
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, UIViewNoIntrinsicMetric);
}

@end
