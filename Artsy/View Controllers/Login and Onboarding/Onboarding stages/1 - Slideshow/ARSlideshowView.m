#import "ARSlideshowView.h"

#define TRANSITION_DURATION .15

@interface ARSlideshowView ()
@property (nonatomic, readonly, copy) NSArray *slides;
@property (nonatomic, assign) NSInteger index;
@property (nonatomic) UIImageView *imageView;
@end

@implementation ARSlideshowView

- (instancetype)initWithSlides:(NSArray *)slides
{
    self = [super init];
    if (self) {
        _slides = slides;
        _index = 0;
        _imageView = [[UIImageView alloc] init];
        [self addSubview:_imageView];
        _imageView.image = _slides[0];
        _imageView.contentMode = UIViewContentModeScaleAspectFill;
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.imageView.frame = self.bounds;
}

- (BOOL)hasNext
{
    return (self.index < (self.slides.count - 1));
}

- (void)next
{
    if (!self.hasNext) {
        return;
    }

    self.index++;

    UIImage *nextImage = self.slides[self.index];
    self.imageView.image = nextImage;
}

@end
