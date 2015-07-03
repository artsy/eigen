

@interface ARCrossfadingImageView : UIImageView

@property (nonatomic, readwrite) BOOL shouldLoopImages;

@property (nonatomic) NSInteger currentIndex;

/// Setting images resets currentIndex to 0
@property (nonatomic, copy) NSArray *images;

/// Interpolate between image[currentIndex] and
/// image[currentIndex + 1] with 0.f <= t <= 1.f
- (void)up:(CGFloat)t;

/// Interpolate between image[currentIndex] and
/// image[currentIndex - 1] with  0.f <= t <= 1.f
- (void)down:(CGFloat)t;

@end
